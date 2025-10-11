import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../BASE_URL";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const transactionId = searchParams.get("txnid");
  
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState(null);
console.log();

  useEffect(() => {
    if (transactionId) {
      // You can fetch additional payment details here if needed
      setLoading(false);
    }
  }, [transactionId]);


  if (!loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <img
          src="https://chembizzstorage.blob.core.windows.net/chembizz-files/loader1.gif"
          alt="Loading..."
          className="w-20 h-20"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-xl p-8 max-w-md w-full text-center">
        <div className="text-green-500 text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Successful!
        </h2>
        <p className="text-gray-600 mb-4">
          Thank you for your payment. Your transaction was completed successfully.
        </p>
        
        {transactionId && (
          <div className="bg-gray-50 p-3 rounded-lg mb-6">
            <p className="text-sm text-gray-600">Transaction ID</p>
            <p className="text-sm font-medium text-gray-800">{transactionId}</p>
          </div>
        )}
        
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/company/home")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate("/company/packages")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-all"
          >
            View Packages
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;