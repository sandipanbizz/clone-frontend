import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import headerImage from "../images/blue-background.png";

const RegisterSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // email was passed in navigate state from CreateAccount
  const email = location?.state?.email || "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg overflow-hidden md:flex">
        {/* Left image column (hidden on small screens) */}
        <div className="hidden md:flex md:w-1/3  relative bg-[#0b1a3a] login-image">
          <img
            src={headerImage}
            alt="header"
            className="w-auto max-h-[27vh] object-contain"
          />
          <div className="absolute inset-0 bg-black opacity-20 rounded-l-2xl pointer-events-none"></div>
        </div>

        {/* Content */}
        <div className="w-full md:w-2/3 p-8 md:p-12">
          <h1 className="text-3xl font-semibold text-darkBlue mb-4">Thank you for registering!</h1>
          <p className="text-sm text-gray-600 mb-6">
            Your account has been created successfully.
          </p>

          {email ? (
            <p className="text-gray-700 mb-6">
              A verification link has been sent to <span className="font-medium">{email}</span>. Please check your inbox (and spam folder) and click the verification link to activate your account.
            </p>
          ) : (
            <p className="text-gray-700 mb-6">
              Please check your email for the verification link to activate your account.
            </p>
          )}

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => navigate("/login")}
              className="bg-darkBlue text-white px-5 py-2 rounded-md font-medium"
            >
              Go to Login
            </button>

            <button
              onClick={() => navigate("/")}
              className="border border-gray-300 px-5 py-2 rounded-md font-medium"
            >
              Back to Home
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-6">
            Didn’t receive the email? If it's been more than a few minutes, check your spam folder or contact support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterSuccess;
