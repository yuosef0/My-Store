"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { signUpWithEmail, signInWithGoogle, user } = useAuth();
  const router = useRouter();

  // إذا كان المستخدم مسجل الدخول، توجيهه للصفحة الرئيسية
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    // التحقق من تطابق كلمة المرور
    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      setLoading(false);
      return;
    }

    // التحقق من طول كلمة المرور
    if (password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      setLoading(false);
      return;
    }

    const { error } = await signUpWithEmail(email, password, fullName);

    if (error) {
      if (error.message.includes("already registered")) {
        setError("البريد الإلكتروني مسجل بالفعل");
      } else {
        setError(error.message);
      }
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      // سيتم تسجيل الدخول تلقائياً
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError("");

    const { error } = await signInWithGoogle();

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  if (user) {
    return null; // سيتم التوجيه تلقائياً
  }

  // Check if passwords match in real-time
  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const passwordsDontMatch = confirmPassword && password !== confirmPassword;

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#f8f5f5] dark:bg-[#230f0f] p-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-[#230f0f]/50 backdrop-blur-sm p-6 shadow-sm sm:p-8">
        <div className="flex flex-col items-center gap-6">
          {/* Logo and Title */}
          <div className="flex w-full flex-col items-center gap-2 text-center">
            <div className="flex items-center justify-center">
              <svg
                className="h-10 w-10 text-[#e60000]"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                <path d="M3 6h18"></path>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
            <div className="flex flex-col gap-3">
              <h1 className="text-[#1d0c0c] dark:text-gray-200 text-[32px] font-bold leading-tight tracking-tight">
                إنشاء حساب جديد
              </h1>
              <p className="text-[#a14545] dark:text-gray-400 text-sm font-normal leading-normal">
                انضم إلينا لتستمتع بأفضل تجربة تسوق.
              </p>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="w-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg text-sm">
              ✓ تم إنشاء الحساب بنجاح! جارٍ التوجيه...
            </div>
          )}

          {/* Sign Up Form */}
          <form className="flex w-full flex-col gap-4" onSubmit={handleSignUp}>
            {/* Full Name */}
            <label className="flex flex-col flex-1">
              <p className="text-[#1d0c0c] dark:text-gray-200 text-base font-medium leading-normal pb-2">
                الاسم الكامل
              </p>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#1d0c0c] dark:text-gray-200 focus:outline-0 focus:ring-0 border border-[#eacdcd] dark:border-gray-700 bg-[#fcf8f8] dark:bg-[#230f0f]/80 focus:border-[#e60000] dark:focus:border-[#e60000] h-14 placeholder:text-[#a14545] dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                placeholder="ادخل اسمك بالكامل"
              />
            </label>

            {/* Email */}
            <label className="flex flex-col flex-1">
              <p className="text-[#1d0c0c] dark:text-gray-200 text-base font-medium leading-normal pb-2">
                البريد الإلكتروني
              </p>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#1d0c0c] dark:text-gray-200 focus:outline-0 focus:ring-0 border border-[#eacdcd] dark:border-gray-700 bg-[#fcf8f8] dark:bg-[#230f0f]/80 focus:border-[#e60000] dark:focus:border-[#e60000] h-14 placeholder:text-[#a14545] dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                placeholder="ادخل بريدك الإلكتروني"
              />
            </label>

            {/* Password */}
            <label className="flex flex-col flex-1">
              <p className="text-[#1d0c0c] dark:text-gray-200 text-base font-medium leading-normal pb-2">
                كلمة المرور
              </p>
              <div className="flex w-full flex-1 items-stretch rounded-lg">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-[#1d0c0c] dark:text-gray-200 focus:outline-0 focus:ring-0 border border-[#eacdcd] dark:border-gray-700 bg-[#fcf8f8] dark:bg-[#230f0f]/80 focus:border-[#e60000] dark:focus:border-[#e60000] h-14 placeholder:text-[#a14545] dark:placeholder:text-gray-500 p-[15px] rounded-l-none border-l-0 text-base font-normal leading-normal"
                  placeholder="ادخل كلمة المرور"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#a14545] dark:text-gray-400 flex border border-[#eacdcd] dark:border-gray-700 bg-[#fcf8f8] dark:bg-[#230f0f]/80 items-center justify-center px-[15px] rounded-l-lg border-r-0 cursor-pointer hover:text-[#e60000] transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPassword ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </label>

            {/* Confirm Password */}
            <label className="flex flex-col flex-1">
              <p className="text-[#1d0c0c] dark:text-gray-200 text-base font-medium leading-normal pb-2">
                تأكيد كلمة المرور
              </p>
              <div className="flex w-full flex-1 items-stretch rounded-lg">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-[#1d0c0c] dark:text-gray-200 focus:outline-0 focus:ring-0 border ${
                    passwordsDontMatch
                      ? "border-red-500 dark:border-red-500"
                      : "border-[#eacdcd] dark:border-gray-700"
                  } bg-[#fcf8f8] dark:bg-[#230f0f]/80 focus:border-[#e60000] dark:focus:border-[#e60000] h-14 placeholder:text-[#a14545] dark:placeholder:text-gray-500 p-[15px] rounded-l-none border-l-0 text-base font-normal leading-normal`}
                  placeholder="أعد إدخال كلمة المرور"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`text-[#a14545] dark:text-gray-400 flex border ${
                    passwordsDontMatch
                      ? "border-red-500 dark:border-red-500"
                      : "border-[#eacdcd] dark:border-gray-700"
                  } bg-[#fcf8f8] dark:bg-[#230f0f]/80 items-center justify-center px-[15px] rounded-l-lg border-r-0 cursor-pointer hover:text-[#e60000] transition-colors`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showConfirmPassword ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    )}
                  </svg>
                </button>
              </div>
              {passwordsDontMatch && (
                <p className="text-red-500 dark:text-red-400 text-xs pt-1">
                  كلمتا المرور غير متطابقتين.
                </p>
              )}
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-[#e60000] px-4 text-base font-semibold text-white transition-colors hover:bg-[#cc0000] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "جارٍ إنشاء الحساب..." : "إنشاء حساب"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex w-full items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative bg-white/50 dark:bg-[#230f0f]/50 px-2 text-sm text-gray-500 dark:text-gray-400">
              أو
            </div>
          </div>

          {/* Google Sign Up Button */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-lg border border-[#eacdcd] dark:border-gray-700 bg-white/50 dark:bg-[#230f0f]/50 px-4 text-base font-medium text-[#1d0c0c] dark:text-gray-200 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_105_2338)">
                <path
                  d="M22.4775 12.2727C22.4775 11.4545 22.4045 10.6364 22.2545 9.81818H12.2273V14.3182H18.0682C17.7864 15.8636 16.9273 17.1364 15.5455 18.0455V20.7273H19.3318C21.3636 18.8182 22.4775 15.8409 22.4775 12.2727Z"
                  fill="#4285F4"
                />
                <path
                  d="M12.2273 23C15.1409 23 17.6136 22.0227 19.3318 20.7273L15.5455 18.0455C14.5409 18.7273 13.4364 19.1364 12.2273 19.1364C9.88636 19.1364 7.84091 17.6591 7.07273 15.5455H3.14545V18.3182C4.90455 21.1591 8.29545 23 12.2273 23Z"
                  fill="#34A853"
                />
                <path
                  d="M7.07273 15.5455C6.84091 14.8864 6.70455 14.1818 6.70455 13.4545C6.70455 12.7273 6.84091 12.0227 7.07273 11.3636V8.59091H3.14545C2.26364 10.2273 1.75 11.7955 1.75 13.4545C1.75 15.1136 2.26364 16.6818 3.14545 18.3182L7.07273 15.5455Z"
                  fill="#FBBC05"
                />
                <path
                  d="M12.2273 7.77273C13.5727 7.77273 14.7773 8.25 15.6818 9.09091L19.4091 5.36364C17.6136 3.72727 15.1409 2.75 12.2273 2.75C8.29545 2.75 4.90455 4.84091 3.14545 8.59091L7.07273 11.3636C7.84091 9.25 9.88636 7.77273 12.2273 7.77273Z"
                  fill="#EA4335"
                />
              </g>
              <defs>
                <clipPath id="clip0_105_2338">
                  <rect fill="white" height="21" transform="translate(1.75 1.5)" width="21" />
                </clipPath>
              </defs>
            </svg>
            <span>التسجيل باستخدام Google</span>
          </button>

          {/* Login Link */}
          <p className="text-sm text-[#a14545] dark:text-gray-400">
            لديك حساب بالفعل؟{" "}
            <Link href="/login" className="font-semibold text-[#e60000] hover:underline">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
