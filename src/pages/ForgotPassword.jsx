import React, { useEffect, useState } from 'react'
import 'react-phone-input-2/lib/style.css'
import { Link, useNavigate } from 'react-router-dom'
import headerImage from "../images/blue-background.png"
import { FiLogIn } from "react-icons/fi"; // add this at the top

// toaster 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

import loader from "../images/loading.png"
import { BASE_URL } from '../BASE_URL';


const ForgotPassword = () => {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)

  const [mail, setMail] = useState("");
  const [emailList, setEmailList] = useState([]);

  const fetchEmailData = async () => {
    const res = await fetch(`${BASE_URL}company/emailList`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await res.json()
    setEmailList(data.data);
  }

  useEffect(() => {
    fetchEmailData();
  }, []);

  const handleChange = (e) => {
    const lowercaseEmail = e.target.value.toLowerCase();
    setMail(lowercaseEmail);
  }

  const handleSubmit = async () => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!mail || !mail.trim()) {
      toast.error('Please Enter Registered Email Address!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    if (!emailRegex.test(mail.trim())) {
      toast.error('Please Enter Valid Email Address!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    setLoading(true)

    try {
      const response = await axios.post(
        `${BASE_URL}api/otp/send_otp`,
        {
          emailid: mail,
        },
      );

      if (response.status === 200) {
        navigate("/verify-otp", { state: { email: mail.trim() } })
        toast.success('Otp Sent Successfully.', {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 2000,
        });
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      console.error("Error adding category:", error.message);
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
    }

    // const isEmailRegistered = emailList.some(item => item.emailid.toLowerCase() === mail.trim().toLowerCase());
    // if (!isEmailRegistered) {
    //   toast.error('Email Address not found!', {
    //     position: toast.POSITION.BOTTOM_RIGHT,
    //     autoClose: 1000,
    //   });
    //   return;
    // }
  }

return (
  <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gray-50">
    {/* Background Image */}
    <div className="absolute inset-0 -z-0">
      <img
        src="src/images/loginBg.png"
        alt="background"
        className="w-full h-full object-cover"
      />
    </div>

    {/* Toast */}
    {toast.show && (
      <div
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          padding: "12px 24px",
          borderRadius: 8,
          background: toast.type === "error" ? "#ef4444" : "#10b981",
          color: "white",
          fontWeight: 500,
          zIndex: 10000,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        {toast.message}
      </div>
    )}

    {/* Main Section */}
    <section className="relative w-full px-4 md:px-10 xl:px-16 py-10 md:py-16 flex items-center justify-center">
      <div className="mx-auto max-w-[1500px] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center justify-center">
        {/* LEFT: Logo + Text */}
       <div className="order-2 lg:order-1 text-center lg:text-left flex flex-col items-center lg:items-start">
  {/* Logo */}
  <img
    src="src/images/chembizzlogo.png"
    alt="ChemBizz Logo"
    className="w-[220px] md:w-[280px] xl:w-[301px] h-auto object-contain mb-6"
  />

  {/* Text Section */}
  <div className="max-w-[600px] text-[#0A122A] font-[Poppins]">
    {/* Main Heading */}
    <h2 className="text-[#0C62BF] font-bold text-2xl md:text-[36px] leading-tight mb-4">
      Forgot Your Password?
    </h2>

    {/* Sub Heading */}
    <p className="text-[16px] md:text-[18px] font-normal leading-[160%] mb-6">
      <span className="font-bold text-[#004AAD]">Don’t worry</span> — it happens to the best of us.
      <br />
      Enter your registered email address, and we’ll send you a link to reset your password.
    </p>

    {/* Section 2 */}
    <h3 className="text-[#0C62BF] font-semibold text-[20px] md:text-[24px] leading-[120%] mb-3">
      Reset Your Password Securely
    </h3>
    <p className="text-[16px] font-normal leading-[160%] mb-3">
      For your account’s safety, we’ll send a password reset link to your registered email. 
      Your account security is our top priority.
    </p>
    <p className="text-[16px] font-normal leading-[160%] mb-6">
      We’ll guide you step-by-step to regain access to your account.
    </p>

    {/* Final Note */}
    <p className="text-[#0C62BF] font-semibold text-[16px] leading-[150%]">
      Please check your inbox (and spam folder) for further instructions.
    </p>
  </div>
</div>


        {/* RIGHT: Forgot Password Card */}
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
              h-auto
              flex flex-col items-center justify-center
            "
          >
            <h1 className="text-center text-[#004aad] text-2xl md:text-[32px] font-bold">
              Forgot Password
            </h1>
            <p className="text-center text-sm md:text-base text-gray-600 mt-3 max-w-[400px]">
              If you forgot password, kindly enter your email below to restore the password  
            </p>

            {/* Input Field */}
            <div className="mt-10 w-full max-w-[450px]">
               
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={mail}
                onChange={handleChange}
                   className="w-full h-[50px] border border-gray-300 rounded-md pr-[50px] pl-4 text-[16px] outline-none focus:border-[#004aad] transition"
                />
                <div className="absolute top-0 right-0 w-[50px] h-[50px] bg-[#0077B3] rounded-r-md flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M3 7l9 6 9-6" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Continue Button */}
               <button
                  // onClick={handleNavigate}
                  disabled={loading}
                  className={`mt-8 w-full h-[50px] flex items-center justify-center gap-3 rounded-md text-white font-semibold text-[16px] transition-all duration-300 ${
                    loading
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-[#0077B3] hover:bg-[#00AEEF]"
                  }`}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        ></path>
                      </svg>
                      loading...
                    </>
                  ) : (
                    <>
                     Continue
                      <FiLogIn className="text-[20px]" /> {/* Icon on right side */}
                    </>
                  )}
                </button>

            {/* Back to login */}
            <p className="mt-10 text-center text-sm text-gray-500">
              Go Back To {" "}
              <Link to="/login" className="text-[#004aad] font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Loader Overlay */}
    {loading && (
      <div className="fixed inset-0 flex items-center justify-center bg-white/70 z-50">
        <img
          src="https://chembizzstorage.blob.core.windows.net/chembizz-files/loader1.gif"
          alt="Loading..."
          className="w-20 h-20"
        />
      </div>
    )}
  </div>
);


}

export default ForgotPassword