import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Helper function to get Stripe instance
function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not set');
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature found' },
        { status: 400 }
      );
    }

    // التحقق من صحة webhook من Stripe
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('⚠️ خطأ في التحقق من Webhook signature:', err.message);
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${err.message}` },
        { status: 400 }
      );
    }

    // معالجة أحداث Stripe المختلفة
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        console.log('✅ تم إتمام الدفع بنجاح:', session.id);

        // تحديث حالة الطلب في قاعدة البيانات
        const { error: updateError } = await supabase
          .from('orders')
          .update({
            payment_status: 'paid',
            order_status: 'processing',
            stripe_payment_intent: session.payment_intent as string,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_session_id', session.id);

        if (updateError) {
          console.error('❌ خطأ في تحديث حالة الطلب:', updateError);
        }

        // TODO: يمكن إضافة منطق إضافي هنا:
        // - إرسال بريد إلكتروني للعميل
        // - تحديث المخزون
        // - إشعار الإدارة بالطلب الجديد

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        console.log('❌ فشل الدفع:', paymentIntent.id);

        // تحديث حالة الطلب إلى فشل
        const { error: updateError } = await supabase
          .from('orders')
          .update({
            payment_status: 'failed',
            stripe_payment_intent: paymentIntent.id,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_payment_intent', paymentIntent.id);

        if (updateError) {
          console.error('❌ خطأ في تحديث حالة الطلب الفاشل:', updateError);
        }

        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;

        console.log('🔄 تم استرداد المبلغ:', charge.id);

        // تحديث حالة الطلب إلى مسترد
        const { error: updateError } = await supabase
          .from('orders')
          .update({
            payment_status: 'refunded',
            order_status: 'cancelled',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_payment_intent', charge.payment_intent as string);

        if (updateError) {
          console.error('❌ خطأ في تحديث حالة الاسترداد:', updateError);
        }

        break;
      }

      default:
        console.log(`⚪ حدث غير معالج: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('❌ خطأ في معالجة webhook:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
