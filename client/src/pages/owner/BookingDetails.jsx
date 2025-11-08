import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import Title from "../../components/owner/Title";
import toast from "react-hot-toast";
import { assets } from "../../assets/assets";

const BookingDetail = () => {
  const { id } = useParams();
  const { axios, currency } = useAppContext();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const { data } = await axios.get(`/api/bookings/${id}`);
        if (data.success) {
          setBooking(data.booking);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Failed to fetch booking details");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [id, axios]);

  if (loading) {
    return (
      <div className="p-10 flex justify-center items-center text-gray-500">
        Loading booking details...
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="p-10 flex justify-center items-center text-red-500">
        Booking not found.
      </div>
    );
  }

  const { car, user, status, price, pickupDate, returnDate, paymentMethod, paymentStatus, address } = booking;

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen font-sans">
      <Title title="Booking Details" />

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 mt-8">
        {/* Item Details */}
        <div className="flex items-center gap-6 border-b pb-4">
          <img
            src={car?.image}
            alt="Item"
            className="w-32 h-32 rounded-xl object-cover shadow-md"
          />
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {car?.brand} {car?.model}
            </h2>
            <p className="text-gray-500 text-sm">
              Category: {car?.type || "N/A"}
            </p>
          </div>
        </div>

        {/* Booking Info */}
        <div className="mt-6 space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Booking Information
          </h3>
          <p><strong>Status:</strong> 
            <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${status === "confirmed" ? "bg-green-100 text-green-800" : status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>
              {status}
            </span>
          </p>
          <p><strong>Booking ID:</strong> {booking._id}</p>
          <p><strong>Pickup Date:</strong> {new Date(pickupDate).toLocaleDateString()}</p>
          <p><strong>Return Date:</strong> {new Date(returnDate).toLocaleDateString()}</p>
          <p><strong>Total Price:</strong> {currency}{price}</p>
        </div>

        {/* Payment Info */}
        <div className="mt-6 space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Payment Information</h3>
          <p><strong>Method:</strong> {paymentMethod === "online" ? "Online Payment" : "Cash on Delivery"}</p>
          <p><strong>Status:</strong> 
            {paymentStatus === "paid" ? (
              <span className="ml-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                Paid
              </span>
            ) : (
              <span className="ml-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                Pending
              </span>
            )}
          </p>
        </div>

        {/* User Info */}
        <div className="mt-6 space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Customer Details</h3>
          <p><strong>Name:</strong> {user?.name || "N/A"}</p>
          <p><strong>Email:</strong> {user?.email || "N/A"}</p>
          <p><strong>Phone:</strong> {user?.phone || "N/A"}</p>
          <p><strong>Address:</strong> {address || "N/A"}</p>
        </div>

        <div className="mt-8 text-right">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
