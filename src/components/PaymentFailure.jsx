import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const PaymentFailure = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const transactionId = searchParams.get("txnid");
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
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
        <div className="text-red-500 text-5xl mb-4">❌</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Failed
        </h2>
        <p className="text-gray-600 mb-4">
          We're sorry, but your payment could not be processed. Please try again or contact support if the issue persists.
        </p>
        
        {transactionId && (
          <div className="bg-gray-50 p-3 rounded-lg mb-6">
            <p className="text-sm text-gray-600">Reference ID</p>
            <p className="text-sm font-medium text-gray-800">{transactionId}</p>
            <p className="text-xs text-gray-500 mt-1">
              Please provide this ID when contacting support
            </p>
          </div>
        )}
        
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/company/packages")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate("/company/home")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-all"
          >
            Go to Home
          </button>
          <button
            onClick={() => navigate("/company/support")}
            className="text-blue-600 hover:text-blue-700 font-medium py-2 px-6 transition-all"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;