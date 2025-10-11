
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../BASE_URL';

const ReturnModal = ({ isOpen, onClose, inquiryData }) => {
  console.log(inquiryData, "inquiryData");

  // Extract actual delivered quantity, amount, and GST from PO/Invoice data
  const getActualPurchaseData = () => {
    if (!inquiryData?.inquiryData?.po_data || inquiryData.inquiryData.po_data.length === 0) {
      return { purchasedQty: 0, originalPrice: 0, qtyType: '', grandTotal: 0, gstPercentage: 0 };
    }

    // Get the latest invoice (which should have the actual delivered data)
    const latestInvoice = inquiryData.inquiryData.po_data
      .filter(po => po.invoice_type === 'tax_invoice')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

    // Fallback to PO if no invoice found
    const relevantDoc = latestInvoice || inquiryData.inquiryData.po_data[0];

    if (relevantDoc?.product_details?.length > 0) {
      const product = relevantDoc.product_details[0];

      // Extract GST percentage from the product details
      const gstPercentage = parseFloat(product.igst) || 0;

      return {
        purchasedQty: product.qty || 0,
        originalPrice: product.rate || 0,
        qtyType: product.qty_type || 'units',
        grandTotal: relevantDoc.grand_total || 0,
        taxableAmount: product.taxable_amount || 0,
        gstPercentage: gstPercentage
      };
    }

    return { purchasedQty: 0, originalPrice: 0, qtyType: '', grandTotal: 0, gstPercentage: 0 };
  };

  const actualPurchaseData = getActualPurchaseData();
  const purchasedQty = actualPurchaseData.purchasedQty;
  const originalPrice = actualPurchaseData.originalPrice;
  const qtyType = actualPurchaseData.qtyType;
  const grandTotal = actualPurchaseData.grandTotal;
  const taxableAmount = actualPurchaseData.taxableAmount;
  const gstPercentage = actualPurchaseData.gstPercentage;

  // CORRECTED: Get inquiry_id and product_id directly from props
  const inquiryId = inquiryData?.inquiryData?.inquiry_id || inquiryData?.inquiryData?._id || "";
  const productId = inquiryData?.inquiryData?.product?._id || "";

  console.log("Extracted IDs:", {
    inquiryId,
    productId,
    inquiryData: inquiryData?.inquiryData
  });

  const [returnData, setReturnData] = useState({
    // SIMPLIFIED: Only fields needed for API
    products: [{
      product_id: productId,
      qty: "", // Empty string instead of 1
    }],
    reason: "",
    total_return_amount: 0,
    total_return_qty: 0
  });

  const [isLoading, setIsLoading] = useState(false);

  // CORRECTED: Update state when props change
  useEffect(() => {
    if (productId) {
      setReturnData(prev => ({
        ...prev,
        products: [{
          ...prev.products[0],
          product_id: productId
        }]
      }));
    }
  }, [productId]);

  // Auto-calculate return amount when quantity changes
  useEffect(() => {
    const currentQty = returnData.products[0].qty;

    // Only calculate if quantity is a valid number and greater than 0
    if (currentQty && currentQty > 0 && currentQty <= purchasedQty) {
      const calculatedAmount = (currentQty * originalPrice).toFixed(2);

      setReturnData(prev => ({
        ...prev,
        total_return_amount: parseFloat(calculatedAmount),
        total_return_qty: currentQty
      }));
    } else {
      // Reset amounts if quantity is invalid
      setReturnData(prev => ({
        ...prev,
        total_return_amount: 0,
        total_return_qty: 0
      }));
    }
  }, [returnData.products[0].qty, originalPrice, purchasedQty]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReturnData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProductChange = (index, field, value) => {
    if (field === 'qty') {
      // Allow empty string for empty input
      if (value === "") {
        const updatedProducts = [...returnData.products];
        updatedProducts[index][field] = "";
        setReturnData(prev => ({ 
          ...prev, 
          products: updatedProducts,
          total_return_qty: 0,
          total_return_amount: 0
        }));
        return;
      }

      const qtyValue = Number(value);

      // Dynamic validation
      if (qtyValue > purchasedQty) {
        toast.error(`You can only return ${purchasedQty} ${qtyType}. This is the quantity that was actually delivered.`);
        return;
      }

      if (qtyValue < 1) {
        toast.error("Enter the value");
        return;
      }

      const updatedProducts = [...returnData.products];
      updatedProducts[index][field] = qtyValue;
      
      const calculatedAmount = (qtyValue * originalPrice).toFixed(2);

      setReturnData(prev => ({
        ...prev,
        products: updatedProducts,
        total_return_qty: qtyValue,
        total_return_amount: parseFloat(calculatedAmount)
      }));
    }
  };

  // API call function
  const submitReturnRequest = async (finalReturnData) => {
    try {
      setIsLoading(true);
      const token = `Bearer ${localStorage.getItem("chemicalToken")}`;
      
      // CORRECTED: Log the final payload before sending
      console.log("Final API Payload:", finalReturnData);
      
      // Validate required fields
      if (!finalReturnData.inquiry_id || finalReturnData.inquiry_id === "") {
        throw new Error("Inquiry ID is required");
      }
      
      if (!finalReturnData.products[0].product_id || finalReturnData.products[0].product_id === "") {
        throw new Error("Product ID is required");
      }

      const response = await fetch(`${BASE_URL}api/return_order/create_return_order`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(finalReturnData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Return request submitted successfully!");
        console.log("API Response:", data);
        onClose(); // Close modal on success
        
        // Reset form after successful submission
        setReturnData({
          products: [{
            product_id: productId,
            qty: "",
          }],
          reason: "",
          total_return_amount: 0,
          total_return_qty: 0
        });
      } else {
        throw new Error(data.message || "Failed to submit return request");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error(error.message || "Failed to submit return request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // CORRECTED: Validate IDs before submission
    if (!inquiryId || inquiryId === "") {
      toast.error("Invalid inquiry data. Please try again.");
      return;
    }

    if (!productId || productId === "") {
      toast.error("Invalid product data. Please try again.");
      return;
    }

    // Final validation - Check if quantity is empty or less than 1
    if (!returnData.products[0].qty || returnData.products[0].qty < 1) {
      toast.error("Enter the value");
      return;
    }

    if (returnData.products[0].qty > purchasedQty) {
      toast.error(`Error! You are trying to return ${returnData.products[0].qty} but only ${purchasedQty} were delivered.`);
      return;
    }

    if (!returnData.reason.trim()) {
      toast.error("Please provide a reason for return");
      return;
    }

    // CORRECTED: Exact payload structure as required
    const finalReturnData = {
      inquiry_id: inquiryId, // From props
      reason: returnData.reason,
      // total_return_amount: returnData.total_return_amount,
      total_return_qty: returnData.total_return_qty,
      products: [
        {
          product_id: productId, // From props
          qty: returnData.products[0].qty
        }
      ]
    };

    console.log("Final Return Data for API:", finalReturnData);

    // Submit return request to API
    await submitReturnRequest(finalReturnData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div>
            <h2 className="text-xl font-semibold">Return Request</h2>
            <p className="text-sm text-gray-600 mt-1">
              Actual Delivery: <span className="font-medium">{purchasedQty} {qtyType}</span> |
              Rate: <span className="font-medium">₹{originalPrice}/{qtyType}</span> |
              Total Paid: <span className="font-medium">₹{grandTotal}</span> |
              GST: <span className="font-medium">{gstPercentage}%</span>
            </p>
            {/* CORRECTED: Show IDs for debugging */}
            <p className="text-xs text-gray-500 mt-1">
              Inquiry ID: {inquiryId} | Product ID: {productId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Products Section */}
            <div>
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <h3 className="font-medium text-yellow-800">Return Policy</h3>
                <p className="text-sm text-yellow-700">
                  • Maximum returnable quantity: <strong>{purchasedQty} {qtyType}</strong><br />
                  • Return amount will be calculated based on actual purchase price<br />
                  {/* • <strong>Minimum 1 quantity must be returned</strong> */}
                </p>
              </div>

              {returnData.products.map((product, index) => (
                <div key={index} className="border p-3 rounded mb-2 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Quantity Input - NOW EMPTY BY DEFAULT */}
                    <div>
                      <label className="block text-xs font-medium">
                        Quantity to Return *
                      </label>
                      <input
                        type="number"
                        value={product.qty}
                        onChange={(e) => handleProductChange(index, 'qty', e.target.value)}
                        className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        min="1"
                        max={purchasedQty}
                        placeholder="Enter quantity"
                        disabled={isLoading}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Min: 1 | Max: {purchasedQty} {qtyType}
                      </p>
                    </div>

                    {/* Auto-calculated Amount */}
                    <div>
                      <label className="block text-xs font-medium">Return Amount (₹) *</label>
                      <input
                        type="number"
                        value={returnData.total_return_amount.toFixed(2)}
                        className="w-full p-2 border rounded text-sm bg-gray-100 font-medium"
                        readOnly
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {product.qty ? `${product.qty} × ₹${originalPrice} = ₹${returnData.total_return_amount.toFixed(2)}` : "Enter quantity to calculate"}
                      </p>
                    </div>

                    {/* Unit Price Display */}
                    <div>
                      <label className="block text-xs font-medium">Purchase Rate</label>
                      <div className="w-full p-2 border rounded text-sm bg-white text-center font-medium">
                        ₹{originalPrice} / {qtyType}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Detailed Return Summary - Show only when quantity is entered */}
            {returnData.products[0].qty && returnData.products[0].qty > 0 && (
              <div className="bg-blue-50 p-3 rounded border border-blue-200">
                <h3 className="font-medium text-blue-800 mb-2">Return Calculation Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Return Quantity:</div>
                  <div className="font-medium">
                    {returnData.total_return_qty} {qtyType}
                  </div>

                  <div>Unit Price:</div>
                  <div className="font-medium">₹{originalPrice}</div>

                  <div>Total Return Amount:</div>
                  <div className="font-semibold text-green-600">
                    ₹{returnData.total_return_amount.toFixed(2)}
                  </div>
                </div>
              </div>
            )}

            {/* Original Purchase Summary */}
            <div className="bg-green-50 p-3 rounded border border-green-200">
              <h3 className="font-medium text-green-800 mb-2">Original Purchase Summary</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Delivered Quantity:</div>
                <div className="font-medium">{purchasedQty} {qtyType}</div>

                <div>Remaining After Return:</div>
                <div className="font-medium">
                  {returnData.total_return_qty ? (purchasedQty - returnData.total_return_qty) : purchasedQty} {qtyType}
                </div>

                <div>Original Total Paid:</div>
                <div className="font-medium">₹{grandTotal}</div>

                <div>Refund Percentage:</div>
                <div className="font-medium">
                  {returnData.total_return_qty ? `${((returnData.total_return_qty / purchasedQty) * 100).toFixed(1)}%` : "0%"}
                </div>
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium mb-1">Reason for Return *</label>
              <textarea
                name="reason"
                value={returnData.reason}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Please specify the reason for return..."
                disabled={isLoading}
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>  
                    Submitting...
                  </>
                ) : (
                  'Submit Return Request'    
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReturnModal;