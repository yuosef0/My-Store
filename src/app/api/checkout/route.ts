import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// تهيئة Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

// تهيئة Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, customerInfo } = body;

    // التحقق من البيانات
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'سلة التسوق فارغة' },
        { status: 400 }
      );
    }

    if (!customerInfo || !customerInfo.name || !customerInfo.email || !customerInfo.address || !customerInfo.city) {
      return NextResponse.json(
        { error: 'يرجى إدخال جميع معلومات العميل' },
        { status: 400 }
      );
    }

    // حساب المجموع الكلي
    const totalAmount = items.reduce((total: number, item: any) => {
      return total + (item.price * item.quantity);
    }, 0);

    // تحويل المنتجات لصيغة Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd', // يمكن تغييرها لـ 'egp' للجنيه المصري
        product_data: {
          name: item.title,
          description: item.description || '',
          images: item.image_url ? [item.image_url] : [],
        },
        unit_amount: Math.round(item.price * 100), // تحويل إلى cents
      },
      quantity: item.quantity,
    }));

    // إنشاء Checkout Session في Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/canceled`,
      customer_email: customerInfo.email,
      metadata: {
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone || '',
        customer_address: customerInfo.address,
        customer_city: customerInfo.city,
      },
    });

    // حفظ الطلب في Supabase
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          customer_name: customerInfo.name,
          customer_email: customerInfo.email,
          customer_phone: customerInfo.phone || null,
          customer_address: customerInfo.address,
          customer_city: customerInfo.city,
          total_amount: totalAmount,
          stripe_session_id: session.id,
          payment_status: 'pending',
          order_status: 'processing',
          items: items,
        },
      ])
      .select()
      .single();

    if (orderError) {
      console.error('خطأ في حفظ الطلب:', orderError);
      // نواصل حتى لو فشل حفظ الطلب، لأن Stripe session تم إنشاؤها
    }

    // إرجاع URL الخاص بصفحة الدفع
    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      orderId: orderData?.id,
    });

  } catch (error: any) {
    console.error('خطأ في إنشاء جلسة الدفع:', error);
    return NextResponse.json(
      { error: error.message || 'حدث خطأ في معالجة الطلب' },
      { status: 500 }
    );
  }
}
