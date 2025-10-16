// import React, { useEffect, useRef, useState } from "react";
// import "react-phone-input-2/lib/style.css";
// import { Link, useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import countries from "./CountryStateCity.json";
// import headerImage from "../images/blue-background.png";
// import loaderImage from "../images/loading.png";
// import { BASE_URL } from "../BASE_URL";

// // fontawesome icons
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faEye,
//   faEyeSlash,
//   faCheck,
//   faXmark,
// } from "@fortawesome/free-solid-svg-icons";
// import axios from "axios";

// const CreateAccount = () => {
//   const navigate = useNavigate();

//   // UI state
//   const [loading, setLoading] = useState(false);
//   const [gstLoader,setGstloader]= useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showPassword1, setShowPassword1] = useState(false);
//   const [showInput, setShowInput] = useState(false);
//   const [check, setCheck] = useState("");

//   // Validation states
//   const [emailError, setEmailError] = useState("");
//   const [passwordError, setPasswordError] = useState("");
//   const [confirmPasswordError, setConfirmPasswordError] = useState("");
//   const [passwordCriteria, setPasswordCriteria] = useState({
//     length: false,
//     uppercase: false,
//     lowercase: false,
//     number: false,
//     special: false,
//   });

//   const [wrongGst, setWrongGst] = useState(false);

//   // Form data
//   const [formData, setFormData] = useState({
//     companyName: "",
//     gstNo: "",
//     modeOfBusiness: [],
//     contactPersonName: "",
//     landlineNumber: "",
//     mobileNumber: "",
//     email: "",
//     address: "",
//     country: "",
//     state: "",
//     city: "",
//     pinCode: "",
//     password: "",
//     confirmPassword: "",
//     status: "active",
//   });

//   // Location data
//   const [states, setStates] = useState([]);
//   const [cities, setCities] = useState([]);

//   // OTP handling
//   const [otp, setOtp] = useState(new Array(6).fill(""));
//   const inputRefs = useRef([]);

//   // Password visibility toggles
//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const togglePasswordVisibility1 = () => {
//     setShowPassword1(!showPassword1);
//   };

//   // Email validation
//   const validateEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!email.trim()) {
//       setEmailError("Email is required");
//       return false;
//     } else if (!emailRegex.test(email)) {
//       setEmailError("Please enter a valid email address");
//       return false;
//     } else {
//       setEmailError("");
//       return true;
//     }
//   };

//   // Password validation
//   const validatePassword = (password) => {
//     // Update criteria state for visual feedback
//     const criteria = {
//       length: password.length >= 8,
//       uppercase: /[A-Z]/.test(password),
//       lowercase: /[a-z]/.test(password),
//       number: /\d/.test(password),
//       special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
//     };

//     setPasswordCriteria(criteria);

//     // Check if all criteria are met
//     const isValid = Object.values(criteria).every(Boolean);

//     if (!password) {
//       setPasswordError("Password is required");
//       return false;
//     } else if (!isValid) {
//       setPasswordError("Password must meet all requirements");
//       return false;
//     } else {
//       setPasswordError("");
//       return true;
//     }
//   };

//   // Confirm password validation
//   const validateConfirmPassword = (password, confirmPassword) => {
//     if (!confirmPassword) {
//       setConfirmPasswordError("Please confirm your password");
//       return false;
//     } else if (password !== confirmPassword) {
//       setConfirmPasswordError("Passwords do not match");
//       return false;
//     } else {
//       setConfirmPasswordError("");
//       return true;
//     }
//   };

//   // Form field change handler
//   const handleChange = async (e) => {
//     const { name, value, type, checked } = e.target;

//     if (name === "gstNo") {
//       setWrongGst(false);
//       if (value.length !== 15) {
//         setFormData((prevData) => ({
//           ...prevData,
//           companyName: "",
//           contactPersonName: "",
//           pinCode: "",
//           state: "",
//           city: "",
//           country: "",
//           address: "",
//         }));
//       }
//     }

//     if (name === "modeOfBusiness") {
//       setFormData((prevState) => ({
//         ...prevState,
//         modeOfBusiness: checked
//           ? [...prevState.modeOfBusiness, value]
//           : prevState.modeOfBusiness.filter((mode) => mode !== value),
//       }));
//       return;
//     }

//     if (name === "country") {
//       const selectedCountry = countries.find(
//         (country) => country.name === value
//       );
//       if (selectedCountry) {
//         setStates(selectedCountry.states);
//         setFormData((prevState) => ({
//           ...prevState,
//           [name]: selectedCountry.name,
//           state: "",
//           city: "",
//         }));
//       }
//     }

//     if (name === "state") {
//       const selectedState = states.find((state) => state.name === value);
//       if (selectedState) {
//         setCities(selectedState.cities);
//         setFormData((prevState) => ({
//           ...prevState,
//           [name]: selectedState.name,
//           city: "",
//         }));
//       }
//     }

//     if (name === "pinCode") {
//       if (value.length === 6) {
//         await fetchDetailsFromPincode(value);
//       } else {
//         setFormData((prevData) => ({
//           ...prevData,
//           country: "",
//           state: "",
//           city: "",
//         }));
//       }
//     }

//     // Real-time validation
//     if (name === "email") {
//       validateEmail(value);
//     }

//     if (name === "password") {
//       validatePassword(value);
//       // Also validate confirm password if it exists
//       if (formData.confirmPassword) {
//         validateConfirmPassword(value, formData.confirmPassword);
//       }
//     }

//     if (name === "confirmPassword") {
//       validateConfirmPassword(formData.password, value);
//     }

//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   // Fetch details from pincode
//   const fetchDetailsFromPincode = async (pincode) => {
//     try {
//       const res = await fetch(
//         `${BASE_URL}api/public/getPincodeDetails/${pincode}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       const response = await res.json();
//       const data = response[0]?.PostOffice[0];

//       if (data) {
//         // Extract country, state, and city from the API response
//         const countryName = data.Country;
//         const stateName = data.State;
//         const cityName = data.District;

//         // Find the corresponding country object
//         const selectedCountry = countries.find(
//           (country) => country.name === countryName
//         );
//         const countryStates = selectedCountry?.states || [];

//         // Find the corresponding state object
//         const selectedState = countryStates.find(
//           (state) => state.name === stateName
//         );
//         const stateCities = selectedState?.cities || [];

//         // Update form data and states
//         setStates(countryStates);
//         setCities(stateCities);

//         setFormData((prevData) => ({
//           ...prevData,
//           country: countryName,
//           state: stateName,
//           city: cityName,
//           pincode: pincode,
//         }));
//       } else {
//         console.error("No PostOffice data found for the provided pincode.");
//       }
//     } catch (error) {
//       console.error("Error fetching pincode details:", error);
//     }
//   };

//   useEffect(() => {
//     const fetchGstDetails = async () => {
//       if (formData.gstNo.length === 15) {
//         await fetchDetailsFromGst(formData.gstNo);
//       }
//     };

//     fetchGstDetails();
//   }, [formData.gstNo]);

//   // need to change here

//   const fetchDetailsFromGst = async (gstNumber) => {
//     setGstloader(true)
//     try {
//       const res = await fetch(`${BASE_URL}api/gst/gstDetails/${gstNumber}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       const response = await res.json();

//       if (response.status_cd == "0") {
//         setGstloader(false)
//         setWrongGst(true);
//       } else {
//         let resData = response.data;

//         const countryName = "India";

//         // Find the corresponding country object
//         const selectedCountry = countries.find(
//           (country) => country.name === countryName
//         );
//         const countryStates = selectedCountry?.states || [];

//         // Find the corresponding state object
//         const selectedState = countryStates.find(
//           (state) => state.name === resData.state
//         );
//         const stateCities = selectedState?.cities || [];

//         // Update form data and states
//         setStates(countryStates);
//         setCities(stateCities);

//         setFormData((prevData) => ({
//           ...prevData,
//           gstNo: gstNumber,
//           companyName: resData.companyName,
//           contactPersonName: resData.contactPersonName,
//           address: resData.address,
//           pinCode: resData.pinCode,
//           country: countryName,
//           state: resData.state,
//           city: resData.city,
//         }));

//         setGstloader(false)
//       }
//     } catch (error) {
//       console.error("Error fetching gst details:", error);
//     }
//   };

//   // Checkbox handler
//   const handleCheck = (e) => {
//     setCheck(e.target.value);
//   };

//   // OTP handlers
//   const handleOtpChange = (e, index) => {
//     const value = e.target.value;
//     if (/^[0-9]$/.test(value) || value === "") {
//       const newOtp = [...otp];
//       newOtp[index] = value;
//       setOtp(newOtp);

//       // Focus the next input field if value is entered
//       if (value !== "" && index < inputRefs.current.length - 1) {
//         inputRefs.current[index + 1].focus();
//       }
//     }
//   };

//   const handleKeyDown = (e, index) => {
//     if (e.key === "Backspace" && otp[index] === "") {
//       if (index > 0) {
//         inputRefs.current[index - 1].focus();
//       }
//     }
//   };

//   const handlePaste = (e) => {
//     const pasteData = e.clipboardData.getData("Text");
//     if (/^\d{6}$/.test(pasteData)) {
//       setOtp(pasteData.split(""));
//       inputRefs.current[5].focus();
//     }
//   };

//   // Validate all form fields
//   const validateForm = () => {
//     const {
//       companyName,
//       gstNo,
//       modeOfBusiness,
//       contactPersonName,
//       landlineNumber,
//       mobileNumber,
//       email,
//       address,
//       country,
//       state,
//       city,
//       pinCode,
//       password,
//       confirmPassword,
//     } = formData;

//     const gstCheck =
//       /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

//     if (!companyName.trim()) {
//       toast.error("Please Enter Company Name!", {
//         position: toast.POSITION.BOTTOM_RIGHT,
//         autoClose: 1000,
//       });
//       return false;
//     }

//     if (!gstNo.slice(0, 15).trim()) {
//       toast.error("Please Enter GST Number!", {
//         position: toast.POSITION.BOTTOM_RIGHT,
//         autoClose: 1000,
//       });
//       return false;
//     }

//     if (!gstCheck.test(gstNo.trim())) {
//       toast.error("Please Enter Valid GST Number!", {
//         position: toast.POSITION.BOTTOM_RIGHT,
//         autoClose: 1000,
//       });
//       return false;
//     }

//     if (wrongGst) {
//       toast.error("Please Enter Valid GST Number!", {
//         position: toast.POSITION.BOTTOM_RIGHT,
//         autoClose: 1000,
//       });
//       return false;
//     }

//     if (!contactPersonName.trim()) {
//       toast.error("Please Enter Contact Person Name!", {
//         position: toast.POSITION.BOTTOM_RIGHT,
//         autoClose: 1000,
//       });
//       return false;
//     }

//     if (!mobileNumber) {
//       toast.error("Please Enter Mobile Number!", {
//         position: toast.POSITION.BOTTOM_RIGHT,
//         autoClose: 1000,
//       });
//       return false;
//     }

//     if (mobileNumber.length < 10) {
//       toast.error("Please Enter Valid Mobile Number!", {
//         position: toast.POSITION.BOTTOM_RIGHT,
//         autoClose: 1000,
//       });
//       return false;
//     }

//     // Email validation
//     if (!validateEmail(email)) {
//       toast.error("Please Enter Valid Email Address!", {
//         position: toast.POSITION.BOTTOM_RIGHT,
//         autoClose: 1000,
//       });
//       return false;
//     }

//     if (modeOfBusiness.length < 1) {
//       toast.error("Please Select Mode Of Business!", {
//         position: toast.POSITION.BOTTOM_RIGHT,
//         autoClose: 1000,
//       });
//       return false;
//     }

//     if (!address.trim()) {
//       toast.error("Please Enter Address!", {
//         position: toast.POSITION.BOTTOM_RIGHT,
//         autoClose: 1000,
//       });
//       return false;
//     }

//     if (!country.trim()) {
//       toast.error("Please Select Country!", {
//         position: toast.POSITION.BOTTOM_RIGHT,
//         autoClose: 1000,
//       });
//       return false;
//     }

//     if (!state.trim()) {
//       toast.error("Please Select State!", {
//         position: toast.POSITION.BOTTOM_RIGHT,
//         autoClose: 1000,
//       });
//       return false;
//     }

//     if (!city.trim()) {
//       toast.error("Please Select City!", {
//         position: toast.POSITION.BOTTOM_RIGHT,
//         autoClose: 1000,
//       });
//       return false;
//     }

//     if (!pinCode) {
//       toast.error("Please Enter Pincode!", {
//         position: toast.POSITION.BOTTOM_RIGHT,
//         autoClose: 1000,
//       });
//       return false;
//     }

//     if (pinCode.length < 6) {
//       toast.error("Please Enter Valid Pincode!", {
//         position: toast.POSITION.BOTTOM_RIGHT,
//         autoClose: 1000,
//       });
//       return false;
//     }

//     // Password validation
//     if (!validatePassword(password)) {
//       toast.error("Please Enter Valid Password!", {
//         position: toast.POSITION.BOTTOM_RIGHT,
//         autoClose: 1000,
//       });
//       return false;
//     }

//     // Confirm password validation
//     if (!validateConfirmPassword(password, confirmPassword)) {
//       toast.error("Password And Confirm Password Do Not Match!", {
//         position: toast.POSITION.BOTTOM_RIGHT,
//         autoClose: 1000,
//       });
//       return false;
//     }

//     if (!check.trim()) {
//       toast.error("Please Check T & C and Privacy Policy!", {
//         position: toast.POSITION.BOTTOM_RIGHT,
//         autoClose: 1000,
//       });
//       return false;
//     }

//     return true;
//   };

//   // Registration handler
//   const handleRegister = async () => {
//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await axios.post(
//         `${BASE_URL}api/otp/send_registion_otp`,
//         {
//           emailid: formData.email,
//         }
//       );

//       if (response.status === 200) {
//         setShowInput(true);
//         setLoading(false);
//         setTimeout(() => {
//           toast.success("OTP Sent Successfully.", {
//             position: toast.POSITION.BOTTOM_RIGHT,
//             autoClose: 2000,
//           });
//         }, 2000);
//       }
//     } catch (error) {
//       setLoading(false);
//       console.error("Error sending OTP:", error.message);
//       toast.error(error?.response?.data?.message || "Failed to send OTP", {
//         position: toast.POSITION.BOTTOM_RIGHT,
//         autoClose: 1000,
//       });
//     }
//   };

//   // Complete registration after OTP verification
//   const register = async () => {
//     const {
//       companyName,
//       gstNo,
//       modeOfBusiness,
//       contactPersonName,
//       landlineNumber,
//       mobileNumber,
//       email,
//       address,
//       country,
//       state,
//       city,
//       pinCode,
//       password,
//       status,
//     } = formData;

//     try {
//       setLoading(true);
//       const response = await axios.post(`${BASE_URL}company/register`, {
//         company_name: companyName,
//         gst: gstNo,
//         contact_person_name: contactPersonName,
//         address: address,
//         mobile_num: mobileNumber,
//         landline_num: landlineNumber,
//         emailid: email,
//         mode_of_business: modeOfBusiness,
//         password: password,
//         country: country,
//         state: state,
//         city: city,
//         pincode: pinCode,
//         status: status,
//       });

//       if (response.status === 200) {
//         setLoading(false);
//         setTimeout(() => {
//           navigate("/login");
//           toast.success("Registration Successfully Done!", {
//             position: toast.POSITION.BOTTOM_RIGHT,
//             autoClose: 2000,
//           });
//         }, 2000);
//       } else {
//         setLoading(false);
//       }
//     } catch (error) {
//       setLoading(false);
//       toast.error(error?.response?.data?.message || "Registration failed", {
//         position: toast.POSITION.BOTTOM_RIGHT,
//         autoClose: 1000,
//       });
//     }
//   };

//   // OTP verification
//   const verifyOtp = async () => {
//     const otpString = otp.join("");

//     if (otpString.length !== 6) {
//       toast.error("Please enter complete OTP", {
//         position: toast.POSITION.BOTTOM_RIGHT,
//         autoClose: 1000,
//       });
//       return;
//     }

//     try {
//       const response = await axios.post(`${BASE_URL}api/otp/verify_otp`, {
//         emailid: formData.email,
//         otp_value: Number(otpString),
//       });

//       setOtp(new Array(6).fill(""));
//       if (response.status === 200) {
//         register();
//         setShowInput(false);
//         setTimeout(() => {
//           toast.success("OTP Verified Successfully!", {
//             position: toast.POSITION.BOTTOM_RIGHT,
//             autoClose: 2000,
//           });
//         }, 2000);
//       }
//     } catch (error) {
//       setOtp(new Array(6).fill(""));
//       console.error("Error Verifying OTP:", error.message);
//       toast.error(error?.response?.data?.message || "OTP verification failed", {
//         position: toast.POSITION.BOTTOM_RIGHT,
//         autoClose: 1000,
//       });
//     }
//   };

//   return (
//     <>

//       <div className="my-container">
//           <div className="lg:px-40 md:px-10 md:py-10 bg-gray-100">
//             <div className="flex md:flex-row flex-col bg-white rounded-2xl">
//               {/* Form */}
//               <div className="py-10 sm:ps-10 md:pe-5 px-5 md:w-[70%] flex flex-col items-center justify-center rounded-2xl">
//                 <div className="flex flex-col w-full">
//                   <h1 className="text-darkBlue sm:text-4xl text-2xl font-semibold text-center">
//                     Create New Account
//                   </h1>

//                   <input
//                     name="gstNo"
//                     value={formData.gstNo.slice(0, 15).trim()}
//                     onChange={handleChange}
//                     type="text"
//                     placeholder="GST No. "
//                     className="mt-8 outline-none py-3 px-2 border border-[#0A122A]/[.5] rounded-md"
//                   />

//                   {wrongGst && (
//                     <p className="text-red-500 text-sm mt-1">
//                       The GST number is incorrect.
//                     </p>
//                   )}
//                   {/* {formData.email && !emailError && (
//                     <p className="text-green-500 text-sm mt-1">Email is valid</p>
//                   )} */}

//                   <div className="flex md:flex-row flex-col w-full md:gap-4 gap-2">
//                     <input
//                       name="companyName"
//                       onChange={handleChange}
//                       value={formData.companyName}
//                       type="text"
//                       disabled
//                       placeholder="Company Name"
//                       className="w-full mt-8 outline-none border border-[#0A122A]/[.5] rounded-md py-3 px-2"
//                     />
//                   </div>

//                   <input
//                     name="contactPersonName"
//                     onChange={handleChange}
//                     value={formData.contactPersonName}
//                     type="text"
//                     disabled
//                     placeholder="Contact Person Name"
//                     className="w-full outline-none mt-8 border border-[#0A122A]/[.5] rounded-md py-3 px-2"
//                   />

//                   <div className="flex w-full gap-4">
//                     <input
//                       type="tel"
//                       name="mobileNumber"
//                       onChange={handleChange}
//                       onInput={(e) =>
//                         (e.target.value = e.target.value.replace(/[^0-9]/g, ""))
//                       }
//                       maxLength={10}
//                       placeholder="Enter Mobile Number"
//                       className="w-full mt-8 py-3 px-2 outline-none border border-[#0A122A]/[.5] rounded-md"
//                     />
//                     <input
//                       type="tel"
//                       name="landlineNumber"
//                       onChange={handleChange}
//                       onInput={(e) =>
//                         (e.target.value = e.target.value.replace(/[^0-9]/g, ""))
//                       }
//                       maxLength={18}
//                       placeholder="Enter Company Number (Optional)"
//                       className="w-full mt-8 py-3 px-2 outline-none border border-[#0A122A]/[.5] rounded-md"
//                     />
//                   </div>

//                   {/* Email Field with Validation */}
//                   <div className="relative mt-8">
//                     <input
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       placeholder="Email"
//                       className={`w-full py-3 outline-none px-2 border ${
//                         emailError
//                           ? "border-red-500"
//                           : formData.email && !emailError
//                           ? "border-green-500"
//                           : "border-[#0A122A]/[.5]"
//                       } rounded-md`}
//                     />
//                     {emailError && (
//                       <p className="text-red-500 text-sm mt-1">{emailError}</p>
//                     )}
//                     {formData.email && !emailError && (
//                       <p className="text-green-500 text-sm mt-1">Email is valid</p>
//                     )}
//                   </div>

//                   <div className="w-25 mt-8 mb-2">
//                     <h5 className="font-semibold">Mode Of Business</h5>
//                   </div>
//                   <div className="flex">
//                     <div className="w-full">
//                       <input
//                         type="checkbox"
//                         name="modeOfBusiness"
//                         value="manufacture"
//                         onChange={handleChange}
//                         checked={formData.modeOfBusiness.includes("manufacture")}
//                       />
//                       <label htmlFor="" className="ms-2">
//                         Manufacture
//                       </label>
//                     </div>
//                     <div className="w-full">
//                       <input
//                         type="checkbox"
//                         name="modeOfBusiness"
//                         value="trader"
//                         onChange={handleChange}
//                         checked={formData.modeOfBusiness.includes("trader")}
//                       />
//                       <label htmlFor="" className="ms-2">
//                         Trader
//                       </label>
//                     </div>
//                   </div>

//                   <textarea
//                     name="address"
//                     onChange={handleChange}
//                     value={formData.address}
//                     placeholder="Address"
//                     className="mt-8 outline-none py-3 px-2 border border-[#0A122A]/[.5] rounded-md"
//                   ></textarea>

//                   <ToastContainer />

//                   <div className="flex w-full gap-4">
//                     <div className="flex-1">
//                       <input
//                         name="pinCode"
//                         onInput={(e) =>
//                           (e.target.value = e.target.value.replace(/[^0-9]/g, ""))
//                         }
//                         value={formData.pinCode}
//                         maxLength={6}
//                         disabled
//                         onChange={handleChange}
//                         type="text"
//                         placeholder="Pin Code"
//                         className="mt-10 w-full outline-none py-2 px-2 border border-[#0A122A]/[.5] rounded-md"
//                       />
//                     </div>

//                     <div className="mt-8 flex-1">
//                       <select
//                         name="country"
//                         onChange={handleChange}
//                         disabled
//                         value={formData?.country}
//                         className="block outline-none bg-white w-full p-2 mt-2 border border-[#0A122A]/[.5] rounded-md"
//                       >
//                         <option value="">Select Country</option>
//                         {countries.map((country, index) => (
//                           <option key={index} value={country.name}>
//                             {country.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   <div className="flex md:flex-row flex-col gap-4 w-full">
//                     <div className="mt-8 flex-1">
//                       <select
//                         name="state"
//                         onChange={handleChange}
//                         className="block outline-none bg-white w-full p-2 mt-2 border border-[#0A122A]/[.5] rounded-md"
//                         value={formData.state}
//                         disabled
//                       >
//                         <option value="">Select State</option>
//                         {states &&
//                           states.map((state, index) => (
//                             <option key={index} value={state.name}>
//                               {state.name}
//                             </option>
//                           ))}
//                       </select>
//                     </div>

//                     <div className="mt-8 flex-1">
//                       <select
//                         name="city"
//                         onChange={handleChange}
//                         value={formData.city}
//                         disabled
//                         className="block bg-white w-full p-2 h-full border border-[#0A122A]/[.5] rounded-md"
//                       >
//                         <option value="">Select City</option>
//                         {cities &&
//                           cities.map((city, index) => (
//                             <option key={index} value={city.name}>
//                               {city.name}
//                             </option>
//                           ))}
//                       </select>
//                     </div>
//                   </div>

//                   {/* Password Field with Validation */}
//                   <div className="relative mt-8">
//                     <input
//                       name="password"
//                       onChange={handleChange}
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Password"
//                       className={`outline-none py-3 px-2 border ${
//                         passwordError
//                           ? "border-red-500"
//                           : formData.password &&
//                             Object.values(passwordCriteria).every(Boolean)
//                           ? "border-green-500"
//                           : "border-[#0A122A]/[.5]"
//                       } rounded-md w-full`}
//                     />
//                     <FontAwesomeIcon
//                       icon={showPassword ? faEyeSlash : faEye}
//                       className="absolute top-[30%] right-[2%] cursor-pointer"
//                       onClick={togglePasswordVisibility}
//                     />
//                   </div>

//                   {/* Password Criteria List */}
//                   {formData.password && (
//                     <div className="mt-2 text-sm">
//                       <p
//                         className={`flex items-center ${
//                           passwordCriteria.length
//                             ? "text-green-500"
//                             : "text-red-500"
//                         }`}
//                       >
//                         <FontAwesomeIcon
//                           icon={passwordCriteria.length ? faCheck : faXmark}
//                           className="mr-1"
//                         />
//                         At least 8 characters
//                       </p>
//                       <p
//                         className={`flex items-center ${
//                           passwordCriteria.uppercase
//                             ? "text-green-500"
//                             : "text-red-500"
//                         }`}
//                       >
//                         <FontAwesomeIcon
//                           icon={passwordCriteria.uppercase ? faCheck : faXmark}
//                           className="mr-1"
//                         />
//                         At least one uppercase letter
//                       </p>
//                       <p
//                         className={`flex items-center ${
//                           passwordCriteria.lowercase
//                             ? "text-green-500"
//                             : "text-red-500"
//                         }`}
//                       >
//                         <FontAwesomeIcon
//                           icon={passwordCriteria.lowercase ? faCheck : faXmark}
//                           className="mr-1"
//                         />
//                         At least one lowercase letter
//                       </p>
//                       <p
//                         className={`flex items-center ${
//                           passwordCriteria.number
//                             ? "text-green-500"
//                             : "text-red-500"
//                         }`}
//                       >
//                         <FontAwesomeIcon
//                           icon={passwordCriteria.number ? faCheck : faXmark}
//                           className="mr-1"
//                         />
//                         At least one number
//                       </p>
//                       <p
//                         className={`flex items-center ${
//                           passwordCriteria.special
//                             ? "text-green-500"
//                             : "text-red-500"
//                         }`}
//                       >
//                         <FontAwesomeIcon
//                           icon={passwordCriteria.special ? faCheck : faXmark}
//                           className="mr-1"
//                         />
//                         At least one special character
//                       </p>
//                     </div>
//                   )}

//                   {/* Confirm Password Field with Validation */}
//                   <div className="relative mt-8">
//                     <input
//                       name="confirmPassword"
//                       onChange={handleChange}
//                       type={showPassword1 ? "text" : "password"}
//                       placeholder="Confirm Password"
//                       className={`outline-none py-3 px-2 border ${
//                         confirmPasswordError
//                           ? "border-red-500"
//                           : formData.confirmPassword && !confirmPasswordError
//                           ? "border-green-500"
//                           : "border-[#0A122A]/[.5]"
//                       } rounded-md w-full`}
//                     />
//                     <FontAwesomeIcon
//                       icon={showPassword1 ? faEyeSlash : faEye}
//                       className="absolute top-[30%] right-[2%] cursor-pointer"
//                       onClick={togglePasswordVisibility1}
//                     />
//                   </div>

//                   {confirmPasswordError && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {confirmPasswordError}
//                     </p>
//                   )}
//                   {formData.confirmPassword && !confirmPasswordError && (
//                     <p className="text-green-500 text-sm mt-1">Passwords match</p>
//                   )}

//                   <div className="flex gap-6 items-start mt-6">
//                     <input
//                       type="checkbox"
//                       className="mt-2"
//                       onChange={handleCheck}
//                       value="yes"
//                     />
//                     <p className="text-darkBlue font-thin">
//                       By clicking on this, you agree to our{" "}
//                       <span className="text-[#00AEEF]">Terms & Conditions</span>,
//                       <span className="text-[#00AEEF]">Terms of use</span>, and{" "}
//                       <span className="text-[#00AEEF]">Privacy Policy</span>
//                     </p>
//                   </div>

//                   <div className="flex items-center justify-center">
//                     {loading ? (
//                       <button className="bg-darkBlue text-lg mt-8 text-white w-[140px] h-[40px] rounded-md font-medium">
//                         <img
//                           src={loaderImage}
//                           alt=""
//                           className="img-fluid animate-spin h-[25px] mx-auto"
//                         />
//                       </button>
//                     ) : (
//                       <button
//                         className="bg-darkBlue text-lg mt-8 text-white w-[140px] h-[40px] rounded-md font-medium"
//                         onClick={handleRegister}
//                       >
//                         Register
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Image */}
//               <div className="md:w-[30%] h-[1150px]  md:flex hidden flex-col justify-center items-center registration-image rounded-2xl relative">
//                 <div className=" flex flex-col mt-[500px] px-[10px] items-center absolute h-full w-full z-[1111]">
//                   <h2 className="text-white text-[18px] text-center leading-7 font-bold">
//                     Already Have an account?
//                   </h2>
//                   <p className="text-white text-sm mt-4 text-center font-normal leading-6">
//                     Log in to your account to start your selling or purchasing with
//                     company name
//                   </p>
//                   <Link to="/login">
//                     <button className="bg-[white] text-black  px-6 py-3 mt-4 border border-[white]/[.5] rounded-md">
//                       Login
//                     </button>
//                   </Link>
//                 </div>
//                 <div className="absolute top-0 left-0 h-full w-full opacity-[0.3] bg-black z-1 rounded-2xl">
//                   <div className=""></div>
//                 </div>
//                 <div className="absolute top-[0px]">
//                   <div className="flex justify-center">
//                     <img
//                       src={headerImage}
//                       alt=""
//                       className="w-full rounded-tr-xl"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {showInput && (
//               <>
//                 <div
//                   class="relative z-10"
//                   aria-labelledby="modal-title"
//                   role="dialog"
//                   aria-modal="true"
//                 >
//                   <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
//                   <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
//                     <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
//                       <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md py-4">
//                         <div class="bg-white pt-2">
//                           <p className="text-gray-600 font-semibold mb-2 px-5">
//                             Enter OTP And Verify
//                           </p>
//                           <div className="bg-gray-100 px-5 py-5">
//                             <div className="flex justify-evenly">
//                               {otp.map((value, index) => (
//                                 <input
//                                   key={index}
//                                   ref={(el) => (inputRefs.current[index] = el)}
//                                   type="text"
//                                   value={value}
//                                   onChange={(e) => handleOtpChange(e, index)}
//                                   onKeyDown={(e) => handleKeyDown(e, index)}
//                                   onPaste={handlePaste}
//                                   className="w-[50px] h-[50px] py-1 mt-2 border border-gray-200 rounded-md shadow-sm outline-none text-center"
//                                   maxLength="1"
//                                 />
//                               ))}
//                             </div>
//                           </div>
//                           <div class="bg-white pt-3 flex justify-end gap-3 px-5">
//                             <button
//                               onClick={() => setShowInput(false)}
//                               type="button"
//                               class="inline-flex w-[100px] justify-center rounded-md bg-white px-3 py-2 text-xs font-medium  shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0"
//                             >
//                               Cancel
//                             </button>
//                             <button
//                               onClick={verifyOtp}
//                               type="button"
//                               class="inline-flex w-[100px] justify-center rounded-md bg-darkBlue px-3 py-2 text-xs font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0"
//                             >
//                               Verify
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//       </div>

//       {gstLoader && (
//         <div className=" fixed  inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
//           <img
//             src="https://chembizzstorage.blob.core.windows.net/chembizz-files/loader1.gif"
//             alt="Loading..."
//             className="w-20 h-20"
//           />
//         </div>
//       )}
//     </>
//   );
// };

// export default CreateAccount;
import React, { useEffect, useRef, useState } from "react";
import "react-phone-input-2/lib/style.css";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import countries from "./CountryStateCity.json";
import headerImage from "../images/blue-background.png";
import loaderImage from "../images/loading.png";
import { BASE_URL } from "../BASE_URL";

// fontawesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const CreateAccount = () => {
  const navigate = useNavigate();

  // UI state
  const [loading, setLoading] = useState(false);
  const [gstLoader, setGstloader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showInput, setShowInput] = useState(false); // kept but not used for OTP modal (can remove if desired)
  const [check, setCheck] = useState("");

  // Validation states
  const [emailError, setEmailError] = useState("");
  const [confirmEmailError, setConfirmEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const [wrongGst, setWrongGst] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    companyName: "",
    gstNo: "",
    modeOfBusiness: [],
    contactPersonName: "",
    landlineNumber: "",
    mobileNumber: "",
    email: "",
    confirmEmail: "",
    address: "",
    country: "",
    state: "",
    city: "",
    pinCode: "",
    password: "",
    confirmPassword: "",
    status: "active",
  });

  // Location data
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Password visibility toggles
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordVisibility1 = () => {
    setShowPassword1(!showPassword1);
  };

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError("Email is required");
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  // Confirm Email validation
  const validateConfirmEmail = (email, confirmEmail) => {
    if (!confirmEmail) {
      setConfirmEmailError("Please confirm your email");
      return false;
    } else if (email !== confirmEmail) {
      setConfirmEmailError("Email and confirmation email do not match");
      return false;
    } else {
      setConfirmEmailError("");
      return true;
    }
  };

  // Password validation
  const validatePassword = (password) => {
    // Update criteria state for visual feedback
    const criteria = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    setPasswordCriteria(criteria);

    // Check if all criteria are met
    const isValid = Object.values(criteria).every(Boolean);

    if (!password) {
      setPasswordError("Password is required");
      return false;
    } else if (!isValid) {
      setPasswordError("Password must meet all requirements");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  // Confirm password validation
  const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      return false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    } else {
      setConfirmPasswordError("");
      return true;
    }
  };

  // Form field change handler
  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "gstNo") {
      setWrongGst(false);
      if (value.length !== 15) {
        setFormData((prevData) => ({
          ...prevData,
          companyName: "",
          contactPersonName: "",
          pinCode: "",
          state: "",
          city: "",
          country: "",
          address: "",
        }));
      }
    }

    if (name === "modeOfBusiness") {
      setFormData((prevState) => ({
        ...prevState,
        modeOfBusiness: checked
          ? [...prevState.modeOfBusiness, value]
          : prevState.modeOfBusiness.filter((mode) => mode !== value),
      }));
      return;
    }

    if (name === "country") {
      const selectedCountry = countries.find((country) => country.name === value);
      if (selectedCountry) {
        setStates(selectedCountry.states);
        setFormData((prevState) => ({
          ...prevState,
          [name]: selectedCountry.name,
          state: "",
          city: "",
        }));
      }
    }

    if (name === "state") {
      const selectedState = states.find((state) => state.name === value);
      if (selectedState) {
        setCities(selectedState.cities);
        setFormData((prevState) => ({
          ...prevState,
          [name]: selectedState.name,
          city: "",
        }));
      }
    }

    if (name === "pinCode") {
      if (value.length === 6) {
        await fetchDetailsFromPincode(value);
      } else {
        setFormData((prevData) => ({
          ...prevData,
          country: "",
          state: "",
          city: "",
        }));
      }
    }

    // Real-time validation
    if (name === "email") {
      validateEmail(value);
      // Re-validate confirm email if present
      if (formData.confirmEmail) {
        validateConfirmEmail(value, formData.confirmEmail);
      }
    }

    if (name === "confirmEmail") {
      validateConfirmEmail(formData.email, value);
    }

    if (name === "password") {
      validatePassword(value);
      // Also validate confirm password if it exists
      if (formData.confirmPassword) {
        validateConfirmPassword(value, formData.confirmPassword);
      }
    }

    if (name === "confirmPassword") {
      validateConfirmPassword(formData.password, value);
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Fetch details from pincode
  const fetchDetailsFromPincode = async (pincode) => {
    try {
      const res = await fetch(`${BASE_URL}api/public/getPincodeDetails/${pincode}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await res.json();
      const data = response[0]?.PostOffice[0];

      if (data) {
        const countryName = data.Country;
        const stateName = data.State;
        const cityName = data.District;

        const selectedCountry = countries.find((country) => country.name === countryName);
        const countryStates = selectedCountry?.states || [];

        const selectedState = countryStates.find((state) => state.name === stateName);
        const stateCities = selectedState?.cities || [];

        setStates(countryStates);
        setCities(stateCities);

        setFormData((prevData) => ({
          ...prevData,
          country: countryName,
          state: stateName,
          city: cityName,
          pincode: pincode,
        }));
      } else {
        console.error("No PostOffice data found for the provided pincode.");
      }
    } catch (error) {
      console.error("Error fetching pincode details:", error);
    }
  };

  useEffect(() => {
    const fetchGstDetails = async () => {
      if (formData.gstNo.length === 15) {
        await fetchDetailsFromGst(formData.gstNo);
      }
    };

    fetchGstDetails();
  }, [formData.gstNo]);

  const fetchDetailsFromGst = async (gstNumber) => {
    setGstloader(true);
    try {
      const res = await fetch(`${BASE_URL}api/gst/gstDetails/${gstNumber}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await res.json();

      if (response.status_cd == "0") {
        setGstloader(false);
        setWrongGst(true);
      } else {
        let resData = response.data;
        const countryName = "India";

        const selectedCountry = countries.find((country) => country.name === countryName);
        const countryStates = selectedCountry?.states || [];

        const selectedState = countryStates.find((state) => state.name === resData.state);
        const stateCities = selectedState?.cities || [];

        setStates(countryStates);
        setCities(stateCities);

        setFormData((prevData) => ({
          ...prevData,
          gstNo: gstNumber,
          companyName: resData.companyName,
          contactPersonName: resData.contactPersonName,
          address: resData.address,
          pinCode: resData.pinCode,
          country: countryName,
          state: resData.state,
          city: resData.city,
        }));

        setGstloader(false);
      }
    } catch (error) {
      console.error("Error fetching gst details:", error);
      setGstloader(false);
    }
  };

  // Checkbox handler
  const handleCheck = (e) => {
    setCheck(e.target.value);
  };

  // VALIDATION FUNCTION (unchanged)
  const validateForm = () => {
    const {
      companyName,
      gstNo,
      modeOfBusiness,
      contactPersonName,
      landlineNumber,
      mobileNumber,
      email,
      confirmEmail,
      address,
      country,
      state,
      city,
      pinCode,
      password,
      confirmPassword,
    } = formData;

    const gstCheck = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

    if (!companyName.trim()) {
      toast.error("Please Enter Company Name!", { position: toast.POSITION.BOTTOM_RIGHT, autoClose: 1000 });
      return false;
    }

    if (!gstNo.slice(0, 15).trim()) {
      toast.error("Please Enter GST Number!", { position: toast.POSITION.BOTTOM_RIGHT, autoClose: 1000 });
      return false;
    }

    if (!gstCheck.test(gstNo.trim())) {
      toast.error("Please Enter Valid GST Number!", { position: toast.POSITION.BOTTOM_RIGHT, autoClose: 1000 });
      return false;
    }

    if (wrongGst) {
      toast.error("Please Enter Valid GST Number!", { position: toast.POSITION.BOTTOM_RIGHT, autoClose: 1000 });
      return false;
    }

    if (!contactPersonName.trim()) {
      toast.error("Please Enter Contact Person Name!", { position: toast.POSITION.BOTTOM_RIGHT, autoClose: 1000 });
      return false;
    }

    if (!mobileNumber) {
      toast.error("Please Enter Mobile Number!", { position: toast.POSITION.BOTTOM_RIGHT, autoClose: 1000 });
      return false;
    }

    if (mobileNumber.length < 10) {
      toast.error("Please Enter Valid Mobile Number!", { position: toast.POSITION.BOTTOM_RIGHT, autoClose: 1000 });
      return false;
    }

    // Email validation
    if (!validateEmail(email)) {
      toast.error("Please Enter Valid Email Address!", { position: toast.POSITION.BOTTOM_RIGHT, autoClose: 1000 });
      return false;
    }

    // Confirm email validation
    if (!validateConfirmEmail(email, confirmEmail)) {
      toast.error("Email and confirmation email do not match or are invalid!", { position: toast.POSITION.BOTTOM_RIGHT, autoClose: 1000 });
      return false;
    }

    if (modeOfBusiness.length < 1) {
      toast.error("Please Select Mode Of Business!", { position: toast.POSITION.BOTTOM_RIGHT, autoClose: 1000 });
      return false;
    }

    if (!address.trim()) {
      toast.error("Please Enter Address!", { position: toast.POSITION.BOTTOM_RIGHT, autoClose: 1000 });
      return false;
    }

    if (!country.trim()) {
      toast.error("Please Select Country!", { position: toast.POSITION.BOTTOM_RIGHT, autoClose: 1000 });
      return false;
    }

    if (!state.trim()) {
      toast.error("Please Select State!", { position: toast.POSITION.BOTTOM_RIGHT, autoClose: 1000 });
      return false;
    }

    if (!city.trim()) {
      toast.error("Please Select City!", { position: toast.POSITION.BOTTOM_RIGHT, autoClose: 1000 });
      return false;
    }

    if (!pinCode) {
      toast.error("Please Enter Pincode!", { position: toast.POSITION.BOTTOM_RIGHT, autoClose: 1000 });
      return false;
    }

    if (pinCode.length < 6) {
      toast.error("Please Enter Valid Pincode!", { position: toast.POSITION.BOTTOM_RIGHT, autoClose: 1000 });
      return false;
    }

    // Password validation
    if (!validatePassword(password)) {
      toast.error("Please Enter Valid Password!", { position: toast.POSITION.BOTTOM_RIGHT, autoClose: 1000 });
      return false;
    }

    // Confirm password validation
    if (!validateConfirmPassword(password, confirmPassword)) {
      toast.error("Password And Confirm Password Do Not Match!", { position: toast.POSITION.BOTTOM_RIGHT, autoClose: 1000 });
      return false;
    }

    if (!check.trim()) {
      toast.error("Please Check T & C and Privacy Policy!", { position: toast.POSITION.BOTTOM_RIGHT, autoClose: 1000 });
      return false;
    }

    return true;
  };

  // UPDATED: handleRegister now directly calls register() after validation.
  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    // Directly call register API (no OTP)
    await register();
  };


  // Register function (updated to display "verification email sent" flow)
  const register = async () => {
    const {
      companyName,
      gstNo,
      modeOfBusiness,
      contactPersonName,
      landlineNumber,
      mobileNumber,
      email,
      confirmEmail,
      address,
      country,
      state,
      city,
      pinCode,
      password,
      status,
    } = formData;

    try {
      setLoading(true);

      const response = await axios.post(`${BASE_URL}company/register`, {
        company_name: companyName,
        gst: gstNo,
        contact_person_name: contactPersonName,
        address: address,
        mobile_num: mobileNumber,
        landline_num: landlineNumber,
        emailid: email,
        confirmEmail: confirmEmail,
        mode_of_business: modeOfBusiness,
        password: password,
        country: country,
        state: state,
        city: city,
        pincode: pinCode,
        status: status,
      });

      setLoading(false);

      // Prefer backend-provided confirmation message
      const successMessage =
        response?.dataq?.message || "Registration successful. A verification link has been sent to your email.";

      // Inform user that a verification email/link was sent
      toast.success(successMessage, { position: toast.POSITION.BOTTOM_RIGHT, autoClose: 4000 });

      setTimeout(() => {
        // navigate to register success page and pass the email in location state
        navigate("/register-success", { state: { email } });
      }, 800);
    } catch (error) {
      setLoading(false);
      const errMsg = error?.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errMsg, { position: toast.POSITION.BOTTOM_RIGHT, autoClose: 3000 });
      console.error("Register error:", error);
    }
  };


return (
<div className="relative w-full min-h-[100vh] flex items-center justify-center overflow-hidden">
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

    {/* Background (behind everything) */}
    <div className="absolute inset-0 -z-0">
      <img
        src="src/assets/loginBg.svg"      
        alt="background"
        className="w-full h-[108%] object-cover"
      />
    </div>

    {/* Content */}
    <section className="relative w-full h-full flex items-center justify-center px-4 md:px-8 xl:px-12 py-8 md:py-12">
    <div className="max-w-[1600px] w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

        {/* LEFT: logo + text */}
        <div className="order-2 lg:order-1">
          <img
            src="src/assets/chembizzlogo.png"   // put file in /public/assets/
            alt="ChemBiZZ"
            className="w-[220px] md:w-[260px] xl:w-[301px] xl:h-[201px] h-auto object-contain"
          />

          <div className="mt-6 max-w-[720px] text-[#0A122A]">
            <h3 className="text-[22px] text-[#0C62BF] md:text-2xl font-semibold">
              Create Your FREE ChemBiZZ Account
            </h3>
            <p className="mt-3 leading-7 text-[15px] md:text-[16px]">
              Join our secure platform designed for the chemical trade industry. Start your journey
              towards smarter, safer chemical business management.
            </p>
            <p className="mt-3 leading-7 text-[15px] md:text-[16px]">
              Build your digital foundation for chemical trading. Manage your sales, purchases, and
              inventory with end-to-end visibility and control.
            </p>
            <p className="mt-3 leading-7 text-[15px] md:text-[16px]">
              Connect with buyers, track stock, and grow your business efficiently.
            </p>
            <h4 className="mt-4 font-semibold  text-[22px] text-[#0C62BF]">Trust & Security Focus</h4>
            <p className="mt-2 leading-7 text-[15px] md:text-[16px]">
              Your data remains private, protected, and accessible only to you. Register your
              company to manage sales, purchases, and inventory — all in one place.
            </p>
            <p className="mt-2 leading-7 text-[15px] md:text-[16px]">
              One platform for chemical sales, purchase, and stock control.
            </p>
          </div>
        </div>

        {/* RIGHT: register card (no scrollbar, full card) */}
        <div className="order-1 lg:order-2 flex lg:justify-center">
          <div
            className="
              w-full max-w-[638px]
              bg-white/95 backdrop-blur-md
              border border-[#0077B3]
              rounded-tl-[50px] rounded-tr-[10px] rounded-br-[10px] rounded-bl-[50px]
              shadow-[0_10px_30px_rgba(0,74,173,0.15)]
              px-6 sm:px-8 md:px-10
              py-7 sm:py-9 md:py-10
              h-auto
            "
          >
            {/* Heading */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h1 className="font-[Poppins] font-semibold tracking-[0.01em] text-xl sm:text-2xl xl:text-[24px] leading-[1] text-[#0077B3]">
                Create New Account
              </h1>
              <p className="text-sm">
                Already have an account?{" "}
                <a href="/login" className="text-[#0A66C2] font-medium">Sign In</a>
              </p>
            </div>

            {/* Form fields stacked = no overlap */}
            <div className="mt-3 space-y-2">
              {/* --- keep all your inputs below, unchanged --- */}
              {/* GST */}
              <input
                name="gstNo"
                value={formData.gstNo.slice(0, 15).trim()}
                onChange={handleChange}
                type="text"
                placeholder="GST No."
                  className="w-full outline-none py-2 px-2 border border-[#0077B3]/50 border: [1px] rounded-md"
              />
              {wrongGst && <p className="text-red-500 text-sm">The GST number is incorrect.</p>}

              {/* Company / Contact */}
              <input
                name="companyName"
                onChange={handleChange}
                value={formData.companyName}
                type="text"
                disabled
                placeholder="Company Name"
                className="w-full outline-none py-2 px-2 border border-[#0077B3]/50 rounded-md"
              />
              <input
                name="contactPersonName"
                onChange={handleChange}
                value={formData.contactPersonName}
                type="text"
                disabled
                placeholder="Contact Person Name"
                className="w-full outline-none py-2 px-2 border border-[#0077B3]/50 rounded-md"
              />

              {/* Phones */}
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="tel"
                  name="mobileNumber"
                  onChange={handleChange}
                  onInput={(e) => (e.target.value = e.target.value.replace(/[^0-9]/g, ""))}
                  maxLength={10}
                  placeholder="Enter Mobile Number"
                  className="w-full py-2 px-2 outline-none border border-[#0077B3]/50 rounded-md"
                />
                <input
                  type="tel"
                  name="landlineNumber"
                  onChange={handleChange}
                  onInput={(e) => (e.target.value = e.target.value.replace(/[^0-9]/g, ""))}
                  maxLength={18}
                  placeholder="Enter Company Number (Optional)"
                  className="w-full py-2 px-2 outline-none border border-[#0077B3]/50 rounded-md"
                />
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  autoComplete="off"
                  onCopy={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  onContextMenu={(e) => e.preventDefault()}
                  className={`w-full py-2 outline-none px-2 border rounded-md ${
                    emailError ? "border-red-500" : formData.email && !emailError ? "border-green-500" : "border-[#0077B3]/50"
                  }`}
                />
                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                {formData.email && !emailError && <p className="text-green-500 text-sm mt-1">Email is valid</p>}
              </div>

              {/* Confirm Email */}
              <div>
                <input
                  type="email"
                  name="confirmEmail"
                  value={formData.confirmEmail}
                  onChange={handleChange}
                  placeholder="Confirm Email"
                  autoComplete="off"
                  onPaste={(e) => e.preventDefault()}
                  onDrop={(e) => e.preventDefault()}
                  onCopy={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  onContextMenu={(e) => e.preventDefault()}
                  className={`w-full py-2 outline-none px-2 border rounded-md ${
                    confirmEmailError ? "border-red-500" : formData.confirmEmail && !confirmEmailError ? "border-green-500" : "border-[#0077B3]/50"
                  }`}
                />
                {confirmEmailError && <p className="text-red-500 text-sm mt-1">{confirmEmailError}</p>}
                {formData.confirmEmail && !confirmEmailError && <p className="text-green-500 text-sm mt-1">Emails match</p>}
              </div>

              {/* Mode of Business */}
              <div>
                <h5 className="font-semibold mb-2">Mode Of Business</h5>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 ">
                    <input
                      type="checkbox"
                      name="modeOfBusiness"
                      value="manufacture"
                      onChange={handleChange}
                      checked={formData.modeOfBusiness.includes("manufacture")}
                      className="accent-[#0077B3]"
                    />
                    <span>Manufacture</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="modeOfBusiness"
                      value="trader"
                      onChange={handleChange}
                      checked={formData.modeOfBusiness.includes("trader")}
                    />
                    <span>Trader</span>
                  </label>
                </div>
              </div>

              {/* Address */}
              <textarea
                name="address"
                onChange={handleChange}
                value={formData.address}
                placeholder="Address"
                className="w-full outline-none py-2 px-2 border border-[#0077B3]/50 rounded-md"
              ></textarea>

              {/* Country / Pincode */}
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  name="pinCode"
                  onInput={(e) => (e.target.value = e.target.value.replace(/[^0-9]/g, ""))}
                  value={formData.pinCode}
                  maxLength={6}
                  disabled
                  onChange={handleChange}
                  type="text"
                  placeholder="Pin Code"
                  className="w-full outline-none py-2 px-2 border border-[#0077B3]/50 rounded-md"
                />
                <select
                  name="country"
                  onChange={handleChange}
                  disabled
                  value={formData?.country}
                  className="block outline-none bg-white w-full p-2 border border-[#0077B3]/50 rounded-md"
                >
                  <option value="">Select Country</option>
                  {countries.map((country, index) => (
                    <option key={index} value={country.name}>{country.name}</option>
                  ))}
                </select>
              </div>

              {/* State / City */}
              <div className="flex flex-col md:flex-row gap-4">
                <select
                  name="state"
                  onChange={handleChange}
                  className="block outline-none bg-white w-full p-2 border border-[#0077B3]/50 rounded-md"
                  value={formData.state}
                  disabled
                >
                  <option value="">Select State</option>
                  {states?.map((state, index) => (
                    <option key={index} value={state.name}>{state.name}</option>
                  ))}
                </select>

                <select
                  name="city"
                  onChange={handleChange}
                  value={formData.city}
                  disabled
                  className="block bg-white w-full p-2 border border-[#0077B3]/50 rounded-md"
                >
                  <option value="">Select City</option>
                  {cities?.map((city, index) => (
                    <option key={index} value={city.name}>{city.name}</option>
                  ))}
                </select>
              </div>

 
{/* Password */}
<div className="relative">
  <input
    name="password"
    onChange={handleChange}
    type={showPassword ? "text" : "password"}
    value={formData.password}
    placeholder="Password"
    className={`outline-none py-2 px-2 pr-14 border rounded-md w-full ${
      passwordError
        ? "border-red-500"
        : formData.password && Object.values(passwordCriteria).every(Boolean)
        ? "border-green-500"
        : "border-[#0077B3]/50"
    }`}
  />
  <button
    type="button"
    onClick={togglePasswordVisibility}
    className="absolute top-0 right-0 w-[50px] h-[41px] bg-[#0077B3] rounded-r-md flex items-center justify-center pointer-events-auto"
    tabIndex="-1"
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

{/* Password validation feedback */}
{passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
{formData.password && Object.values(passwordCriteria).every(Boolean) && (
  <p className="text-green-500 text-sm mt-1">Password meets all requirements</p>
)}

{/* Password requirements checklist */}
{formData.password && (
  <div className="text-xs space-y-1 mt-2">
    <p className={passwordCriteria.length ? "text-green-600" : "text-gray-500"}>
      {passwordCriteria.length ? "✓" : "○"} At least 8 characters
    </p>
    <p className={passwordCriteria.uppercase ? "text-green-600" : "text-gray-500"}>
      {passwordCriteria.uppercase ? "✓" : "○"} One uppercase letter
    </p>
    <p className={passwordCriteria.lowercase ? "text-green-600" : "text-gray-500"}>
      {passwordCriteria.lowercase ? "✓" : "○"} One lowercase letter
    </p>
    <p className={passwordCriteria.number ? "text-green-600" : "text-gray-500"}>
      {passwordCriteria.number ? "✓" : "○"} One number
    </p>
    <p className={passwordCriteria.special ? "text-green-600" : "text-gray-500"}>
      {passwordCriteria.special ? "✓" : "○"} One special character
    </p>
  </div>
)}

{/* Confirm Password */}
<div className="relative">
  <input
    name="confirmPassword"
    onChange={handleChange}
    value={formData.confirmPassword}
    type={showPassword1 ? "text" : "password"}
    placeholder="Confirm Password"
    className={`outline-none py-2 px-2 pr-14 border rounded-md w-full ${
      confirmPasswordError
        ? "border-red-500"
        : formData.confirmPassword && !confirmPasswordError
        ? "border-green-500"
        : "border-[#0077B3]/50"
    }`}
  />
  <button
    type="button"
    onClick={togglePasswordVisibility1}
    className="absolute top-0 right-0 w-[50px] h-[41px] bg-[#0077B3] rounded-r-md flex items-center justify-center pointer-events-auto"
    tabIndex="-1"
  >
    {showPassword1 ? (
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

{confirmPasswordError && <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>}
{formData.confirmPassword && !confirmPasswordError && (
  <p className="text-green-500 text-sm mt-1">Passwords match ✓</p>
)}

              {/* Terms */}
              <div className="flex gap-6 items-start">
                <input type="checkbox" className="mt-2" onChange={handleCheck} value="yes" />
                <p className="text-darkBlue font-thin">
                  By clicking on this, you agree to our <span className="text-[#00AEEF]">Terms & Conditions</span>, <span className="text-[#00AEEF]">Terms of use</span>, and <span className="text-[#00AEEF]">Privacy Policy</span>
                </p>
              </div>

              {/* Submit */}
              <div>
                <button
                  onClick={handleRegister}
                  disabled={loading}
                  className={`w-full h-11 rounded-md text-white font-semibold transition ${
                     loading
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-[#0077B3] hover:bg-[#00AEEF]"
                  }`}
                >
                  {loading ? "Please wait…" : "Register"}
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* /RIGHT */}
      </div>
    </section>

    {/* Loader */}
    {gstLoader && (
      <div className="fixed inset-0 flex items-center justify-center bg-white/60 z-50">
        <img
          src="https://chembizzstorage.blob.core.windows.net/chembizz-files/loader1.gif"
          alt="Loading..."
          className="w-20 h-20"
        />
      </div>
    )}
  </div>
);


};

export default CreateAccount;
