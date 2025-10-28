import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const BookingDetails = () => {
    const { itemId } = useParams(); // Get item ID from URL
    const location = useLocation();
    const navigate = useNavigate();
    const { axios, currency, fetchItems } = useAppContext(); 

    // Destructure dates from state (Note: startDate/endDate are already available)
    const {  pickupDate: startDate, returnDate: endDate } = location.state || {}; 

    const [item, setItem] = useState(null);
    const [summary, setSummary] = useState(null); // ⭐ NEW STATE for booking summary
    const [loading, setLoading] = useState(true);
    const [isBooking, setIsBooking] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');

    // 1. Fetch Item Details AND Booking Summary
    useEffect(() => {
        // Ensure dates are present before proceeding
        if (!startDate || !endDate) {
            toast.error("Booking dates are missing. Going back.");
            navigate(-1); // Go back if essential data is missing
            return;
        }

        const fetchBookingSummary = async () => {
            setLoading(true);
            try {
                // ⭐ A. CALL THE NEW /summary API to get price and final validation ⭐
                const response = await axios.post(`/api/bookings/summary`, {
                    car: itemId, // Pass car ID as required by the backend controller
                    pickupDate: startDate,
                    returnDate: endDate
                }); 

                if (response.data.success) {
                    setSummary(response.data.summary);
                    // The Item data is nested inside the summary response, so we set it here
                    setItem(response.data.summary.car); 
                } else {
                    toast.error(response.data.message || "Item is not available for these dates.");
                    navigate(-1); // Go back if validation fails
                }
            } catch (error) {
                console.error(error);
                toast.error("Error fetching booking summary. Check API route/server.");
            } finally {
                setLoading(false);
            }
        };

        fetchBookingSummary();
    }, [itemId, startDate, endDate, axios, navigate]); // Depend on dates and ID

   
   
    const loadRazorpay = () => {
    return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};



const handleConfirmBooking = async () => {
  if (!summary || !item || !startDate || !endDate) {
    toast.error("Missing booking data.");
    return;
  }

  if (paymentMethod === "cash") {
    // Cash booking → skip Razorpay
    try {
      setIsBooking(true);
      const bookingData = {
        car: itemId,
        pickupDate: startDate,
        returnDate: endDate,
        paymentMethod: "cash",
      };
      const res = await axios.post("/api/bookings/create", bookingData);
      if (res.data.success) {
        toast.success("Booking confirmed successfully!");
        navigate("/my-bookings");
      } else {
        toast.error(res.data.message || "Booking failed.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred.");
    } finally {
      setIsBooking(false);
    }
    return;
  }

  // 🔹 Razorpay flow
  setIsBooking(true);
  const loaded = await loadRazorpay();
  if (!loaded) {
    toast.error("Razorpay SDK failed to load.");
    setIsBooking(false);
    return;
  }

  try {
    // 1️⃣ Create order on backend
    const orderRes = await axios.post("/api/payment/create-order", {
      amount: summary.totalPrice, // Amount in rupees
    });

    const { order } = orderRes.data;
    if (!order) throw new Error("Order not created");

    // 2️⃣ Open Razorpay checkout
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Frontend key
      amount: order.amount,
      currency: "INR",
      name: "Car Rental Service",
      description: "Booking Payment",
      order_id: order.id,
      handler: async function (response) {
        // 3️⃣ Verify payment on backend
        const verifyRes = await axios.post("/api/payment/verify-payment", response);

        if (verifyRes.data.success) {
          // 4️⃣ Create booking after successful payment
          const bookingData = {
            car: itemId,
            pickupDate: startDate,
            returnDate: endDate,
            paymentMethod: "razorpay",
          };
          const bookingRes = await axios.post("/api/bookings/create", bookingData);

          if (bookingRes.data.success) {
            toast.success("Payment successful & Booking confirmed!");
            navigate("/my-bookings");
          } else {
            toast.error(bookingRes.data.message || "Booking creation failed.");
          }
        } else {
          toast.error("Payment verification failed.");
        }
      },
      theme: { color: "#2563eb" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error(error);
    toast.error("Payment initialization failed.");
  } finally {
    setIsBooking(false);
  }
};


    // 2. Handle Final Booking Submission
    // const handleConfirmBooking = async () => {
    //     // Ensure all data and summary are present
    //     if (!summary || !item || !startDate || !endDate) {
    //         toast.error("Missing booking data.");
    //         return;
    //     }

    //     setIsBooking(true);
    //     try {
    //         const bookingData = {
    //             car: itemId, // Use 'car' to match the backend schema
    //             pickupDate: startDate,
    //             returnDate: endDate,
    //             paymentMethod, 
    //             // We DON'T send the price, as the backend calculates it for security
    //         };

    //         const response = await axios.post('/api/bookings/create', bookingData); 

    //         if (response.data.success) {
    //             toast.success("Booking confirmed successfully!");
    //             if(fetchItems) fetchItems(); 
    //             navigate('/my-bookings'); 
    //         } else {
    //             toast.error(response.data.message || "Booking failed.");
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         toast.error("An error occurred during booking.");
    //     } finally {
    //         setIsBooking(false);
    //     }
    // };
    
    // // ⭐ REMOVED: calculateTotalPrice is no longer needed; it's done by the backend's /summary API.

    //  if (loading) {
    //      return <div className="text-center py-10">Loading booking summary...</div>;
    //  }

    //  if (!item || !summary) {
    //      return <div className="text-center py-10 text-red-500">Could not retrieve booking details or item summary.</div>;
    //  }
    
    // // Destructure summary data
    // const { totalPrice } = summary;
    //  const { totalPrice = 0 } = summary || {};

    
    // // Helper function for date formatting
    // const formatDate = (dateString) => {
    //     if (!dateString) return 'Select Date';
    //     // Ensure the date object is created correctly for locale formatting
    //     return new Date(dateString).toLocaleDateString('en-US', {
    //         year: 'numeric',
    //         month: 'short',
    //         day: 'numeric'
    //     });
    // };


    // ✅ Prevent early rendering
if (loading) {
  return <div className="text-center py-10">Loading booking summary...</div>;
}

if (!item || !summary) {
  return (
    <div className="text-center py-10 text-red-500">
      Could not retrieve booking details or item summary.
    </div>
  );
}

// ✅ Safe access for total price
const totalPrice = summary?.totalPrice || 0;

// ✅ Date formatting helper
const formatDate = (dateString) => {
  if (!dateString) return 'Select Date';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};


    return (
        <div className="max-w-4xl mx-auto my-12 p-6 bg-white shadow-xl rounded-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Confirm Your Booking</h1>
            
            <div className="grid md:grid-cols-2 gap-8">
                {/* Left Side: Item Details and Summary */}
                <div>
                    <h2 className="text-xl font-semibold mb-3">Item Details</h2>
                    <div className="p-4 border rounded-lg bg-gray-50">
                        <img src={item?.image || 'default-url'} alt={item?.model} className="w-full h-48 object-cover rounded-lg mb-3"/>

                        <p className="text-xl font-bold text-blue-600">{item?.brand} - {item?.model}</p>
                        <p className="text-gray-500 mb-4">{item?.type} | {item?.year}</p>
                        
                        <div className='mt-2 space-y-2'>
                            <p className='flex justify-between'>
                                <span className='font-medium'>Start Date:</span> 
                                {/* ⭐ FIXED: Displaying the formatted startDate ⭐ */}
                                <span>{formatDate(startDate)}</span>
                            </p>
                            <p className='flex justify-between'>
                                <span className='font-medium'>End Date:</span> 
                                {/* ⭐ FIXED: Displaying the formatted endDate ⭐ */}
                                <span>{formatDate(endDate)}</span>
                            </p>
                            <p className='flex justify-between text-lg font-bold pt-2 border-t border-gray-200'>
                                <span className='text-gray-700'>Total Price:</span> 
                                {/* ⭐ FIXED: Displaying price from the summary API ⭐ */}
                                <span className='text-green-600'>{currency}{totalPrice.toFixed(2)}</span> 
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Payment and Action */}
                <div>
                    <h2 className="text-xl font-semibold mb-3">Payment Method</h2>
                    
                    <div className="space-y-4 mb-6">
                        <label className="flex items-center p-3 border rounded-lg cursor-pointer transition hover:bg-blue-50">
                            <input
                                type="radio"
                                name="payment"
                                value="card"
                                checked={paymentMethod === 'card'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-3 font-medium text-gray-700">Credit/Debit Card</span>
                        </label>
                        <label className="flex items-center p-3 border rounded-lg cursor-pointer transition hover:bg-blue-50">
                            <input
                                type="radio"
                                name="payment"
                                value="cash" // Changed from 'paypal' to 'cash' to match your UI 'Cash On'
                                checked={paymentMethod === 'cash'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-3 font-medium text-gray-700">Cash On</span>
                        </label>
                    </div>

                    <p className="text-sm text-gray-500 mb-6">
                        By clicking "Confirm Booking," you agree to our terms and conditions and authorize the payment of {currency}{totalPrice.toFixed(2)}.
                    </p>

                    <button
                        onClick={handleConfirmBooking}
                        // Button is disabled only when loading or booking is in process
                        disabled={isBooking || loading} 
                        className="w-full px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 transition"
                    >
                        {isBooking ? 'Processing...' : 'Confirm Booking'}
                    </button>
                    
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full mt-3 px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg shadow-md hover:bg-gray-300 transition"
                    >
                        Cancel and Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingDetails;