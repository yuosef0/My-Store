"use client";

import { usePathname } from "next/navigation";
import MainHeader from "./MainHeader";

export default function ConditionalHeader() {
  const pathname = usePathname();

  // إخفاء الـ Header في صفحات الأدمن و Login و Signup فقط
  const hideHeader =
    pathname?.startsWith("/admin") ||
    pathname === "/login" ||
    pathname === "/signup";

  if (hideHeader) {
    return null;
  }

  return <MainHeader />;
}
