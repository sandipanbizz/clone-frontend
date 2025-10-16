import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const RegisterSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email || "";

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gray-50 flex items-center justify-center">
      {/* ✅ Background Image */}
      <div className="absolute inset-0 -z-0">
        <img
          src="src/assets/loginBg.svg"  
          alt="background"
          className="w-full h-full object-cover border border-[#0077B3]"
        />
      </div>

      {/* ✅ Main Section - Centered */}
      <section className="relative w-full flex items-center justify-center px-4 md:px-10 xl:px-16 py-10 md:py-16">
        <div className="mx-auto max-w-[1500px] grid grid-cols-1 lg:grid-cols-2 gap-16 items-center justify-center">
          {/* LEFT: Text Section */}
          <div className="order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left font-[Poppins]">
            <img
              src="src/assets/chembizzlogo.png"
              alt="ChemBizz Logo"
              className="w-[220px] md:w-[280px] xl:w-[301px] h-auto object-contain mb-6"
            />

            <div className="max-w-[600px] text-[#0A122A]">
              <h2 className="text-[#0C62BF] font-bold text-2xl md:text-[36px] leading-tight mb-4">
                Create Your ChemBizz Account
              </h2>

              <p className="text-[16px] md:text-[18px] font-normal leading-[160%] mb-6">
                <span className="font-bold text-[#0C62BF]">Welcome to ChemBizz!</span>  
                <br />
                Join our secure platform built for the chemical trade industry.  
                Start your journey toward smarter, safer, and fully digital business management.
              </p>

              <h3 className="text-[#0C62BF] font-semibold text-[20px] md:text-[24px] leading-[120%] mb-3">
                Manage Your Business Seamlessly
              </h3>
              <p className="text-[16px] font-normal leading-[160%] mb-3">
                Build your company’s digital foundation — manage sales, purchases, and inventory  
                with full transparency and real-time visibility.
              </p>
              <p className="text-[16px] font-normal leading-[160%] mb-6">
                Connect with verified buyers and suppliers, automate processes, and grow your  
                chemical business efficiently with ChemBizz.
              </p>

              <p className="text-[#0C62BF] font-semibold text-[16px] leading-[150%]">
                Please check your inbox (and spam folder) for your verification link.
              </p>
            </div>
          </div>

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
                flex flex-col items-center justify-center text-center
                font-[Poppins]
              "
            >
              <div className="mx-auto mb-8">
                <img
                  src="src/assets/anbizzLogo.png"
                  alt="ChemBizz Logo"
                  className="w-[120px] mx-auto"
                />
              </div>

              <h1 className="text-[#0C62BF] text-2xl md:text-[28px] font-bold">
                Congratulations!
              </h1>

              <p className="mt-4 text-sm md:text-base text-gray-700 leading-[160%] max-w-[500px]">
                {email ? (
                  <>
                    Your account has been created successfully.
                    <br />
                    A verification link has been sent to{" "}
                    <span className="font-semibold">{email}</span>.
                    <br />
                    Please verify your email to activate your account.
                  </>
                ) : (
                  <>
                    Your account has been created successfully.
                    <br />
                    Please check your email inbox for verification instructions.
                  </>
                )}
              </p>

              {/* ✅ Buttons */}
              <div className="mt-10 flex items-center justify-center gap-4">
                <button
                  onClick={() => navigate("/login")}
                  className="bg-[#0C62BF] hover:bg-[#003d8f] text-white px-6 py-3 rounded-md font-semibold transition"
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

              <p className="mt-8 text-xs text-gray-500">
                Didn’t receive the email? Check your spam folder or contact support.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RegisterSuccess;
