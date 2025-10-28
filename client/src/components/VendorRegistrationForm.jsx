import React, { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const VendorRegistrationForm = ({ setShowVendorForm }) => {
  const { axios, setIsOwner } = useAppContext();

  const [formData, setFormData] = useState({
    storeName: "",
    ownerName: "",
    email: "",
    phoneNumber: "",
    businessType: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/user/become-vendor", formData);

      if (data.success) {
        setIsOwner(true);
        toast.success("🎉 You are now registered as a Vendor!");
        setShowVendorForm(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to register. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex justify-center items-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-2xl rounded-2xl p-8 md:p-12 w-full max-w-lg"
      >
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-3">
          Become a Vendor
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Fill out the form to register your business and start listing your
          services.
        </p>

        <form onSubmit={handleFormSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-600 font-medium">Store Name</label>
              <input
                type="text"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                placeholder="My Awesome Store"
                className="border border-gray-300 rounded-lg w-full p-2 mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            </div>

            <div>
              <label className="text-gray-600 font-medium">Owner Name</label>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                placeholder="John Doe"
                className="border border-gray-300 rounded-lg w-full p-2 mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-600 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                className="border border-gray-300 rounded-lg w-full p-2 mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            </div>

            <div>
              <label className="text-gray-600 font-medium">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="9876543210"
                className="border border-gray-300 rounded-lg w-full p-2 mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-gray-600 font-medium">Business Type</label>
            <select
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg w-full p-2 mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
              required
            >
              <option value="">Select Type</option>
              <option value="Car Rental">Car Rental</option>
              <option value="Bike Rental">Bike Rental</option>
              <option value="Villa">Villa</option>
              <option value="Furniture">Furniture</option>
              <option value="Electronics">Electronics</option>
              <option value="Instruments">Instruments</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div>
            <label className="text-gray-600 font-medium">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Main Street"
              className="border border-gray-300 rounded-lg w-full p-2 mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-gray-600 font-medium">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Delhi"
                className="border border-gray-300 rounded-lg w-full p-2 mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
            <div>
              <label className="text-gray-600 font-medium">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Uttar Pradesh"
                className="border border-gray-300 rounded-lg w-full p-2 mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
            <div>
              <label className="text-gray-600 font-medium">Zip Code</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                placeholder="110001"
                className="border border-gray-300 rounded-lg w-full p-2 mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-600 font-medium">Business Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your services..."
              rows="3"
              className="border border-gray-300 rounded-lg w-full p-2 mt-1 focus:ring-2 focus:ring-blue-400 outline-none resize-none"
            ></textarea>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 transition-all text-white font-semibold rounded-lg shadow-md"
          >
            Submit Registration
          </motion.button>

          <button
            type="button"
            onClick={() => setShowVendorForm(false)}
            className="w-full py-2 bg-gray-200 hover:bg-gray-300 transition-all text-gray-700 font-medium rounded-lg"
          >
            Cancel
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default VendorRegistrationForm;















// import React, { useState } from 'react';
// import toast from 'react-hot-toast';
// import { useAppContext } from '../context/AppContext';

// const VendorRegistrationForm = ({ setShowVendorForm }) => {
//     const { axios, setIsOwner } = useAppContext();
//     const [storeName, setStoreName] = useState("");
//     const [phoneNumber, setPhoneNumber] = useState("");

//     const handleFormSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             // Send request to the backend. The backend will validate and update the user's role.
//             const { data } = await axios.post('/api/user/become-vendor', { storeName, phoneNumber });
            
//             if (data.success) {
//                 // Only update the client-side state AFTER a successful backend response.
//                 setIsOwner(true); 
//                 setShowVendorForm(false);
//                 toast.success("Congratulations! You are now a vendor.");
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             toast.error("Failed to register as a vendor. Please try again.");
//         }
//     };

//     return (
//         <div onClick={() => setShowVendorForm(false)} className='fixed top-0 bottom-0 left-0 right-0 z-[100] flex items-center text-sm text-gray-600 bg-black/50'>
//             <form onSubmit={handleFormSubmit} onClick={(e) => e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
//                 <h2 className="text-2xl font-medium m-auto">
//                     Become a Vendor
//                 </h2>
//                 <p className="text-center text-sm w-full">Fill out the form to create your store and start listing items.</p>
                
//                 <div className="w-full">
//                     <p>Store Name</p>
//                     <input 
//                         onChange={(e) => setStoreName(e.target.value)} 
//                         value={storeName} 
//                         placeholder="My Awesome Store" 
//                         className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" 
//                         type="text" 
//                         required 
//                     />
//                 </div>
                
//                 <div className="w-full">
//                     <p>Phone Number</p>
//                     <input 
//                         onChange={(e) => setPhoneNumber(e.target.value)} 
//                         value={phoneNumber} 
//                         placeholder="e.g., 987-654-3210" 
//                         className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" 
//                         type="tel" 
//                         required 
//                     />
//                 </div>

//                 <div className='flex justify-between w-full gap-4'>
//                     <button type="submit" className="bg-primary hover:bg-blue-800 transition-all text-white w-full py-2 rounded-md cursor-pointer">
//                         Submit
//                     </button>
//                     <button type="button" onClick={() => setShowVendorForm(false)} className="bg-gray-200 hover:bg-gray-300 transition-all text-gray-700 w-full py-2 rounded-md cursor-pointer">
//                         Cancel
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default VendorRegistrationForm;