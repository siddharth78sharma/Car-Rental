import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { assets } from "../assets/assets"; // ✅ make sure this path is correct

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    try {
      const { data } = await axios.post(`/api/user/reset-password/${token}`, { newPassword });
      if (data.success) {
        toast.success("Password reset successful!");
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Error resetting password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>

        {/* New Password */}
        <div className="relative mb-3">
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="New Password"
            className="border p-3 w-full rounded pr-10"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <span
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
          >
            <img
              src={showNewPassword ? assets.eye_icon : assets.eye_close_icon}
              alt="Toggle"
              className="w-5 h-5"
            />
          </span>
        </div>

        {/* Confirm Password */}
        <div className="relative mb-4">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className="border p-3 w-full rounded pr-10"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
          >
            <img
              src={showConfirmPassword ? assets.eye_icon : assets.eye_close_icon}
              alt="Toggle"
              className="w-5 h-5"
            />
          </span>
        </div>

        <button type="submit" className="w-full bg-primary text-white py-2 rounded font-semibold">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;