"use client";

import { useEffect, useState } from 'react';
import { validateDeployment, logDeploymentInfo, shouldBlockApp } from '../lib/license';

export default function LicenseProtection({ children }: { children: React.ReactNode }) {
  const [isBlocked, setIsBlocked] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // تسجيل معلومات الـ deployment
    logDeploymentInfo();

    // التحقق من صلاحية الـ deployment
    const blocked = shouldBlockApp();
    setIsBlocked(blocked);

    // إضافة watermark في console
    if (blocked) {
      const style = 'color: red; font-size: 20px; font-weight: bold; text-shadow: 1px 1px 2px black;';
      console.log('%c⚠️ UNAUTHORIZED DEPLOYMENT ⚠️', style);
      console.log('%cThis is an unauthorized copy of a licensed application.', 'color: orange; font-size: 14px;');
      console.log('%cPlease contact the original owner for licensing.', 'color: orange; font-size: 14px;');
    }
  }, []);

  if (!mounted) {
    return null;
  }

  // في حالة deployment غير مصرح به، عرض رسالة بدلاً من المحتوى
  if (isBlocked) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm">
        <div className="max-w-md p-8 text-center">
          <div className="mb-6">
            <svg
              className="mx-auto h-20 w-20 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="mb-4 text-3xl font-bold text-white">
            Unauthorized Deployment
          </h1>
          <p className="mb-6 text-lg text-gray-300">
            This application is protected by a license and can only run on authorized domains.
          </p>
          <p className="text-sm text-gray-400">
            If you believe this is an error, please contact the application owner.
          </p>
          <div className="mt-8 rounded-lg bg-red-900/30 border border-red-500/50 p-4">
            <p className="text-xs text-red-300">
              Deployment ID: {typeof window !== 'undefined' ? window.location.hostname : 'unknown'}
            </p>
            <p className="mt-1 text-xs text-red-300">
              Timestamp: {new Date().toISOString()}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
