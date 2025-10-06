import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';

const VendorRegistrationForm = ({ setShowVendorForm }) => {
    const { axios, setIsOwner } = useAppContext();
    const [storeName, setStoreName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send request to the backend. The backend will validate and update the user's role.
            const { data } = await axios.post('/api/user/become-vendor', { storeName, phoneNumber });
            
            if (data.success) {
                // Only update the client-side state AFTER a successful backend response.
                setIsOwner(true); 
                setShowVendorForm(false);
                toast.success("Congratulations! You are now a vendor.");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to register as a vendor. Please try again.");
        }
    };

    return (
        <div onClick={() => setShowVendorForm(false)} className='fixed top-0 bottom-0 left-0 right-0 z-[100] flex items-center text-sm text-gray-600 bg-black/50'>
            <form onSubmit={handleFormSubmit} onClick={(e) => e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
                <h2 className="text-2xl font-medium m-auto">
                    Become a Vendor
                </h2>
                <p className="text-center text-sm w-full">Fill out the form to create your store and start listing items.</p>
                
                <div className="w-full">
                    <p>Store Name</p>
                    <input 
                        onChange={(e) => setStoreName(e.target.value)} 
                        value={storeName} 
                        placeholder="My Awesome Store" 
                        className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" 
                        type="text" 
                        required 
                    />
                </div>
                
                <div className="w-full">
                    <p>Phone Number</p>
                    <input 
                        onChange={(e) => setPhoneNumber(e.target.value)} 
                        value={phoneNumber} 
                        placeholder="e.g., 987-654-3210" 
                        className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" 
                        type="tel" 
                        required 
                    />
                </div>

                <div className='flex justify-between w-full gap-4'>
                    <button type="submit" className="bg-primary hover:bg-blue-800 transition-all text-white w-full py-2 rounded-md cursor-pointer">
                        Submit
                    </button>
                    <button type="button" onClick={() => setShowVendorForm(false)} className="bg-gray-200 hover:bg-gray-300 transition-all text-gray-700 w-full py-2 rounded-md cursor-pointer">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VendorRegistrationForm;