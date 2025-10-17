import React, { useContext, useEffect, useRef, useState } from "react";
import invoiceCompany from "../images/invoice-company.png";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useLocation, useNavigate } from "react-router-dom";
import { useSharedState } from "../context/ManageOpenContext";
import RupeesIcon from "../assets/Rupees";
import { DisplayPoContext } from "../context/PoViewContext";
import { BASE_URL } from "../BASE_URL";
import { DisplayCreditDebitContext } from "../context/DisplayCreditDebitContext";
import logo from "../images/anbizz-logo.png";

function numberToWords(num) {
  if (num === 0) return "Zero";

  const belowTwenty = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  const thousands = ["", "Thousand", "Million", "Billion"];

  function helper(num) {
    if (num === 0) return "";
    else if (num < 20) return belowTwenty[num] + " ";
    else if (num < 100)
      return tens[Math.floor(num / 10)] + " " + helper(num % 10);
    else
      return (
        belowTwenty[Math.floor(num / 100)] + " Hundred " + helper(num % 100)
      );
  }

  let result = "";
  let i = 0;

  while (num > 0) {
    if (num % 1000 !== 0) {
      result = helper(num % 1000) + thousands[i] + " " + result;
    }
    num = Math.floor(num / 1000);
    i++;
  }

  return result.trim();
}

const formatDate = (dateString) => {
  // Create a Date object from the input date string
  const date = new Date(dateString);

  // Extract the day, month, and year in UTC from the date
  const day = String(date.getUTCDate()).padStart(2, "0"); // Ensure two digits
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getUTCFullYear();

  // Return the formatted date as "DD-MM-YYYY"
  return `${day}-${month}-${year}`;
};
const calculateReturnTotals = (array) => {
  if (!array || array.length === 0) {
    return { totalQuantity: 0, totalTaxable: 0, totalGst: 0, totalAmount: 0 };
  }

  // For single return item, use the direct values
  const item = array[0];
  return {
    totalQuantity: item.total_return_qty || 0,
    totalTaxable: (item.total_return_amount || 0) / (1 + (item.products?.[0]?.igst || 0) / 100),
    totalGst: (item.total_return_amount || 0) - ((item.total_return_amount || 0) / (1 + (item.products?.[0]?.igst || 0) / 100)),
    totalAmount: item.total_return_amount || 0
  };
};

const CreditDebitNote = ({ data, returnRequestdata }) => {
  const {
    displayCreditDebit,
    creditDebitData,
    returnRequestData,
    setDisplayCreditDebit,
  } = useContext(DisplayCreditDebitContext);
  const returnTotals = calculateReturnTotals(returnRequestdata || []);

  // console.log(data)
  const location = useLocation();

  const fullPath = location.pathname;
  const pathSegments = fullPath.split("/");

  const companyId = localStorage.getItem("myCompanyId");
  const [userPost, setUserPost] = useState("");

  const { setDisplayPo } = useContext(DisplayPoContext);

  useEffect(() => {
    if (data?.buyer_company_id === companyId) {
      setUserPost("buyer");
    } else {
      setUserPost("seller");
    }
  }, [data, companyId]);

  const handleButtonClick = () => {
    if (
      pathSegments?.[2] === "generate-new-manual-po" ||
      pathSegments?.[2] === "edit-po" ||
      pathSegments?.[2] === "generate-po" ||
      pathSegments?.[2] === "generate-new-inquiry-po" ||
      pathSegments?.[2] === "sales-data"
    ) {
      navigate("/company/purchase-data");
      setDisplayPo(false);
      setDisplayCreditDebit(false);
    } else {
      setDisplayPo(false);
      setDisplayCreditDebit(false); // Add this line
    }
  };

  const [userData, setUserData] = useState("");

  const [companyPhoto, setCompanyPhoto] = useState("");
  const [gstCheck, setGstCheck] = useState("");
  const [termsAndConditions, setTermsAndConditions] = useState(
    data?.termsand_condition || ""
  );
  const [isAddingTerms, setIsAddingTerms] = useState(false);
  const [newTerm, setNewTerm] = useState("");
  useEffect(() => {
    if (!data?.seller_to_state || !data?.bill_to_state) {
      setGstCheck("igst");
    } else if (data?.seller_to_state === data?.bill_to_state) {
      setGstCheck("sgst");
    } else {
      setGstCheck("igst");
    }
  }, [data?.seller_to_state, data?.bill_to_state]);

  const handleAddTerm = () => {
    if (newTerm.trim()) {
      const updatedTerms = termsAndConditions
        ? `${termsAndConditions}\n• ${newTerm.trim()}`
        : `• ${newTerm.trim()}`;
      setTermsAndConditions(updatedTerms);
      setNewTerm("");
    }
    setIsAddingTerms(false);
  };

  const handleCancelAddTerm = () => {
    setNewTerm("");
    setIsAddingTerms(false);
  };

  const fetchUserData = async () => {
    const token = `Bearer ${localStorage.getItem("chemicalToken")}`;
    const res = await fetch(`${BASE_URL}company/cominfo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const data = await res.json();
   

    setUserData(data.companyDetails?.[0]);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const navigate = useNavigate();

  const divRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleDownloadPdf = () => {
    const element = divRef.current;
    if (!element) {
      console.error("Element not found in the document.");
      return;
    }

    html2canvas(element, {
      logging: true,
      letterRendering: 1,
      useCORS: true,
      scale: 3, // Increase the scale factor for better quality
    })
      .then((canvas) => {
        const imgWidth = 208;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        // Set the image quality and scale in jsPDF
        pdf.addImage(
          imgData,
          "PNG",
          0,
          0,
          imgWidth,
          imgHeight,
          undefined,
          "FAST",
          {
            quality: 0.98, // Adjust the quality (0 to 1), 1 being the highest
          }
        );

        pdf.save(`po_${data?.po_num}`);
      })
      .catch((error) => {
        console.error("Error capturing the element with html2canvas:", error);
      });
  };

  useEffect(() => {
    const image = new Image();
    image.src = companyPhoto;

    image.onload = () => {
      setImageLoaded(true);
    };

    image.onerror = () => {
      console.error("Failed to load image.");
      setImageLoaded(false);
    };
  }, [companyPhoto]);

  const calculateTotals = (array) => {
    return array.reduce(
      (totals, item) => {
        totals.totalQuantity += parseFloat(item.qty);
        totals.totalRate += parseFloat(item.rate);
        totals.totalTaxable += parseFloat(item.taxable_amount);
        totals.totalGst += parseFloat(item.igst);
        totals.totalGstAmount += parseFloat(item.gstAmount);
        totals.totalAmount += parseFloat(item.total);
        return totals;
      },
      {
        totalQuantity: 0,
        totalRate: 0,
        totalGst: 0,
        totalGstAmount: 0,
        totalTaxable: 0,
        totalAmount: 0,
      }
    );
  };

  const totals = calculateTotals(data?.product_details);

  const totalTaxableValue = data?.product_details.reduce(
    (sum, item) => sum + item.taxable_amount,
    0
  );
  const totalIGST = data?.product_details.reduce(
    (sum, item) => sum + (item.igst * item.rate) / 100,
    0
  );

  console.log(data, "ddd");

  return (
    <div className="bg-transparent flex flex-col items-center justify-center">
      <div className="flex gap-5 mb-4">
        <button
          onClick={handleDownloadPdf}
          className="bg-darkBlue text-white text-sm px-14 font-semibold cursor-pointer rounded-[10px] py-2"
        >
          Download
        </button>
        <button
          onClick={handleButtonClick}
          className="bg-darkBlue text-white text-sm px-14 font-semibold cursor-pointer rounded-[10px] py-2"
        >
          Close
        </button>
      </div>
      <div ref={divRef} className="bg-white px-10 py-10 w-[50vw] relative">
        {/* Background Logo */}
        <div
          className="absolute inset-0 opacity-2 pointer-events-none"
          style={{
            backgroundImage: `url(${logo})`,
            backgroundSize: "100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            zIndex: 0,
          }}
        ></div>

        {/* Saara content ek hi relative div ke andar */}
        <div className="relative z-10">
          {/* <div className="mb-10">
            <div className="flex justify-between">
              <div className="flex gap-2">
                <div className="h-full">
                  {data?.bill_to_logo ? (
                    <img
                      src={data?.bill_to_logo}
                      alt=""
                      className="w-[100px] h-[80px]"
                    />
                  ) : (
                    <div className="h-full w-20 bg-gray-200 rounded-md border-[4px] border-gray-300 flex items-center justify-center mb-2">
                      <p className="text-2xl font-semibold text-gray-600">
                        {data?.bill_to_name?.slice(0, 2)?.toUpperCase()}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm">{data?.bill_to_name}</p>
                  <p className="font-medium text-sm">{data?.bill_to_address}</p>
                  <p className="font-medium text-sm">
                    {data?.bill_to_city},{data?.bill_to_state},{" "}
                    {data?.bill_to_country}-{data?.bill_to_pincode}
                  </p>
                  <p className="font-medium text-sm">{data?.bill_to_gst_in}</p>
                </div>
              </div>
            </div>
          </div> */}
          <div className="mb-10">
            <div className="flex justify-between">
              <div className="flex gap-2">
                <div className="h-full">
                  {/* Credit Note - Show Seller Details */}
                  {userPost === "seller" ? (
                    data?.seller_company_details?.[0]?.company_logo ? (
                      <img
                        src={data.seller_company_details[0].company_logo}
                        alt="Seller Company Logo"
                        className="w-[100px] h-[80px]"
                      />
                    ) : (
                      <div className="h-full w-20 bg-gray-200 rounded-md border-[4px] border-gray-300 flex items-center justify-center mb-2">
                        <p className="text-2xl font-semibold text-gray-600">
                          {data?.seller_company_details?.[0]?.company_name
                            ?.slice(0, 2)
                            ?.toUpperCase() || "SC"}
                        </p>
                      </div>
                    )
                  ) : data?.bill_to_logo ? (
                    <img
                      src={data?.bill_to_logo}
                      alt="Buyer Company Logo"
                      className="w-[100px] h-[80px]"
                    />
                  ) : (
                    <div className="h-full w-20 bg-gray-200 rounded-md border-[4px] border-gray-300 flex items-center justify-center mb-2">
                      <p className="text-2xl font-semibold text-gray-600">
                        {data?.bill_to_name?.slice(0, 2)?.toUpperCase() || "BC"}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  {userPost === "seller" ? (
                    <>
                      <p className="font-medium text-sm">
                        {data?.seller_company_details?.[0]?.company_name}
                      </p>
                      <p className="font-medium text-sm">
                        {data?.seller_company_details?.[0]?.address}
                      </p>
                      <p className="font-medium text-sm">
                        {data?.seller_company_details?.[0]?.city},{" "}
                        {data?.seller_company_details?.[0]?.state},{" "}
                        {data?.seller_company_details?.[0]?.country} -{" "}
                        {data?.seller_company_details?.[0]?.Pincode}
                      </p>
                      <p className="font-medium text-sm">
                        {data?.seller_company_details?.[0]?.gst}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-medium text-sm">
                        {data?.bill_to_name}
                      </p>
                      <p className="font-medium text-sm">
                        {data?.bill_to_address}
                      </p>
                      <p className="font-medium text-sm">
                        {data?.bill_to_city}, {data?.bill_to_state},{" "}
                        {data?.bill_to_country} - {data?.bill_to_pincode}
                      </p>
                      <p className="font-medium text-sm">
                        {data?.bill_to_gst_in}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <table className="w-full border-[3px] border-blue-400 table-auto">
            <thead className="border-b-[3px] border-blue-400">
              <tr className="">
                <th className="border-blue-400 border-r-[3px] w-1/3 font-medium text-md leading-48">
                  {/* <p className='py-2'><span className='font-semibold'>GSTIN</span> : {data?.bill_to_gst_in}</p> */}
                </th>
                <th className="border-blue-400 border-r-[3px] w-1/3 font-semibold text-md text-[#0070C0] ">
                  <p>{userPost === "buyer" ? "Debit Note" : "Credit Note"}</p>
                </th>
                <th className="w-1/3 font-semibold text-md "></th>
              </tr>
            </thead>
            <tbody className="">
              <tr className="">
                <td className="border-blue-400 border-r-[3px] font-medium ps-3 py-2 text-xs">
                  Details of Buyer | Shipped to :{" "}
                </td>
                <td className="border-blue-400 border-r-[3px] font-medium ps-3 py-2 text-xs">
                  Seller Detail :{" "}
                </td>
                <td className="font-medium ps-3 py-2">
                  {returnRequestdata &&
                    returnRequestdata.length > 0 &&
                    returnRequestdata.map((item) => (
                      <div className="grid grid-cols-[1fr,1.5fr]">
                        <p className="text-xs">Return ID:</p>
                        <p className="text-xs">{item?._id?.slice(-8)}</p>
                      </div>
                    ))}
                </td>
              </tr>
              <tr className="">
                <td className="border-blue-400 border-r-[3px] font-medium ps-3 align-top">
                  <div className="grid grid-cols-[1fr,2.4fr,] h-full">
                    <p className="text-xs">Name :</p>
                    <p className="text-xs">{data?.shipped_to_name}</p>
                  </div>
                </td>
                <td className="border-blue-400 border-r-[3px] font-medium ps-3 align-top">
                  <div className="grid grid-cols-[1fr,2.4fr,]">
                    <p className="text-xs">Name :</p>
                    <p className="text-xs">
                      {" "}
                      {data.seller_company_details?.[0]?.company_name}
                    </p>
                  </div>
                </td>
                <td className="font-medium ps-3 align-top py-2">
                  {returnRequestdata &&
                    returnRequestdata.length > 0 &&
                    returnRequestdata.map((item) => (
                      <div className="grid grid-cols-[1fr,1.5fr]">
                        <p className="text-xs">Date:</p>
                        <p className="text-xs">{formatDate(item?.createdAt)}</p>
                      </div>
                    ))}
                </td>
              </tr>
              <tr className="">
                <td className="border-blue-400 border-r-[3px] font-medium ps-3 align-top">
                  <div className="grid grid-cols-[1fr,2.4fr,]">
                    <p className="text-xs">GSTIN :</p>
                    <p className="text-xs">{data?.shipped_to_gst_in}</p>
                  </div>
                </td>
                <td className="border-blue-400 border-r-[3px] font-medium ps-3 align-top">
                  <div className="grid grid-cols-[1fr,2.4fr,]">
                    <p className="text-xs">GSTIN :</p>
                    <p className="text-xs">
                      {data.seller_company_details?.[0]?.gst}
                    </p>
                  </div>
                </td>
                <td className="font-medium ps-3 align-top py-2">
                  {returnRequestdata &&
                    returnRequestdata.length > 0 &&
                    returnRequestdata.map((item, index) => {
                      const getStatusColor = (status) => {
                        if (status === "rejected") return "text-red-600";
                        if (
                          status === "refund_successful" ||
                          status === "completed"
                        )
                          return "text-green-600";
                        if (status === "pending" || status === "under_review")
                          return "text-yellow-600";
                        return "text-blue-600";
                      };

                      return (
                        <div className="grid grid-cols-[1fr,1.5fr]" key={index}>
                          <p className="text-xs">Status:</p>
                          <p
                            className={`text-xs font-semibold ${getStatusColor(
                              item?.status
                            )}`}
                          >
                            {item?.status
                              ? item.status
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (l) => l.toUpperCase())
                              : ""}
                          </p>
                        </div>
                      );
                    })}
                </td>
              </tr>
              <tr className="">
                <td className="border-blue-400 border-r-[3px] font-medium ps-3 align-top">
                  <div className="grid grid-cols-[1fr,2.4fr,]">
                    <p className="text-xs">Address :</p>
                    <p className="text-xs">{data?.shipped_to_address}</p>
                  </div>
                </td>
                <td className="border-blue-400 border-r-[3px] font-medium ps-3 align-top">
                  <div className="grid grid-cols-[1fr,2.4fr,]">
                    <p className="text-xs">Address :</p>
                    <p className="text-xs">
                      {data.seller_company_details?.[0]?.address}
                    </p>
                  </div>
                </td>
                <td className="border-blue-400 border-r-[3px] font-medium ps-3 align-top py-2">
                  {returnRequestdata &&
                    returnRequestdata.length > 0 &&
                    returnRequestdata.map((item) => (
                      <div className="grid grid-cols-[1fr,2.4fr]">
                        <p className="text-xs">State:</p>
                        <p className="text-xs">{item?.seller?.state}</p>
                      </div>
                    ))}
                </td>
              </tr>
              <tr className="">
                <td className="border-blue-400 border-r-[3px] font-medium ps-3 align-top">
                  <div className="grid grid-cols-[1fr,2.4fr,]">
                    <p className="text-xs">Country :</p>
                    <p className="text-xs">{data?.shipped_to_country}</p>
                  </div>
                </td>
                <td className="border-blue-400 border-r-[3px] font-medium ps-3 align-top">
                  <div className="grid grid-cols-[1fr,2.4fr,]">
                    <p className="text-xs">Country :</p>
                    <p className="text-xs">
                      {data.seller_company_details?.[0]?.country}
                    </p>
                  </div>
                </td>
              </tr>
              <tr className="">
                <td className="border-blue-400 border-r-[3px] font-medium ps-3 align-top">
                  <div className="grid grid-cols-[1fr,2.4fr,]">
                    <p className="text-xs">State :</p>
                    <p className="text-xs">{data?.shipped_to_state}</p>
                  </div>
                </td>
                <td className="border-blue-400 border-r-[3px] font-medium ps-3 align-top">
                  <div className="grid grid-cols-[1fr,2.4fr,]">
                    <p className="text-xs">State :</p>
                    <p className="text-xs">
                      {data.seller_company_details?.[0]?.state}
                    </p>
                  </div>
                </td>
              </tr>
              <tr className="">
                <td className="border-blue-400 border-r-[3px] font-medium ps-3 align-top">
                  <div className="grid grid-cols-[1fr,2.4fr,]">
                    <p className="text-xs">City :</p>
                    <p className="text-xs">{data?.shipped_to_city}</p>
                  </div>
                </td>
                <td className="border-blue-400 border-r-[3px] font-medium ps-3 align-top">
                  <div className="grid grid-cols-[1fr,2.4fr,]">
                    <p className="text-xs">City :</p>
                    <p className="text-xs">
                      {data.seller_company_details?.[0]?.city}
                    </p>
                  </div>
                </td>
              </tr>
              <tr className="">
                <td className="border-blue-400 border-r-[3px] font-medium ps-3 align-top">
                  <div className="grid grid-cols-[1fr,2.4fr,]">
                    <p className="text-xs">Pincode :</p>
                    <p className="text-xs">{data?.shipped_to_pincode}</p>
                  </div>
                </td>
                <td className="border-blue-400 border-r-[3px] font-medium ps-3 align-top">
                  <div className="grid grid-cols-[1fr,2.4fr,]">
                    <p className="text-xs">Pincode :</p>
                    <p className="text-xs">
                      {data.seller_company_details?.[0]?.Pincode}
                    </p>
                  </div>
                </td>
              </tr>
              <tr className="">
                <td className="border-blue-400 border-r-[3px] font-medium ps-3 pb-5 align-top">
                  <div className="grid grid-cols-[1fr,2.4fr,]">
                    <p className="text-xs">Phone :</p>
                    <p className="text-xs">{data?.shipped_to_phone}</p>
                  </div>
                </td>
                <td className="border-blue-400 border-r-[3px] font-medium ps-3 pb-5 align-top">
                  <div className="grid grid-cols-[1fr,2.4fr,]">
                    <p className="text-xs">Phone :</p>
                    <p className="text-xs">
                      {data.seller_company_details?.[0]?.mobile_num}
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <table className="w-full table-auto mt-10">
            <thead className=" bg-blue-100">
              <tr className="border-[3px] border-blue-400">
                <th className="border-blue-400 border-r-[3px] w-[5%] font-medium text-sm py-3">
                  Sr No.
                </th>
                <th className="border-blue-400 border-r-[3px] w-[25%] font-semibold text-sm">
                  Name Of Product / Service
                </th>
                <th className="border-blue-400 border-r-[3px] w-[7%] font-semibold text-sm text-center">
                  HSN / SAC
                </th>
                <th className="w-[7%] font-semibold text-sm border-blue-400 border-r-[3px]">
                  Qty
                </th>
                <th className="w-[7%] font-semibold text-sm border-blue-400 border-r-[3px]">
                  Rate
                </th>
                <th className="w-[7%] font-semibold text-sm border-blue-400 border-r-[3px]">
                  Taxable Value
                </th>
                {gstCheck === "igst" && (
                  <th className="w-[5%] font-semibold text-sm border-blue-400 border-r-[3px]">
                    Amount(IGST)
                  </th>
                )}
                {gstCheck === "sgst" && (
                  <>
                    <th className="w-[10%] font-semibold text-lg border-blue-400 border-r-[3px]">
                      <div className="border-blue-400 border-b-[3px]">GST</div>
                      <div className="grid grid-cols-[1fr,1fr]">
                        <div className="text-sm pt-1 px-2 border-r-[3px] border-blue-400">
                          SGST
                        </div>
                        <div className="text-sm pt-1 px-2">CGST</div>
                      </div>
                    </th>
                  </>
                )}
                <th className="w-[5%] font-semibold text-sm border-blue-400 border-r-[3px]">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="">
              {data &&
                data?.product_details.map((e, index) => (
                  <tr className="">
                    <td className="border-blue-400 border-r-[3px] border-l-[3px] font-medium ps-3 py-2 text-center text-xs">
                      {index + 1}
                    </td>
                    <td className="border-blue-400 border-r-[3px] font-medium ps-3 py-2 text-xs">
                      <p className="font-semibold">{e.chem_name}</p>
                    </td>
                    <td className="border-blue-400 border-r-[3px] font-medium py-2 text-center text-xs">
                      {e.hsn}
                    </td>
                    <td className="border-blue-400 border-r-[3px] font-medium py-2 text-center text-xs">
                      {/* Show return quantity instead of original quantity */}
                      {returnRequestdata && returnRequestdata.length > 0
                        ? `${returnRequestdata[0]?.total_return_qty || 0} Kg`
                        : `${e.qty}${e.qty_type}`
                      }
                    </td>
                    <td className="border-blue-400 border-r-[3px] font-medium  py-2 text-center text-xs">
                      <p className="flex items-center justify-center">
                        <RupeesIcon />
                        {e.rate}
                      </p>
                    </td>
                    <td className="border-blue-400 border-r-[3px] font-medium  py-2 text-center text-xs">
                      <p className="flex items-center justify-center">
                        <RupeesIcon />
                      {returnTotals.totalTaxable.toFixed(2)}
                      </p>
                    </td>
                    {gstCheck === "igst" && (
                      <td className="border-blue-400 border-r-[3px] font-medium  py-2 text-center text-xs">
                        {/* {e.gstAmount.toFixed()}({e.igst}%) */}
                         {returnTotals.totalGst.toFixed(2)}
                      </td>
                    )}
                    {gstCheck === "sgst" && (
                      <td className="border-blue-400 border-r-[3px] font-medium  py-2 text-center text-xs">
                        <div className="grid grid-cols-[1fr,1fr]">
                          <div className="border-blue-400 border-r-[3px] h-full">
                            {(e.gstAmount / 2).toFixed(2)} ({e.igst / 2}%)
                          </div>
                          <div className=" h-full">
                            {(e.gstAmount / 2).toFixed(2)} ({e.igst / 2}%)
                          </div>
                        </div>
                      </td>
                    )}
                    <td className="border-blue-400 border-r-[3px] font-medium  py-2 text-center text-xs">
                      <p className="flex items-center justify-center">
                        <RupeesIcon />
                             {returnRequestdata[0]?.total_return_amount?.toFixed(2) || "0.00"}
                      </p>
                    </td>
                  </tr>
                ))}

              {/* Show Return Summary in the main table instead */}
              {/* {returnRequestdata && returnRequestdata.length > 0 && (
                <tr className="border-blue-400 border-[3px] bg-yellow-100 text-xs">
                  <td colSpan={3} className="py-2 border-blue-400 border-r-[3px] text-end font-semibold pe-2">
                    Return Summary
                  </td>
                  <td className="py-2 border-blue-400 border-r-[3px] text-end font-semibold pe-2">
                    {returnRequestdata[0]?.total_return_qty || 0} Kg
                  </td>
                  <td className="py-2 border-blue-400 border-r-[3px] text-end font-semibold pe-2">
                  </td>
                  <td className="py-2 border-blue-400 border-r-[3px] text-end font-semibold pe-2">
                    <p className="flex items-center justify-center">
                      <RupeesIcon />
                      {returnTotals.totalTaxable.toFixed(2)}
                    </p>
                  </td>
                  <td className="py-2 border-blue-400 border-r-[3px] text-end font-semibold pe-2">
                    <p className="flex items-center justify-center">
                      <RupeesIcon />
                      {returnTotals.totalGst.toFixed(2)}
                    </p>
                  </td>
                  <td className="py-2 border-blue-400 border-r-[3px] text-end font-semibold pe-2">
                    <p className="flex items-center justify-center">
                      <RupeesIcon />
                      {returnRequestdata[0]?.total_return_amount?.toFixed(2) || "0.00"}
                    </p>
                  </td>
                </tr>
              )} */}
            </tbody>
          </table>

          <div className="border-blue-400 border-l-[3px] border-b-[3px] grid grid-cols-[1fr]">
            <div className="border-blue-400 border-blue-400 border-r-[3px]"></div>
            <div className="grid grid-cols-[1.8fr,1.2fr,]">
              <div className="border-blue-400 ">
                <div className="text-xs font-medium text-center border-blue-400 border-b-[3px] border-t-[3px] py-1">
                  Total In Words
                </div>
                <div className="font-semibold text-center border-blue-400 border-b-[3px] py-1 text-xs">
                  {numberToWords(totals.totalAmount.toFixed()).toUpperCase()}{" "}
                  RUPEES ONLY
                </div>
                {/* {data?.invoice_type !== "po" && (
            <>
              <div className="font-semibold text-center border-blue-400 border-b-[3px] py-1 text-sm">
                BANK DETAILS
              </div>
              <div className="border-blue-400 border-b-[3px] py-2 px-5">
                <div className="grid grid-cols-[3fr,1fr]">
                  <div className="text-xs">
                    <div className="grid grid-cols-[1.7fr,2.5fr]">
                      <p className="font-medium">Name</p>
                      <p className="font-medium">
                        {data?.bank_details?.[0]?.bank_name}
                      </p>
                    </div>
                    <div className="grid grid-cols-[1.7fr,2.5fr]">
                      <p className="font-medium">Branch</p>
                      <p className="font-medium">
                        {data?.bank_details?.[0]?.bank_branch}
                      </p>
                    </div>
                    <div className="grid grid-cols-[1.7fr,2.5fr]">
                      <p className="font-medium">Acc. Number</p>
                      <p className="font-medium">
                        {data?.bank_details?.[0]?.bank_account_num}
                      </p>
                    </div>
                    <div className="grid grid-cols-[1.7fr,2.5fr]">
                      <p className="font-medium">IFSC</p>
                      <p className="font-medium">
                        {data?.bank_details?.[0]?.bank_IFSC_code}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )} */}
                {/* <div className="font-semibold text-center border-blue-400 border-b-[3px] py-1 text-sm">
            TERMS & CONDITIONS
          </div> */}
                <div className="font-semibold text-center border-blue-400 border-b-[3px] py-1 text-sm flex items-center justify-between px-3">
                  <span className="text-center">TERMS & CONDITIONS</span>
                  <button
                    onClick={() => setIsAddingTerms(true)}
                    className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-lg font-bold hover:bg-blue-600 transition-colors"
                    title="Add New Term"
                  >
                    +
                  </button>
                </div>

                {/* Add New Term Input */}
                {isAddingTerms && (
                  <div className="border-blue-400 border-b-[3px] p-3 bg-blue-50">
                    <textarea
                      value={newTerm}
                      onChange={(e) => setNewTerm(e.target.value)}
                      placeholder="Enter new term and condition..."
                      className="w-full p-2 text-xs border border-gray-300 rounded mb-2 resize-none"
                      rows="3"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={handleCancelAddTerm}
                        className="bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddTerm}
                        className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}

                <div className="py-2 px-3 text-xs min-h-[100px]">
                  {termsAndConditions ? (
                    <div className="whitespace-pre-line">
                      {termsAndConditions.split("\n").map((term, index) => (
                        <p key={index} className="mb-1">
                          {term}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      No terms and conditions added yet.
                    </p>
                  )}
                </div>
              </div>
              {returnRequestdata &&
                returnRequestdata.length > 0 &&
                returnRequestdata.map((item) => (
                  <div
                    key={item._id}
                    className="border-blue-400 border-l-[3px] border-r-[3px] border-b-[3px] mt-[-1px]"
                  >
                    <div className="bg-blue-100 text-center font-semibold py-2 border-b-[3px] border-blue-400">
                      <p className="text-sm">
                        {userPost === "buyer"
                          ? "Debit Note (Return Summary)"
                          : "Credit Note (Return Summary)"}
                      </p>
                    </div>

                    <div className="border-blue-400 border-b-0 border-[3px] text-xs">
                      {/* Reason */}
                      <div className="flex justify-between bg-blue-100 border-blue-400 border-b-[3px] py-1 px-2">
                        <p className="font-semibold">Reason</p>
                        <p className="flex items-center justify-center font-semibold">
                          {item.reason}
                        </p>
                      </div>

                      {/* IGST from product */}
                      <div className="flex justify-between border-blue-400 border-b-[3px] py-1 px-2">
                        <p className="font-semibold">IGST</p>
                        <p className="font-semibold">
                          {item?.products?.[0]?.igst || 0} %
                        </p>
                      </div>

                      {/* Total Return Amount */}
                      <div className="flex justify-between bg-blue-100 border-blue-400 border-b-[3px] py-1 px-2">
                        <p className="font-semibold">Total Amount After Tax</p>
                        <p className="font-semibold flex items-center justify-center">
                          <RupeesIcon />
                          {item?.total_return_amount?.toFixed(2) || "0.00"}
                        </p>
                      </div>

                      {/* Total Return Qty */}
                      <div className="flex justify-between bg-blue-100 border-blue-400 border-b-[3px] py-1 px-2">
                        <p className="font-semibold">Total Quantity Returned</p>
                        <p className="font-semibold flex items-center justify-center">
                          {item?.total_return_qty} Kg
                        </p>
                      </div>

                      {/* Status */}
                      <div className="flex justify-between border-blue-400 border-b-[3px] py-1 px-2">
                        <p className="font-semibold">Status</p>
                        <p className="font-semibold">
                          {item?.status
                            ? item.status
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())
                            : ""}
                        </p>
                      </div>

                      {/* Stamp & Sign */}
                      <div className="flex justify-center py-3 border-blue-400 border-b-[3px] py-1 px-2">
                        <img
                          src={data?.upload_stamp}
                          alt=""
                          className="h-[60px]"
                        />
                      </div>
                      <div className="flex justify-between py-1 px-2 items-center">
                        <p className="font-bold">Authority Signatory</p>
                        <img
                          src={data?.upload_sign}
                          alt=""
                          className="h-[20px]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              Generated by{" "}
              <span className="font-semibold text-blue-600">Chembizz.in</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditDebitNote;
