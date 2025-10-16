import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../images/chemibizz-name-image.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLinkedin,
  faXTwitter,
  faInstagram,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { BASE_URL } from "../BASE_URL";

const Footer = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const gradientStyle = {
    background: `-webkit-linear-gradient(left, #7677FF, #00AEEF)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      toast.error("Please Enter Email Address!", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    if (!emailRegex.test(email.trim())) {
      toast.error("Please Enter Valid Email Address!", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}api/subscriber/add`, {
        email: email,
      });

      if (response.status === 200) {
        toast.success("You Subscribed to Chembizz Successfully!", {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 1000,
        });
        setEmail("");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong!", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
    }
  };

  return (
    <footer className="w-full bg-[#0A1330] text-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-12 py-10">
        {/* Subscribe Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-10 mb-10">
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-semibold">
              Subscribe to our newsletters
            </h1>
            <p className="text-sm md:text-base text-white/60 mt-2 max-w-md">
              Stay up to date with the latest news, announcements, and articles.
            </p>
          </div>

          {/* Email Input */}
          <div className="flex justify-center items-center gap-3 w-full md:w-auto">
            <input
              type="text"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="Enter your email"
              className="bg-[#12214e] text-white border border-white/30 w-full sm:w-[250px] md:w-[300px] py-2 px-3 rounded-md outline-none placeholder:text-[#757575]"
            />
            <button
              onClick={handleSubmit}
              className="bg-[#00AEEF] hover:bg-[#0095CC] text-white font-medium px-5 py-2 rounded-md duration-300"
            >
              Submit
            </button>
          </div>
        </div>

        <hr className="border-white/20" />

        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 py-10">
          {/* About Section */}
          <div>
            <p className="text-white/70 text-sm md:text-base leading-relaxed mb-4">
              Connecting the world of chemical commerce together to make its
              members more successful.
            </p>
            <Link to="/about">
              <img
                src={Logo}
                alt="ChemBizz Logo"
                className="w-[180px] md:w-[230px]"
              />
            </Link>
          </div>

          {/* Resources */}
          <div>
            <h2 className="font-semibold text-lg mb-4">Resources</h2>
            <ul className="space-y-2 text-white/70 text-sm">
              <li>
                <Link
                  to="/terms-and-conditions"
                  className="hover:text-[#00AEEF] duration-300"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policies"
                  className="hover:text-[#00AEEF] duration-300"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-[#00AEEF] duration-300"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/blogs"
                  className="hover:text-[#00AEEF] duration-300"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="font-semibold text-lg mb-4">Contact</h2>
            <ul className="space-y-2 text-white/70 text-sm">
              <li>
                <Link to="mailto:support@chembizz.com" className="hover:text-[#00AEEF]">
                  support@chembizz.com
                </Link>
              </li>
              <li>
                <Link className="hover:text-[#00AEEF]">99999 99999</Link>
              </li>
              <li>Ahmedabad, Gujarat, India - 382428</li>
              <li className="pt-2">
                <div className="flex items-center gap-4">
                  <a
                    href="https://www.facebook.com/profile.php?id=61564475525953"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#00AEEF]"
                  >
                    <FontAwesomeIcon icon={faFacebook} className="h-5 w-5" />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/chembizzz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#00AEEF]"
                  >
                    <FontAwesomeIcon icon={faLinkedin} className="h-5 w-5" />
                  </a>
                  <a
                    href="https://www.instagram.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#00AEEF]"
                  >
                    <FontAwesomeIcon icon={faInstagram} className="h-5 w-5" />
                  </a>
                  <a
                    href="https://x.com/Chembizzz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#00AEEF]"
                  >
                    <FontAwesomeIcon icon={faXTwitter} className="h-5 w-5" />
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-white/20" />

        {/* Copyright */}
        <div className="py-6 text-center text-white/60 text-sm">
          © {new Date().getFullYear()} ChemBizZ. All rights reserved.
        </div>
      </div>

      <ToastContainer />
    </footer>
  );
};

export default Footer;
