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
    <div className="relative w-full min-h-screen overflow-hidden bg-gray-50 flex items-center">
      {/* Background image */}
      <div className="absolute inset-0 -z-0">
        <img
          src="src/images/loginBg.png"            /* make sure this file is in /public/assets */
          alt="background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main section (centered grid) */}
      <section className="relative w-full px-4 md:px-10 xl:px-16 py-10 md:py-16">
        <div className="mx-auto max-w-[1500px] grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* LEFT: brand/info text */}
          <div className="order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left font-[Poppins]">
            <img
              src="src/images/chembizzlogo.png"   /* place in /public/assets */
              alt="ChemBizz Logo"
              className="w-[220px] md:w-[280px] xl:w-[301px] h-auto object-contain mb-6"
            />

            <div className="max-w-[600px] text-[#0A122A]">
              <h2 className="text-[#0C62BF] font-bold text-2xl md:text-[36px] leading-tight mb-4">
                Verify Your Email
              </h2>

              <p className="text-[16px] md:text-[18px] font-normal leading-[160%] mb-6">
                <span className="font-bold text-[#004AAD]">Welcome to ChemBizz!</span><br />
                We’ve sent a verification link to your registered email address.
                Verifying your email helps keep your account secure and enables all features.
              </p>

              <h3 className="text-[#0C62BF] font-semibold text-[20px] md:text-[24px] leading-[120%] mb-3">
                Why verification matters
              </h3>
              <p className="text-[16px] font-normal leading-[160%] mb-3">
                Email verification lets us confirm it’s really you. It prevents unauthorized access and ensures you receive important updates about orders, inventory, and account activity.
              </p>
              <p className="text-[#0C62BF] font-semibold text-[16px] leading-[150%]">
                Didn’t get it? Check your spam folder or request a new link from the login page.
              </p>
            </div>
          </div>

          {/* RIGHT: status card */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div
              className="
                w-full max-w-[640px]
                bg-white/95 backdrop-blur-md
                border border-[#0077B3]
                rounded-tl-[50px] rounded-tr-[10px] rounded-br-[10px] rounded-bl-[50px]
                shadow-[0_10px_30px_rgba(0,74,173,0.15)]
                px-8 sm:px-10 md:px-12
                py-14 sm:py-16
                text-center font-[Poppins]
                flex flex-col items-center justify-center
              "
            >
              {/* Logo / status icon */}
              <div className="mx-auto mb-8">
                {loading ? (
                  <div className="animate-spin mx-auto h-14 w-14 border-4 border-[#0C62BF] border-t-transparent rounded-full" />
                ) : status === "success" ? (
                  <img src="src/images/chembizzlogo.png" alt="ChemBizz" className="w-[110px] mx-auto" />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mx-auto h-16 w-16 text-red-500"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                )}
              </div>

              {/* Heading & message */}
              {loading ? (
                <>
                  <h1 className="text-[#0C62BF] text-2xl md:text-[28px] font-bold">Verifying your email…</h1>
                  <p className="mt-3 text-sm md:text-base text-gray-700">Please wait while we validate your link.</p>
                </>
              ) : status === "success" ? (
                <>
                  <h1 className="text-[#0C62BF] text-2xl md:text-[28px] font-bold">Email Verified!</h1>
                  <p className="mt-3 text-sm md:text-base text-gray-700 leading-[160%]">
                    {message || "Your email was verified successfully. You can now sign in to your account."}
                  </p>
                  <div className="mt-10 flex items-center justify-center gap-4">
                    <button
                      onClick={() => navigate("/login")}
                      className="bg-[#004AAD] hover:bg-[#003d8f] text-white px-6 py-3 rounded-md font-semibold transition"
                    >
                      Sign In
                    </button>
                    <Link
                      to="/"
                      className="border border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-md font-medium transition"
                    >
                      Home
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <h1 className="text-red-600 text-2xl md:text-[28px] font-bold">Verification Failed</h1>
                  <p className="mt-3 text-sm md:text-base text-gray-700 leading-[160%]">
                    {message || "The link is invalid or has expired. Please request a new verification link."}
                  </p>
                  <div className="mt-10 flex items-center justify-center gap-4">
                    <button
                      onClick={() => window.location.reload()}
                      className="bg-[#004AAD] hover:bg-[#003d8f] text-white px-6 py-3 rounded-md font-semibold transition"
                    >
                      Retry
                    </button>
                    <button
                      onClick={() => navigate("/login")}
                      className="border border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-md font-medium transition"
                    >
                      Go to Login
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EmailVerifySuccess;