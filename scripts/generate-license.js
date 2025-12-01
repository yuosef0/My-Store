#!/usr/bin/env node

/**
 * License Key Generator
 * يولد license key عشوائي لحماية الموقع
 */

const crypto = require('crypto');

function generateLicenseKey() {
  // توليد random bytes
  const randomBytes = crypto.randomBytes(32);

  // تحويلها لـ hex string
  const licenseKey = randomBytes.toString('hex');

  return licenseKey;
}

function main() {
  console.log('\n🔐 License Key Generator\n');
  console.log('═'.repeat(60));

  const licenseKey = generateLicenseKey();

  console.log('\n✓ License key generated successfully!\n');
  console.log('Copy this key to your .env file:\n');
  console.log('NEXT_PUBLIC_LICENSE_KEY=' + licenseKey);
  console.log('\n═'.repeat(60));
  console.log('\n⚠️  IMPORTANT:');
  console.log('   1. Keep this key secret');
  console.log('   2. Add it to your .env file');
  console.log('   3. Add it to your Vercel environment variables');
  console.log('   4. Never commit .env to git\n');
}

main();
