import React, { useEffect, useState } from 'react'
import loader from "../images/loading.png"
import 'react-phone-input-2/lib/style.css'
import { Link, useNavigate } from 'react-router-dom'
import headerImage from "../images/blue-background.png"
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import loginBanner from "../images/loginBanner1.png"
import { FiLogIn } from "react-icons/fi"; // add this at the top

// fontawesome icons

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'
import { useAuthContext } from '../context/AuthContext'
import { useSocketContext } from '../context/SocketContext'
import { useNotiContext } from '../context/NotificationContext'
import { BASE_URL } from '../BASE_URL'

const Login = () => {

  const navigate = useNavigate();

  const token = localStorage.getItem("chemicalToken")

  // useEffect(() => {
  //   if (token) {
  //     navigate(-1)
  //   }
  // }, [token]);


  const { setAuthUser } = useAuthContext();
  const { socket } = useSocketContext();
  const { setNotifications } = useNotiContext()

  const [loading, setLoading] = useState(false)

   const [showPassword , setShowPassword] = useState(false);


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleEmail = (e) => {
    const lowercaseEmail = e.target.value.toLowerCase();
    setEmail(lowercaseEmail);
  }

  const handlePassword = (e) => {
    setPassword(e.target.value)
  }

  const handleNotification = (newMessage) => {

  };

  const handleNavigate = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      toast.error("Please Enter Email!", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    if (!emailRegex.test(email.trim())) {
      toast.error("Invalid Email Format!", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    if (!password) {
      toast.error("Please Enter Password!", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}company/login`,
        {
          emailid: email,
          password: password,
        }
      );

      if (response.status === 200) {
        const { user, token } = response.data;
        const { membership_status, booking_date, plan_days, catalog_limit, _id, emailid } = user;

        // console.log(membership_status)

        if (membership_status === "paid") {
          // Calculate plan expiration
          const bookingDate = new Date(booking_date);
          const expiryDate = new Date(bookingDate);
          expiryDate.setDate(bookingDate.getDate() + plan_days);

          const currentDate = new Date();

          if (currentDate > expiryDate) {
            // await axios.put(`${BASE_URL}api/membership_plan/updateStatus`);
            navigate('/company/home')
          } else {
            localStorage.setItem("catalogLimit", catalog_limit);
            localStorage.setItem("bookingDate", booking_date);
            navigate('/company/home')
          }
          localStorage.setItem("chemicalToken", token);
          localStorage.setItem("myCompanyId", _id);
          localStorage.setItem("myEmailId", emailid);
          localStorage.setItem("membershipStatus", membership_status);
          navigate('/company/home')

        } else {
          localStorage.setItem("chemicalToken", token);
          localStorage.setItem("myCompanyId", _id);
          localStorage.setItem("myEmailId", emailid);
          localStorage.setItem("membershipStatus", membership_status);
          
          navigate('/company/home')
        }

        setLoading(false);
        setAuthUser({ id: _id });

        socket?.on("loginNotification", (newMessage) => {
          handleNotification(newMessage);
          setNotifications(newMessage);
        });
        navigate('/company/home')
      } else {
        setLoading(false);
        toast.error("An Error Happened In Login. Please Try Again Later!", {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 1000,
        });
      }
    } catch (error) {
      setLoading(false);
      console.error("Error adding category:", error.response.data.message);
      toast.error(error.response.data.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
    }
  };


  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleNavigate();
    }
  };
 

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">

      {/* ✅ Toast Notification */}
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

      {/* ✅ Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="src/images/loginBg.png"
          alt="background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* ✅ Centered Section */}
      <section className="relative z-10 w-full flex items-center justify-center bg-transparent">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16 lg:gap-24 px-6 md:px-12 lg:px-20 py-8 md:py-16 w-full max-w-[1300px]">

          {/* LEFT: Logo + Text */}
          <div className="order-2 lg:order-1 flex flex-col justify-center lg:items-start items-center text-center lg:text-left space-y-5">
            <img
              src="src/images/chembizzlogo.png"
              alt="ChemBizz Logo"
              className="w-[250px] md:w-[300px] h-auto object-contain rounded-2xl"
            />
            <h2 className="text-[#0C62BF] font-bold text-2xl md:text-[38px] leading-tight md:leading-[60px]">
              Smart Control. Secure Trade.
            </h2>
            <p className="text-[#000000] text-base md:text-[18px] leading-7 max-w-[600px]">
              Connect buyers, suppliers, and data — all through ChemBizz.
              Monitor inventory, orders, and customers from anywhere.
            </p>
            <p className="text-[#000000] text-base md:text-[18px] leading-7 max-w-[600px]">
              Login to take charge of your chemical business  
            </p>

          </div>

          {/* RIGHT: Login Card */}
          <div className="order-1 lg:order-2 flex justify-end lg:justify-center">
            <div
              className="
                w-full max-w-[520px]
                bg-white/95 backdrop-blur-md
                border border-[#00AEEF]
                rounded-tl-[50px] rounded-tr-[10px] rounded-br-[10px] rounded-bl-[50px]
                shadow-[0_10px_30px_rgba(0,74,173,0.15)]
                px-8 md:px-10 py-14 md:py-20
              "
            >
              <div className="text-center mb-6">
                <h1
                  className="font-[Poppins] font-bold text-[40px] leading-[100%] tracking-[1%] text-[#004aad]"
                >
                  Welcome Back
                </h1>

                <div className="w-[300px] h-[1px] bg-[#0077B3] mx-auto mt-0 mb-3"></div>

                <p
                  className="font-[Poppins] font-normal text-[14px] leading-[100%] tracking-[0%] text-[#0C62BF]"
                >
                  Please login to your account
                </p>
              </div>


              {/* Email */}
              <div className="mt-10">
                
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={handleEmail}
                    onKeyDown={handleKeyDown}
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

              {/* Password */}
              <div className="mt-6">
               
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePassword}
                    onKeyDown={handleKeyDown}
                    className="w-full h-[50px] border border-gray-300 rounded-md pr-[50px] pl-4 text-[16px] outline-none focus:border-[#004aad] transition"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute top-0 right-0 w-[50px] h-[50px] bg-[#0077B3] rounded-r-md flex items-center justify-center"
                  >
                    {showPassword ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                      >
                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

      <div className="mt-3 text-left">
        <a
          href="/forgot-password"
          className="text-sm text-[#004aad] font-Poppins underline hover:text-[#0066cc] transition"
        >
          Forgot Password?
        </a>
      </div>

      {/* Submit */}
      <button
        onClick={handleNavigate}
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
            Logging in...
          </>
        ) : (
          <>
            Sign In
            <FiLogIn classNa    me="text-[20px]" /> {/* Icon on right side */}
          </>
        )}
      </button>

      {/* Sign up */}
      <p className="mt-6 text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <button
          onClick={() => navigate("/signup")}
          className="text-[#004aad] font-semibold underline hover:text-[#0066cc] transition"
        >
          Sign Up
        </button>
        </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Login;