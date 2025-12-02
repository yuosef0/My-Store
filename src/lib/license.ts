// License Protection System
// لا تشارك هذا الملف أو تنشره في مكان عام

interface LicenseConfig {
  allowedDomains: string[];
  licenseKey: string;
  ownerEmail: string;
}

// الدومينات المسموح بها فقط
const ALLOWED_DOMAINS = [
  'localhost',
  '127.0.0.1',
  'my-store-seven-self.vercel.app',
  // أضف دومينات أخرى مسموح بها هنا
];

// License Key - يجب أن يكون موجود في .env
const LICENSE_KEY = process.env.NEXT_PUBLIC_LICENSE_KEY || '';
const OWNER_EMAIL = process.env.NEXT_PUBLIC_OWNER_EMAIL || '';

/**
 * التحقق من صلاحية الـ deployment
 */
export function validateDeployment(): {
  isValid: boolean;
  message: string;
  shouldBlock: boolean;
} {
  // في حالة development mode، السماح دائماً
  if (process.env.NODE_ENV === 'development') {
    return { isValid: true, message: 'Development mode', shouldBlock: false };
  }

  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';

  // التحقق من الـ domain
  const isDomainAllowed = ALLOWED_DOMAINS.some(domain =>
    hostname === domain || hostname.endsWith(`.${domain}`)
  );

  // التحقق من License Key
  const isLicenseValid = LICENSE_KEY && LICENSE_KEY.length > 0;

  if (!isDomainAllowed) {
    return {
      isValid: false,
      message: `⚠️ Unauthorized deployment detected on: ${hostname}`,
      shouldBlock: true
    };
  }

  if (!isLicenseValid) {
    return {
      isValid: false,
      message: '⚠️ Missing or invalid license key',
      shouldBlock: true
    };
  }

  return {
    isValid: true,
    message: '✓ Valid deployment',
    shouldBlock: false
  };
}

/**
 * تسجيل معلومات الـ deployment (للمراقبة)
 */
export function logDeploymentInfo() {
  if (typeof window === 'undefined') return;

  const validation = validateDeployment();
  const deploymentInfo = {
    hostname: window.location.hostname,
    href: window.location.href,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    isValid: validation.isValid,
    owner: OWNER_EMAIL
  };

  // في حالة deployment غير مصرح به، إرسال تنبيه
  if (!validation.isValid) {
    console.error('🚨 UNAUTHORIZED DEPLOYMENT DETECTED 🚨');
    console.error('Deployment Info:', deploymentInfo);
    console.error(validation.message);
    console.error(`This application is licensed to: ${OWNER_EMAIL}`);
    console.error('Contact the owner for licensing information.');

    // يمكنك إضافة API call هنا لإرسال تنبيه لك عبر webhook
    sendUnauthorizedAlert(deploymentInfo);
  } else {
    // في حالة deployment صحيح، تسجيل بسيط
    console.log('License validated successfully');
  }

  return deploymentInfo;
}

/**
 * إرسال تنبيه في حالة deployment غير مصرح به
 */
async function sendUnauthorizedAlert(info: any) {
  try {
    // يمكنك استخدام webhook service مثل Discord أو Telegram أو email
    // مثال باستخدام Discord webhook (اختياري):
    const webhookUrl = process.env.NEXT_PUBLIC_ALERT_WEBHOOK_URL;

    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `🚨 **Unauthorized Deployment Detected**\n\`\`\`json\n${JSON.stringify(info, null, 2)}\n\`\`\``
        })
      });
    }
  } catch (error) {
    // Silent fail - لا نريد أن نعطل الموقع
    console.error('Failed to send alert:', error);
  }
}

/**
 * عرض watermark في حالة deployment غير مصرح به
 */
export function getUnauthorizedWatermark(): string | null {
  const validation = validateDeployment();

  if (!validation.isValid && validation.shouldBlock) {
    return `⚠️ UNAUTHORIZED COPY - Licensed to ${OWNER_EMAIL}`;
  }

  return null;
}

/**
 * منع الموقع من العمل في حالة deployment غير مصرح به
 */
export function shouldBlockApp(): boolean {
  const validation = validateDeployment();
  return validation.shouldBlock;
}
