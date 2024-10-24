"use client";
import React, { Suspense } from 'react';
import OTPVerification from '@/components/OTPVerification';
import { useSearchParams } from 'next/navigation';

// PageContent component that handles search params
const PageContent = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const password = searchParams.get('password') || '';
  const receivedOtp = searchParams.get('otp') || '';

  return (
    <div>
      <OTPVerification email={email} pass={password} ReceivedOtp={receivedOtp} />
    </div>
  );
};

// Main Page component wrapped with Suspense
const Page = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <PageContent />
  </Suspense>
);

export default Page;
