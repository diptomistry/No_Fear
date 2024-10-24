"use client";
import React, { useState, useContext,useEffect } from "react";
import AuthTitle from "../ui/AuthTitle";
import GoogleIcon from "../ui/GoogleIcon";
import AuthButton from "./AuthButton";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { signIn, useSession } from "next-auth/react";
import { UserContext } from "../UserProvider";
import { useRouter } from "next/navigation"; // Import useRouter for navigation



const Auth = () => {
 const { data: session } = useSession()
 
  const [rememberMe, setRememberMe] = useState(false); // State to store remember me checkbox
  const [email, setEmail] = useState(""); // State to store email input
  const [password, setPassword] = useState(""); // State to store
  const { login } = useContext(UserContext) ?? {}; // Add fallback to avoid undefined errors
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [isSignup, setIsSignup] = useState(false); // State to toggle between login and signup modes
  const [error, setError] = useState(""); // State to store error messages
  const router = useRouter(); 
  const [loginFlag, setLoginFlag] = useState(true);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleMode = () => {
    setIsSignup(!isSignup); // Toggle between sign up and login
  };
  useEffect(() => {
    if (session && session.user) {
      const googleEmail = session.user.email;
      console.log(googleEmail,isSignup);
      if (googleEmail) {
        if (isSignup && !loginFlag) {
          handleGoogleSignup(googleEmail); // Handle Google Signup
        } else {
          handleGoogleLogin(googleEmail); // Handle Google Login
        }
      }
    }
  }, [session,isSignup]);
  
        
  const handleGoogleLogin = async (googleEmail: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    try {
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: googleEmail, password: '' }), // Send email and empty password
      });

      const data = await response.json();
    
      if (response.ok && data.success) {
        login?.(data.data); 
        localStorage.setItem('token', data.data.token);

        if (rememberMe) {
          localStorage.setItem('email', googleEmail);
        } else {
          localStorage.removeItem('email');
        }

        window.location.href = "/dashboard"; // Redirect to dashboard after successful login
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
        console.log(error);
      }
    } catch (error) {
      setError('An error occurred during login. Please try again.');
    }
  };

  const handleSignUp = () => {
    // Navigate to email verification page and pass email and password as query parameters
    router.push(`/auth/emailVerify?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
  };
  const handleGoogleSignup = (googleEmail: string) => {
    router.push(`/auth/verifiedEmail?email=${encodeURIComponent(googleEmail)}`);
  }

  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      console.log(email,password);
      const response = await fetch( `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data);
      
    // console.log(data.token);
console.log(data);
      if (response.ok) {
        login?.(data); 
        localStorage.setItem('token', data.token);

        if (rememberMe) {
          localStorage.setItem('email', email);
          localStorage.setItem('password', password);
        } else {
          localStorage.removeItem('email');
          localStorage.removeItem('password');
        }
        window.location.href = "/dashboard/home"; // Redirect to dashboard after successful login
      } else {
        setError( 'Login failed. Please check your credentials.'); // Show specific error message
      }
    } catch (error) {
      setError('An error occurred during login. Please try again.');
    }
  };
  const handleGoogleButtonClickSignin = () => {
    setLoginFlag(true);
    signIn("google");
  };
  const handleGoogleButtonClickSignup = () => {
    setLoginFlag(false);
    signIn("google");
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <AuthTitle text1={isSignup ? "Signup" : "Login"} text2={"Now"} />
            <div className="mt-5">
              <label
                className="font-semibold text-sm text-gray-600 pb-1 block"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                type="email"
                id="email"
                value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
                
              />
              <label
                className="font-semibold text-sm text-gray-600 pb-1 block"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <FaEye className=" text-gray-200 mb-3" size={24} />
                  ) : (
                    <FaEyeSlash className=" text-gray-600 mb-3" size={24} />
                  )}
                </button>
              </div>
            </div>

            {!isSignup && (
              <div className="flex justify-around">
                <div>
                  <input
                    type="checkbox"
                    name="remember"
                    id="remember"
                    className="mr-2"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember" className="text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
                <div>
                  <a
                    className="text-xs font-display font-semibold text-gray-500 hover:text-gray-600 cursor-pointer"
                    href="auth/recovery"
                  >
                    Forgot Password?
                  </a>
                </div>
              </div>
            )}

            {isSignup && (
              <div className="flex justify-center w-full items-center mt-5">
              <div>
                <button
                  className="flex items-center justify-center py-2 sm:px-20 px-10 bg-white hover:bg-gray-200 focus:ring-purple focus:ring-offset-gray-200 text-gray-700 w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                  onClick={handleGoogleButtonClickSignup}
                >
                  <GoogleIcon
                    text={
                      "Sign up with Google"
                    }
                  />
                </button>
              </div>
            </div>
            )}
            {!isSignup && (
              <div className="flex justify-center w-full items-center mt-5">
              <div>
                <button
                  className="flex items-center justify-center py-2 sm:px-20 px-10 bg-white hover:bg-gray-200 focus:ring-purple focus:ring-offset-gray-200 text-gray-700 w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                  onClick={handleGoogleButtonClickSignin}
                >
                  <GoogleIcon
                    text={
                       "Sign in with Google"
                    }
                  />
                </button>
              </div>
            </div>
            )}


            <div
              className="mt-5"
            >
              {isSignup ? (
                <div onClick={handleSignUp}>
                  <AuthButton buttonText={"Signup"} />
                </div>
              ) : (
                <div onClick={handleLogin}>
                  <AuthButton buttonText={"Login"} />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-4">
              <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
              <a
                className="text-xs text-gray-500 uppercase underline hover:text-purple"
                href="#"
                onClick={toggleMode} // Toggle between modes when clicked
              >
                {isSignup ? "Or Login" : "Or Sign up"}
              </a>
              <span className="w-1/5 border-b dark:border-gray-400 md:w-1/4"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
