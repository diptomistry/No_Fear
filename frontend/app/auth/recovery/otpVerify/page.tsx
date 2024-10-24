"use client";
import AuthTitle from "@/components/ui/AuthTitle";
import React, { useEffect, useState,useContext } from "react";
import CustomModal from "@/components/CustomModal"; // Make sure the path is correct
import AuthButton from "@/components/auth/AuthButton";
import axios from "axios";
import { useSearchParams } from "next/navigation";  
import { UserContext } from "@/components/UserProvider";



const EmailVerificationPage = () => {

  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const RecoveryOtp = sessionStorage.getItem("RecoveryOtp");
  console.log(RecoveryOtp);
  const [loading, setLoading] = useState(false);
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  if (user && 'id' in user) {
    console.log(user.id);
  } else {
    console.log("User or userID is not available");
  }

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    console.log("OTP matched",otp,RecoveryOtp);
    e.preventDefault();
    if (otp === RecoveryOtp) {
       
      // Open modal if OTP matches
      setModalOpen(true);
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      console.log("OTP expired");
    }
  }, [timer]);

  const sendOtp = async () => {
    setLoading(true);
    try {
        console.log(email);
      const response = await axios.post(
        "http://localhost:8000/api/auth/send-otp",
        {
          email,
          debug: false,
        }
      );
console.log(response.data);
      if (response.data.success) {
        alert("OTP sent successfully");
        sessionStorage.setItem("RecoveryOtp", response.data.otp);
        setTimer(30);
        //set otp to session storage
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error sending OTP:",
          error.response?.data || error.message
        );
      } else {
        console.error("Unexpected error:", error);
      }
      alert("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    
    }
  };



  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
  };

const handleSubmitNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
        try {
            console.log('bb', email);
            const response = await fetch("http://localhost:8000/api/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email, // Pass the email from props
                    current_pass: newPassword,
                    confirm_pass: confirmPassword,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                console.log("New password set:", newPassword);
                alert("Password reset successfully.");
                //back to login
                window.location.href = "/auth";
                setModalOpen(false); // Close the modal on success
            } else {
                alert(data.message || "Failed to reset password.");
            }
        } catch (error) {
            console.error("Error resetting password:", error);
            alert("An error occurred. Please try again.");
        }
    } else {
        alert("Passwords do not match!");
    }
};

  return (
    <div className="flex items-center justify-center h-screen bg-black-100">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <AuthTitle text1="Email" text2="Verification" />
            <div className="mt-5">
              <label
                className="font-semibold text-sm text-gray-600 pb-1 block"
                htmlFor="otp"
              >
                Enter the OTP sent to your email
              </label>
              <input
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                type="text"
                id="otp"
                value={otp}
                onChange={handleOtpChange}
                placeholder="OTP"
              />
            </div>

            {timer > 0 ? (
              <button
                className="mt-5 w-full"
                onClick={handleVerifyOtp}
               
              >
                <AuthButton buttonText="Verify OTP" />
              </button>
            ) : (
              <div className="mt-5 w-full  ">
                <span className="text-gray-500 bg-gray-300 py-2 px-4 rounded">
                  Verify OTP
                </span>
              </div>
            )}

            <div className="mt-4 text-center flex mr-2">
              <p className="text-sm text-gray-500">
                {timer > 0 ? `OTP will expire in ${timer}s` : "OTP expired."}
              </p>
              {timer === 0 && (
                <button
                  className="text-xs text-blue-500 underline"
                  onClick={sendOtp}
                  disabled={loading}
                >
                  {loading ? "Sending OTP..." : "Resend OTP"}
                </button>
              )}
            </div>

            <div className="flex items-center justify-between mt-4">
              <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
              <a
                className="text-xs text-gray-500 uppercase underline hover:text-purple"
                href="/auth" // Redirect back to login
              >
                Back to Login
              </a>
              <span className="w-1/5 border-b dark:border-gray-400 md:w-1/4"></span>
            </div>
          </div>
        </div>
      </div>

      <CustomModal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        ChildrenStyle="p-4"
      >
        <h2 className="text-lg font-semibold mb-4">Set New Password</h2>
        <form onSubmit={handleSubmitNewPassword}>
          <div className="mb-4">
            <label
              className="block text-sm font-semibold text-gray-600 mb-1"
              htmlFor="new-password"
            >
              New Password
            </label>
            <input
              className="border rounded-lg px-3 py-2 w-full text-sm text-white-100"
              type="password"
              id="new-password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              placeholder="New Password"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-semibold text-gray-600 mb-1"
              htmlFor="confirm-password"
            >
              Confirm Password
            </label>
            <input
              className="border rounded-lg px-3 py-2 w-full text-sm text-white-100"
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Confirm Password"
              required
            />
          </div>
          <button type="submit" className="w-full mt-5">
           <AuthButton buttonText="Set New Password" />
          </button>
        </form>
      </CustomModal>
    </div>
  );
};

export default EmailVerificationPage;
