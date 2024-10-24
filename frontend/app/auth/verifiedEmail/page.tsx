"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import AuthTitle from "@/components/ui/AuthTitle";
import AuthButton from "@/components/auth/AuthButton";

// The main form content that uses search params
const FormContent = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const name = email.split("@")[0]; // Example: "john.doe@example.com" => "john.doe"

  const [pass, setPass] = useState(""); // State to store the password
  const [confirmPass, setConfirmPass] = useState(""); // State for confirm password

  const phone = "123-456-7890";
  const dob = "1980-01-01";
  const userType = "admin";
  const registeredFrom = "Hospital";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create the user data object
    const data = {
      name,
      email,
      phone,
      dob,
      gender: "", // You can set this dynamically if needed
      userType,
      password: pass, // Use the entered password
      confirmPass, // Use the confirm password
      registeredFrom,
    };

    try {
      console.log("Sending data:", data);
      const response = await axios.post(
        "http://localhost:8000/api/auth/create-user",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      if (response.data.success) {
        alert("User created successfully");
        window.location.href = "/dashboard";
      } else {
        alert("User creation failed: " + response.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error creating user:", error.response?.data || error.message);
      } else {
        console.error("Error creating user:", error);
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          {/* AuthTitle Component */}
          <div className="text-center mb-6">
            <AuthTitle text1="Create" text2="User" />
          </div>

          {/* Email Display */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              value={email}
              readOnly
              className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full text-gray-500"
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
              className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
            />
          </div>

          {/* Confirm Password Input */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="confirm-password"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              required
              className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
            />
          </div>

          {/* Submit Button */}
          <div className="w-full">
            <button
              type="submit"
              className="w-full"
            >
              <AuthButton buttonText="Create Account" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Page component wrapped with Suspense
const Page = () => (
  <Suspense fallback={<div>Loading form...</div>}>
    <FormContent />
  </Suspense>
);

export default Page;
