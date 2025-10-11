import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../BASE_URL";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmailVerifySuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  // token can come from ?token=... or /:token
  const query = new URLSearchParams(location.search);
  const tokenFromQuery = query.get("token");
  const tokenFromParams = params.token;
  const token = tokenFromQuery || tokenFromParams || "";

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null); // success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No token found in the verification link.");
      setLoading(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await axios.get(`${BASE_URL}company/verify-email`, {
          params: { token },
        });

        if (res.status === 200) {
          setStatus("success");
          setMessage(res.data?.message || "Email verified successfully!");
          toast.success(res.data?.message || "Email verified successfully!");
        } else {
          throw new Error(res.data?.message || "Verification failed.");
        }
      } catch (err) {
        const errMsg =
          err?.response?.data?.message ||
          "Verification failed or link expired.";
        setStatus("error");
        setMessage(errMsg);
        toast.error(errMsg);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {/* <ToastContainer /> */}
      <div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center"
      >
        {loading ? (
          <>
            <div className="animate-spin mx-auto h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800">
              Verifying your email...
            </h2>
            <p className="text-gray-500 mt-2">
              Please wait while we validate your link.
            </p>
          </>
        ) : status === "success" ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto mb-4 h-20 w-20 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-green-600">
              Email Verified!
            </h2>
            <p className="text-gray-600 mt-2">{message}</p>

            <div className="flex gap-4 justify-center mt-6">
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Go to Login
              </button>
              <Link
                to="/"
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Back to Home
              </Link>
            </div>
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto mb-4 h-20 w-20 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <h2 className="text-2xl font-bold text-red-600">
              Verification Failed
            </h2>
            <p className="text-gray-600 mt-2">{message}</p>

            <div className="flex gap-4 justify-center mt-6">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Go to Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerifySuccess;
