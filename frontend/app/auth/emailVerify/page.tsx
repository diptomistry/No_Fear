"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { Suspense } from "react";

const PageContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email') || '';
  const password = searchParams.get('password') || '';
  const [loading, setLoading] = useState(false);
  

  const sendOtp = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile/send-otp`, {
        email,
       
      });
      console.log(response.data);

      if (response.data) {
        alert("OTP sent successfully");
        router.push(`/auth/emailVerify/otpVerification?email=${email}&password=${password}&otp=${response.data.otp}`);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error sending OTP:", error.response?.data || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      alert("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (email) {
      sendOtp();
    }
  }, [email]);

  return (
    <div className="flex items-center justify-center h-screen">
      {loading ? (
        <p className="text-lg">Sending OTP...</p>
      ) : (
        <p className="text-lg">Please wait while we process your request.</p>
      )}
    </div>
  );
};

const Page = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <PageContent />
  </Suspense>
);

export default Page;
