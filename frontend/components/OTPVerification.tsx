"use client";
import React, { useState, useRef, useEffect } from "react";
import AuthButton from "./auth/AuthButton";
import axios from "axios";

interface OTPVerificationProps {
  email: string;
  pass: string;
  ReceivedOtp: string; // This should be the OTP received from your backend
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  pass,
  ReceivedOtp,
}) => {
  const [otp, setOtp] = useState(Array(4).fill(""));
  const [timer, setTimer] = useState(30); // Start with 30 seconds
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // Disable the button initially
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Extract name from email (this example uses the part before the @)
  const name = email.split("@")[0]; // Example: "john.doe@example.com" => "john.doe"



  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setIsButtonDisabled(false); // Enable the button when the timer reaches 0
    }
  }, [timer]);

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to the next input
      if (index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const enteredOtp = otp.join(""); // Get the entered OTP as a string

    // Check if the entered OTP matches the received OTP
    if (enteredOtp === ReceivedOtp) {
      const data = {
        name,
        email,
        password: pass, // Use the original password
      
      };

      try {
        console.log("Sending data:", data);
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/register`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      
       if(response.data.token) {
        alert("User created successfully");
        window.location.href = "/dashboard";
       }
      
        // Handle response
        //console.log("Response:", response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(
            "Error creating user:"
           
          );
        } else {
          console.error("Error creating user:", error);
        }
      }
    } else {
      alert("Incorrect OTP. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="max-w-md mx-auto text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow">
        <header className="mb-8">
          <h1 className="text-2xl font-bold mb-1 text-gray-600">
            Email<span className="text-purple"> Verification</span>
          </h1>
          <p className="text-[15px] text-slate-500">
            Enter the 4-digit verification code that was sent to your email.
          </p>
        </header>
        <form id="otp-form" onSubmit={handleSubmit}>
          <div className="flex items-center justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                value={otp[index]}
                onChange={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
              />
            ))}
          </div>
          {isButtonDisabled && (
            <div className="max-w-[260px] mx-auto mt-4 ">
              <AuthButton buttonText="Verify" />
            </div>
          )}
        </form>
        <div className="text-sm text-slate-500 mt-4">
          {isButtonDisabled ? (
            <span>Verify code within {timer} seconds</span>
          ) : (
            <button
              className="font-medium text-indigo-500 hover:text-indigo-600"
              disabled={isButtonDisabled}
              onClick={() => {
                setTimer(30);
                setIsButtonDisabled(true);
                window.location.href = "/auth";
              }}
            >
              <span className="text-gray-500">Try</span>{" "}
              <span className="underline">Sign up</span>{" "}
              <span className="text-gray-500">again</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
