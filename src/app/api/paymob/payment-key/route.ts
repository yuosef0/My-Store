import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Step 1: Get Authentication Token
async function getAuthToken() {
  const response = await fetch("https://accept.paymob.com/api/auth/tokens", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: process.env.PAYMOB_API_KEY,
    }),
  });

  const data = await response.json();
  return data.token;
}

// Step 2: Create Order
async function createOrder(authToken: string, amountCents: number, orderId: string) {
  const response = await fetch("https://accept.paymob.com/api/ecommerce/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      auth_token: authToken,
      delivery_needed: "false",
      amount_cents: amountCents,
      currency: "EGP",
      merchant_order_id: orderId,
    }),
  });

  const data = await response.json();
  return data.id;
}

// Step 3: Get Payment Key
async function getPaymentKey(
  authToken: string,
  amountCents: number,
  paymobOrderId: number,
  billingData: any
) {
  const response = await fetch("https://accept.paymob.com/api/acceptance/payment_keys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      auth_token: authToken,
      amount_cents: amountCents,
      expiration: 3600,
      order_id: paymobOrderId,
      billing_data: billingData,
      currency: "EGP",
      integration_id: parseInt(process.env.PAYMOB_INTEGRATION_ID!),
    }),
  });

  const data = await response.json();
  return data.token;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, customerInfo, userId } = body;

    // التحقق من البيانات
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "سلة التسوق فارغة" },
        { status: 400 }
      );
    }

    if (
      !customerInfo ||
      !customerInfo.name ||
      !customerInfo.phone ||
      !customerInfo.address ||
      !customerInfo.city
    ) {
      return NextResponse.json(
        { error: "يرجى إدخال جميع معلومات العميل" },
        { status: 400 }
      );
    }

    // حساب المجموع الكلي
    const totalAmount = items.reduce((total: number, item: any) => {
      return total + item.price * item.quantity;
    }, 0);

    // تحويل المبلغ إلى قروش (cents)
    const amountCents = Math.round(totalAmount * 100);

    // إنشاء الطلب في قاعدة البيانات أولاً
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          user_id: userId || null,
          customer_name: customerInfo.name,
          customer_email: customerInfo.email || null,
          customer_phone: customerInfo.phone,
          customer_address: customerInfo.address,
          customer_city: customerInfo.city,
          total_amount: totalAmount,
          status: "pending",
          payment_method: "paymob_card",
          items: items,
        },
      ])
      .select()
      .single();

    if (orderError) {
      console.error("خطأ في حفظ الطلب:", orderError);
      return NextResponse.json(
        { error: "حدث خطأ في حفظ الطلب" },
        { status: 500 }
      );
    }

    // Step 1: الحصول على Authentication Token
    const authToken = await getAuthToken();

    // Step 2: إنشاء Order في Paymob
    const paymobOrderId = await createOrder(authToken, amountCents, orderData.id);

    // تحديث الطلب بـ paymob_order_id
    await supabase
      .from("orders")
      .update({ paymob_order_id: paymobOrderId.toString() })
      .eq("id", orderData.id);

    // إعداد بيانات الفواتير
    const billingData = {
      apartment: "NA",
      email: customerInfo.email || "customer@example.com",
      floor: "NA",
      first_name: customerInfo.name.split(" ")[0] || customerInfo.name,
      street: customerInfo.address,
      building: "NA",
      phone_number: customerInfo.phone,
      shipping_method: "NA",
      postal_code: "NA",
      city: customerInfo.city,
      country: "EG",
      last_name: customerInfo.name.split(" ").slice(1).join(" ") || customerInfo.name,
      state: customerInfo.city,
    };

    // Step 3: الحصول على Payment Key
    const paymentKey = await getPaymentKey(
      authToken,
      amountCents,
      paymobOrderId,
      billingData
    );

    // إرجاع Payment Key و Order ID
    return NextResponse.json({
      paymentKey,
      orderId: orderData.id,
      iframeId: process.env.PAYMOB_IFRAME_ID,
    });

  } catch (error: any) {
    console.error("خطأ في إنشاء payment key:", error);
    return NextResponse.json(
      { error: error.message || "حدث خطأ في معالجة الطلب" },
      { status: 500 }
    );
  }
}
