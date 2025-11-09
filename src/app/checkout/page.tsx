"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { supabase } from "../../lib/supabaseClient";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, clearCart } = useCart();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // حساب المجموع الكلي
  const totalAmount = cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  // تحميل بيانات المستخدم من profiles
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (data && !error) {
          setName(data.full_name || "");
          setPhone(data.phone || "");
          setAddress(data.address || "");
          setCity(data.city || "");
          setEmail(user.email || "");
        }
      } catch (error) {
        // في حالة الخطأ، نستخدم بيانات user_metadata
        setName(user.user_metadata?.full_name || "");
        setEmail(user.email || "");
      }
    };

    loadUserData();
  }, [user]);

  // معالجة الدفع
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (cart.length === 0) {
        setError("سلة التسوق فارغة");
        setLoading(false);
        return;
      }

      if (!name || !phone || !address || !city) {
        setError("يرجى ملء جميع الحقول");
        setLoading(false);
        return;
      }

      // إرسال الطلب إلى API
      const response = await fetch("/api/paymob/payment-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart,
          customerInfo: {
            name,
            email,
            phone,
            address,
            city,
          },
          userId: user?.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "حدث خطأ في معالجة الطلب");
      }

      // حفظ orderId في localStorage
      localStorage.setItem("currentOrderId", data.orderId);

      // إعادة توجيه إلى صفحة الدفع Paymob
      const paymentUrl = `https://accept.paymob.com/api/acceptance/iframes/${data.iframeId}?payment_token=${data.paymentKey}`;
      window.location.href = paymentUrl;

    } catch (error: any) {
      console.error("خطأ في معالجة الدفع:", error);
      setError(error.message || "حدث خطأ في معالجة الطلب");
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-xl mb-4">يجب تسجيل الدخول أولاً</p>
          <button
            onClick={() => router.push("/login")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            تسجيل الدخول
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-xl mb-4">سلة التسوق فارغة</p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            العودة للتسوق
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">إتمام الطلب</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* معلومات الشحن */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">معلومات الشحن</h2>

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handlePayment}>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">الاسم الكامل</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">رقم الهاتف</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">العنوان</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">المدينة</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
                >
                  {loading ? "جاري المعالجة..." : `الدفع - ${totalAmount.toFixed(2)} جنيه`}
                </button>
              </div>
            </form>
          </div>

          {/* ملخص الطلب */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">ملخص الطلب</h2>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.cartItemId} className="flex gap-4 border-b pb-4">
                  <img
                    src={item.image_url || "/placeholder.png"}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    {item.size && (
                      <span className="text-sm text-gray-600">المقاس: {item.size}</span>
                    )}
                    {item.color && (
                      <span className="text-sm text-gray-600 mr-2">اللون: {item.color}</span>
                    )}
                    <p className="text-gray-600">
                      {item.quantity} × {item.price} جنيه
                    </p>
                    <p className="font-bold text-blue-600">
                      {(item.quantity * item.price).toFixed(2)} جنيه
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">المجموع الفرعي:</span>
                <span className="font-semibold">{totalAmount.toFixed(2)} جنيه</span>
              </div>
              <div className="flex justify-between text-xl font-bold">
                <span>الإجمالي:</span>
                <span className="text-blue-600">{totalAmount.toFixed(2)} جنيه</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
