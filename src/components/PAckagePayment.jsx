// import React, { useEffect, useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import { faCheck, faArrowRight } from '@fortawesome/free-solid-svg-icons';
// import right from "../images/right.png"
// import RupeesIcon from '../assets/Rupees';
// import axios from 'axios';
// import loader from "../images/loading.png"
// import { BASE_URL } from '../BASE_URL';

// const PackagePayment = () => {

//     const location = useLocation();
//     const navigate = useNavigate()
//     const url = location.pathname

//     const { _id } = useParams();
//     const { merchentId } = useParams();

//     const [loading, setLoading] = useState(false)
//     const [navigateLoading, setNavigateLoading] = useState(false)

//     const [isOpen, setIsOpen] = useState(false);

//     const [membershipPlan, setMembershipPlan] = useState([])
//     console.log(membershipPlan, "membershipPlan");

//     useEffect(() => {
//         const fetchCategoryList = async () => {
//             try {
//                 const response = await axios.get(
//                     `${BASE_URL}api/membership_plan/display`
//                 );

//                 const selected = response?.data?.data?.find((e) => e?._id === _id)

//                 setMembershipPlan(selected);
//             } catch (error) {

//             }
//         };
//         fetchCategoryList();
//     }, []);

//     const handlecheck = async () => {
//         const companyId = localStorage.getItem("myCompanyId")
//         const email = localStorage.getItem("myEmailId")
//         setLoading(true)

//         try {
//             const response = await axios.post(
//                 `${BASE_URL}api/transaction/pay`,
//                 {
//                     amount: membershipPlan?.plan_selling_price,
//                     plan_id: membershipPlan?._id,
//                     link: url,
//                     MERCHANT_USER_ID: companyId,
//                     emailid: email,
//                 },
//             );
//             setLoading(false)

//             window.location.href = response?.data?.data?.url

//         } catch (error) {
//             setLoading(false)
//             console.error("Error Verifying Otp:", error.message);
//         }
//     }

//     const closeModal = () => {
//         setNavigateLoading(true)
//         setIsOpen(true);
//         fetchPaymentData()
//     }


//     const fetchPaymentData = async () => {
//         const token = `Bearer ${localStorage.getItem("chemicalToken")}`
//         const res = await fetch(`${BASE_URL}api/transaction/payment_status?merchantTransactionId=${merchentId}`, {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: token,
//             },
//         })
//         const data = await res.json()
//         if (data?.success) {
//             // console.log(data)
//             handleBook(data?.data?.paymentInstrument?.type);
//         }
//     }

//     const handleBook = async (paymentMode) => {
//         setLoading(true);

//         try {
//             const token = `Bearer ${localStorage.getItem("chemicalToken")}`;

//             const response = await axios.post(
//                 `${BASE_URL}api/package_booking/create`,
//                 {
//                     plan_id: membershipPlan?._id,
//                     transaction_id: merchentId,
//                     payment_mode: paymentMode,
//                 },
//                 {
//                     headers: {
//                         Authorization: token
//                     }
//                 }
//             );

//             if (response?.status === 200) {
//                 setLoading(false);
//                 setNavigateLoading(false)
//                 localStorage.setItem("membershipStatus", "paid");
//                 navigate("/company/profile")
//             }
//         } catch (error) {
//             setLoading(false);
//             setNavigateLoading(false)
//             console.error("Error Verifying Otp:", error.message);
//         }
//     }


//     useEffect(() => {
//         if (merchentId !== undefined) {
//             setIsOpen(true)
//         }
//     }, [merchentId]);


//     return (
//         <div className="w-full overflow-x-hidden">
//             <div className='flex justify-between items-end'>
//                 <div>
//                     <h1 className="md:text-3xl text-xl font-semibold mb-5">Packages</h1>
//                     {/* <p className='mb-2'>Add your terms & conditions here</p> */}
//                 </div>
//             </div>
//             <hr />
//             <ToastContainer />
//             <div>
//                 <div className='mt-10'>
//                     <div className='lg:px-20 md:px-10 pb-[100px]'>
//                         <div className='flex md:flex-row flex-col bg-white rounded-2xl'>
//                             <ToastContainer />
//                             <div className='p-10 pt-0 flex flex-col items-center justify-center md:h-[550px] rounded-2xl w-full'>
//                                 <div className='w-[70%] h-full'>
//                                     <div className='grid grid-cols-[1fr] gap-4 '>

//                                         <div className='grid grid-cols-[1fr,1fr] gap-4 mt-5'>
//                                             <div className='border border-[#0A122A]/0.1 rounded-2xl pb-5 pt-3 px-5 shadow'>
//                                                 <h3 className='text-slate-500 font-medium mb-3'>Plan Details</h3>
//                                                 <h1 className='text-xl font-medium'>{membershipPlan?.plan_name}</h1>
//                                                 <div className='grid grid-cols-[1fr] gap-2 mt-2'>
//                                                     {membershipPlan && membershipPlan?.membership_feature_name?.map((e) => (
//                                                         <div>
//                                                             <FontAwesomeIcon icon={faCheck} className='text-sm' /><span className='ms-2 text-sm'>{e?.feature_name}</span>
//                                                         </div>
//                                                     ))}
//                                                 </div>
//                                             </div>


//                                             <div className='border border-[#0A122A]/0.1 rounded-2xl shadow py-5 px-5'>
//                                                 <h1 className='text-xl font-medium mb-3'>Order Summary</h1>
//                                                 <div className='flex justify-between mb-2'>
//                                                     <p className='text-[#0A122A]/[0.6] text-sm'>Sub Total</p>
//                                                     <p className='text-sm flex items-center'><RupeesIcon />{membershipPlan?.plan_selling_price}</p>
//                                                 </div>
//                                                 <div className='flex justify-between mb-2'>
//                                                     <p className='text-[#0A122A]/[0.6] text-sm'>Discount</p>
//                                                     <p className='text-sm text-[#FA3434] flex items-center'>- <RupeesIcon />0.00</p>
//                                                 </div>
//                                                 <div className='flex justify-between mb-2'>
//                                                     <p className='text-[#0A122A]/[0.6] text-sm'>Tax</p>
//                                                     <p className='text-sm text-[#00B517] flex items-center'>+ <RupeesIcon />0.00</p>
//                                                 </div>
//                                                 <div className='flex justify-between mb-2'>
//                                                     <p className='text-[#0A122A]/[0.6] text-sm'>Delivery Charges</p>
//                                                     <p className='text-sm text-[#00B517] flex items-center'>+ <RupeesIcon />0.00</p>
//                                                 </div>
//                                                 <div className='border my-3'></div>
//                                                 <div className='flex justify-between'>
//                                                     <p className='text-md'>Total</p>
//                                                     <p className='text-md flex items-center'><RupeesIcon /> {membershipPlan?.plan_selling_price}</p>
//                                                 </div>
//                                                 <div className='mt-3'>
//                                                     {loading ? (
//                                                         <button className='w-full bg-darkBlue text-white  px-4 py-2 rounded-lg'>
//                                                             <img src={loader} alt="" className='animate-spin h-[23px]' />
//                                                         </button>
//                                                     ) : (
//                                                         <button className='w-full bg-darkBlue text-white  px-4 py-2 rounded-lg' onClick={handlecheck}>Proceed To Payment <FontAwesomeIcon icon={faArrowRight} className='ms-2' /></button>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             {isOpen && (
//                                 <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
//                                     <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

//                                     <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
//                                         <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

//                                             <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md py-4">
//                                                 <div class="bg-white py-3">
//                                                     <div class="flex flex-col items-center">
//                                                         <img src={right} alt="" className='h-[80px]' />
//                                                         <h3 className='font-semibold text-2xl mt-4'>Thank You!</h3>
//                                                         <p className='text-sm px-5 text-center mt-3'>Payment done successfully.</p>
//                                                     </div>
//                                                 </div>
//                                                 <div class="bg-white mx-8 py-3">
//                                                     {navigateLoading ? (
//                                                         <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-3 text-md font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]">
//                                                             <img src={loader} className='animate-spin h-[23px]' alt="" />
//                                                         </button>
//                                                     ) : (
//                                                         <button onClick={closeModal} type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-3 text-md font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]">OKAY</button>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}

//                         </div>

//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default PackagePayment
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { faCheck, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import right from "../images/right.png"
import RupeesIcon from '../assets/Rupees';
import axios from 'axios';
import loader from "../images/loading.png"
import { BASE_URL } from '../BASE_URL';

const PackagePayment = () => {

    const location = useLocation();
    const navigate = useNavigate()
    const url = location.pathname

    const { _id } = useParams();
    const { merchentId } = useParams();

    const [loading, setLoading] = useState(false)
    const [navigateLoading, setNavigateLoading] = useState(false)
    const [dataLoading, setDataLoading] = useState(true) // Add loading state for data fetch

    const [isOpen, setIsOpen] = useState(false);

    const [membershipPlan, setMembershipPlan] = useState({}) // Initialize as empty object instead of array
    console.log(membershipPlan, "membershipPlan");

    useEffect(() => {
        const fetchCategoryList = async () => {
            try {
                setDataLoading(true); // Set loading to true
                const response = await axios.get(
                    `${BASE_URL}api/membership_plan/display`
                );

                const selected = response?.data?.data?.find((e) => e?._id === _id)

                if (selected) {
                    setMembershipPlan(selected);
                } else {
                    console.error("Plan not found with ID:", _id);
                    toast.error("Plan not found!");
                }
            } catch (error) {
                console.error("Error fetching plans:", error);
                toast.error("Failed to load plan details");
            } finally {
                setDataLoading(false); // Set loading to false
            }
        };

        if (_id) { // Only fetch if _id exists
            fetchCategoryList();
        }
    }, [_id]); // Add _id as dependency

    const handlecheck = async () => {
        // Add validation before proceeding
        if (!membershipPlan?._id || !membershipPlan?.plan_selling_price) {
            toast.error("Plan details not loaded yet. Please wait.");
            return;
        }

        const companyId = localStorage.getItem("myCompanyId")
        const email = localStorage.getItem("myEmailId")

        // Add validation for required data
        if (!companyId || !email) {
            toast.error("User details not found. Please login again.");
            return;
        }

        setLoading(true)

        try {
            const response = await axios.post(
                `${BASE_URL}api/transaction/initiate_payment`,
                {
                    amount: membershipPlan?.plan_selling_price,
                    plan_id: membershipPlan?._id,
                    MERCHANT_USER_ID: companyId,
                    emailid: email,
                    firstname: "User", // Add required fields for PayU
                    phone: "9999999999" // Add phone number or get from user data
                },
            );

            setLoading(false)

            // Handle PayU response - create and submit form
            if (response?.data?.success && response?.data?.data?.payload) {
                const { payload, action, merchantTransactionId } = response.data.data;

                console.log("PayU Data:", { payload, action }); // Debug log

                // Store transaction ID and plan ID for later use
                localStorage.setItem('currentTransactionId', merchantTransactionId);
                localStorage.setItem('currentPlanId', membershipPlan?._id);

                // Create a form dynamically and submit to PayU
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = action;
                form.style.display = 'none'; // Hide the form

                // Add all payload fields as hidden inputs
                Object.keys(payload).forEach(key => {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = key;
                    input.value = payload[key];
                    form.appendChild(input);
                });

                document.body.appendChild(form);
                console.log("Submitting form to PayU..."); // Debug log
                form.submit();
            } else {
                console.error("Invalid response:", response.data); // Debug log
                toast.error("Payment initialization failed");
            }

        } catch (error) {
            setLoading(false)
            console.error("Error initiating payment:", error);
            toast.error("Failed to initiate payment. Please try again.");
        }
    }

    const closeModal = () => {
        setNavigateLoading(true)
        setIsOpen(true);
        fetchPaymentData()
    }


    const fetchPaymentData = async () => {
        const token = `Bearer ${localStorage.getItem("chemicalToken")}`

        try {
            const res = await fetch(`${BASE_URL}api/transaction/payment_status?merchantTransactionId=${merchentId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
            })
            const data = await res.json()
            if (data?.success) {
                handleBook(data?.data?.paymentInstrument?.type);
            } else {
                setNavigateLoading(false);
                toast.error("Payment verification failed");
            }
        } catch (error) {
            setNavigateLoading(false);
            console.error("Error fetching payment data:", error);
            toast.error("Failed to verify payment");
        }
    }

    const handleBook = async (paymentMode) => {
        setLoading(true);

        try {
            const token = `Bearer ${localStorage.getItem("chemicalToken")}`;

            const response = await axios.post(
                `${BASE_URL}api/package_booking/create`,
                {
                    plan_id: membershipPlan?._id,
                    transaction_id: merchentId,
                    payment_mode: paymentMode,
                },
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            if (response?.status === 200) {
                setLoading(false);
                setNavigateLoading(false)
                localStorage.setItem("membershipStatus", "paid");
                navigate("/company/profile")
                toast.success("Package booked successfully!");
            }
        } catch (error) {
            setLoading(false);
            setNavigateLoading(false)
            console.error("Error booking package:", error);
            toast.error("Failed to book package. Please contact support.");
        }
    }


    useEffect(() => {
        if (merchentId !== undefined) {
            setIsOpen(true)
        }
    }, [merchentId]);

    // Show loading if data is still being fetched
    if (dataLoading) {
        return (
            <div className="w-full overflow-x-hidden">
                <div className="flex justify-center items-center h-96">
                    <img src={loader} alt="Loading..." className="animate-spin h-12 w-12" />
                    <span className="ml-3">Loading plan details...</span>
                </div>
            </div>
        );
    }

    // Show error if plan not found
    if (!membershipPlan?._id) {
        return (
            <div className="w-full overflow-x-hidden">
                <div className="flex justify-center items-center h-96">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-red-600">Plan Not Found</h2>
                        <p className="mt-2">The requested plan could not be loaded.</p>
                        <button
                            onClick={() => navigate("/packages")}
                            className="mt-4 bg-darkBlue text-white px-4 py-2 rounded-lg"
                        >
                            Go Back to Plans
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-hidden">
            <div className='flex justify-between items-end'>
                <div>
                    <h1 className="md:text-3xl text-xl font-semibold mb-5">Packages</h1>
                    {/* <p className='mb-2'>Add your terms & conditions here</p> */}
                </div>
            </div>
            <hr />
            <ToastContainer />
            <div>
                <div className='mt-10'>
                    <div className='lg:px-20 md:px-10 pb-[100px]'>
                        <div className='flex md:flex-row flex-col bg-white rounded-2xl'>
                            <ToastContainer />
                            <div className='p-10 pt-0 flex flex-col items-center justify-center md:h-[550px] rounded-2xl w-full'>
                                <div className='w-[70%] h-full'>
                                    <div className='grid grid-cols-[1fr] gap-4 '>

                                        <div className='grid grid-cols-[1fr,1fr] gap-4 mt-5'>
                                            <div className='border border-[#0A122A]/0.1 rounded-2xl pb-5 pt-3 px-5 shadow'>
                                                <h3 className='text-slate-500 font-medium mb-3'>Plan Details</h3>
                                                <h1 className='text-xl font-medium'>{membershipPlan?.plan_name}</h1>
                                                <div className='grid grid-cols-[1fr] gap-2 mt-2'>
                                                    {membershipPlan?.membership_feature_name?.map((e, index) => (
                                                        <div key={index}>
                                                            <FontAwesomeIcon icon={faCheck} className='text-sm' /><span className='ms-2 text-sm'>{e?.feature_name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>


                                            <div className='border border-[#0A122A]/0.1 rounded-2xl shadow py-5 px-5'>
                                                <h1 className='text-xl font-medium mb-3'>Order Summary</h1>
                                                <div className='flex justify-between mb-2'>
                                                    <p className='text-[#0A122A]/[0.6] text-sm'>Sub Total</p>
                                                    <p className='text-sm flex items-center'><RupeesIcon />{membershipPlan?.plan_selling_price}</p>
                                                </div>
                                                <div className='flex justify-between mb-2'>
                                                    <p className='text-[#0A122A]/[0.6] text-sm'>Discount</p>
                                                    <p className='text-sm text-[#FA3434] flex items-center'>- <RupeesIcon />0.00</p>
                                                </div>
                                                <div className='flex justify-between mb-2'>
                                                    <p className='text-[#0A122A]/[0.6] text-sm'>Tax</p>
                                                    <p className='text-sm text-[#00B517] flex items-center'>+ <RupeesIcon />0.00</p>
                                                </div>
                                                <div className='flex justify-between mb-2'>
                                                    <p className='text-[#0A122A]/[0.6] text-sm'>Delivery Charges</p>
                                                    <p className='text-sm text-[#00B517] flex items-center'>+ <RupeesIcon />0.00</p>
                                                </div>
                                                <div className='border my-3'></div>
                                                <div className='flex justify-between'>
                                                    <p className='text-md'>Total</p>
                                                    <p className='text-md flex items-center'><RupeesIcon /> {membershipPlan?.plan_selling_price}</p>
                                                </div>
                                                <div className='mt-3'>
                                                    {loading ? (
                                                        <button className='w-full bg-darkBlue text-white px-4 py-2 rounded-lg' disabled>
                                                            <img src={loader} alt="" className='animate-spin h-[23px] mx-auto' />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className='w-full bg-darkBlue text-white px-4 py-2 rounded-lg hover:bg-opacity-90'
                                                            onClick={handlecheck}
                                                            disabled={!membershipPlan?._id} // Disable if plan not loaded
                                                        >
                                                            Proceed To Payment <FontAwesomeIcon icon={faArrowRight} className='ms-2' />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {isOpen && (
                                <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                                            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md py-4">
                                                <div className="bg-white py-3">
                                                    <div className="flex flex-col items-center">
                                                        <img src={right} alt="" className='h-[80px]' />
                                                        <h3 className='font-semibold text-2xl mt-4'>Thank You!</h3>
                                                        <p className='text-sm px-5 text-center mt-3'>Payment done successfully.</p>
                                                    </div>
                                                </div>
                                                <div className="bg-white mx-8 py-3">
                                                    {navigateLoading ? (
                                                        <button type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-3 text-md font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]" disabled>
                                                            <img src={loader} className='animate-spin h-[23px]' alt="" />
                                                        </button>
                                                    ) : (
                                                        <button onClick={closeModal} type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-3 text-md font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]">OKAY</button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default PackagePayment


{/* <div className='h-full w-full border border-[#0A122A]/0.1 rounded-2xl shadow py-5 px-8'>
                                            <div className='w-full'>
                                                <div className='mb-4'>
                                                    <h1 className='text-xl font-medium'>Select Payment Method</h1>
                                                </div>
                                                <div className=' border border-[#0A122A]/0.5 rounded px-3 py-3 mb-14'>
                                                    <div className='grid grid-cols-[1fr,1fr,1fr]'>
                                                        <div className='flex flex-col justify-center items-center'>
                                                            <img src={upi} alt="" className='mb-2' />
                                                            <p className='mb-2'>UPI / QR</p>
                                                            <input type="radio" name="why" id="" />
                                                        </div>
                                                        <div className='flex flex-col justify-center items-center'>
                                                            <img src={bank} alt="" className='w-[30px] mb-2 ' />
                                                            <p className='mb-2'>Net Banking</p>
                                                            <input type="radio" name="why" id="" />
                                                        </div>
                                                        <div className='flex flex-col justify-center items-center'>
                                                            <img src={bank} alt="" className='w-[30px] mb-2' />
                                                            <p className='mb-2'>Debit / Credit Card</p>
                                                            <input type="radio" name="why" id="" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='mb-4'>
                                                    <p>Name On Card</p>
                                                    <input type="text" className='border-2 border-black-500 rounded w-full px-5 py-1' />
                                                </div>
                                                <div className='mb-4'>
                                                    <p>Card Number</p>
                                                    <input type="text" className='border-2 border-black-300 rounded w-full px-5 py-1' />
                                                </div>
                                                <div className='grid grid-cols-[2fr,2fr] gap-4'>
                                                    <div>
                                                        <p>Expire Date</p>
                                                        <input type="text" className='border-2 border-black-300 rounded w-full px-5 py-1' />
                                                    </div>
                                                    <div>
                                                        <p>CVC</p>
                                                        <input type="text" className='border-2 border-black-300 rounded w-full px-5 py-1' />
                                                    </div>
                                                </div>
                                            </div>
                                        </div> */}