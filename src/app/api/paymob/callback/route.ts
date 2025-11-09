import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// التحقق من صحة HMAC من Paymob
function verifyHMAC(data: any): boolean {
  const {
    amount_cents,
    created_at,
    currency,
    error_occured,
    has_parent_transaction,
    id,
    integration_id,
    is_3d_secure,
    is_auth,
    is_capture,
    is_refunded,
    is_standalone_payment,
    is_voided,
    order,
    owner,
    pending,
    source_data_pan,
    source_data_sub_type,
    source_data_type,
    success,
  } = data;

  // ترتيب القيم حسب ما يتطلبه Paymob
  const concatenatedString = `${amount_cents}${created_at}${currency}${error_occured}${has_parent_transaction}${id}${integration_id}${is_3d_secure}${is_auth}${is_capture}${is_refunded}${is_standalone_payment}${is_voided}${order.id}${pending}${source_data_pan}${source_data_sub_type}${source_data_type}${success}`;

  // حساب HMAC
  const hmac = crypto
    .createHmac("sha512", process.env.PAYMOB_HMAC_SECRET!)
    .update(concatenatedString)
    .digest("hex");

  return hmac === data.hmac;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { obj } = body;

    // التحقق من صحة الطلب باستخدام HMAC
    if (!verifyHMAC(obj)) {
      console.error("HMAC verification failed");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    const paymobOrderId = obj.order.id.toString();
    const transactionId = obj.id.toString();
    const success = obj.success;
    const pending = obj.pending;

    // البحث عن الطلب في قاعدة البيانات
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("paymob_order_id", paymobOrderId)
      .single();

    if (orderError || !orderData) {
      console.error("الطلب غير موجود:", paymobOrderId);
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // تحديث حالة الطلب
    let newStatus = "pending";
    if (success && !pending) {
      newStatus = "paid";
    } else if (!success && !pending) {
      newStatus = "failed";
    }

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: newStatus,
        paymob_transaction_id: transactionId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderData.id);

    if (updateError) {
      console.error("خطأ في تحديث الطلب:", updateError);
      return NextResponse.json(
        { error: "Failed to update order" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Callback processed successfully" });

  } catch (error: any) {
    console.error("خطأ في معالجة callback:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// معالجة GET request لصفحة التأكيد
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const success = searchParams.get("success");
    const orderId = searchParams.get("merchant_order_id");

    if (success === "true" && orderId) {
      // إعادة توجيه إلى صفحة النجاح
      return NextResponse.redirect(
        new URL(`/order-success?orderId=${orderId}`, request.url)
      );
    } else {
      // إعادة توجيه إلى صفحة الفشل
      return NextResponse.redirect(new URL("/order-failed", request.url));
    }
  } catch (error) {
    console.error("خطأ في معالجة GET callback:", error);
    return NextResponse.redirect(new URL("/order-failed", request.url));
  }
}
