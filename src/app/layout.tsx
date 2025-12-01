// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { CartProvider } from "../contexts/CartContext";
import { AuthProvider } from "../contexts/AuthContext";
import { WishlistProvider } from "../contexts/WishlistContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import ConditionalHeader from "../components/ConditionalHeader";
import LicenseProtection from "../components/LicenseProtection";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "متجري - أفضل المنتجات بأسعار مميزة",
  description: "تسوق أفضل المنتجات عبر الإنترنت",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LicenseProtection>
          <ThemeProvider>
            <AuthProvider>
              <WishlistProvider>
                <CartProvider>
                  <Suspense fallback={<div style={{ height: '80px' }} />}>
                    <ConditionalHeader />
                  </Suspense>
                  {children}
                </CartProvider>
              </WishlistProvider>
            </AuthProvider>
          </ThemeProvider>
        </LicenseProtection>
      </body>
    </html>
  );
}