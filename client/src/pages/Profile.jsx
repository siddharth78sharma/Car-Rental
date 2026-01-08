import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import { assets } from '../assets/assets'

const Profile = () => {
  const { user } = useAppContext();
  const [image, setImage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    image: "",
  });
  const [selectedLat, setSelectedLat] = useState(null);
  const [selectedLng, setSelectedLng] = useState(null);


  const [vendorProfile, setVendorProfile] = useState({
    storeName: "",
    phoneNumber: "",
    businessType: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    description: "",
    website: "",
    gstNumber: "",
  });

  // ✅ Fetch user basic info
  const fetchUserProfile = async () => {
    try {
      const { data } = await axios.get("/api/user/profile");
      if (data.success) {
        setProfile(data.user);
      }
    } catch (error) {
      toast.error("Failed to load profile info");
    }
  };

  // ✅ Fetch vendor profile (for owner only)
  const fetchVendorProfile = async () => {
    try {
      const { data } = await axios.get("/api/user/vendor-profile");
      if (data.success) {
        setVendorProfile(data.vendorProfile || {
          storeName: "",
          phoneNumber: "",
          businessType: "",
          address: "",
          city: "",
          state: "",
          country: "",
          postalCode: "",
          description: "",
          website: "",
          gstNumber: "",
          shopCoords: {
            lat: selectedLat,
            lng: selectedLng
          }
        });
      }
    } catch (error) {
      toast.error("Failed to fetch vendor details");
    }
  };

  // ✅ Update vendor profile
const handleSaveVendorProfile = async () => {
  try {
    const payload = {
      ...vendorProfile,
      shopCoords: {
        lat: selectedLat,
        lng: selectedLng
      }
    };

    const { data } = await axios.put("/api/user/vendor-profile", payload);

    if (data.success) {
      toast.success("Vendor profile updated successfully");

      setVendorProfile(data.vendorProfile);
      setIsEditing(false);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error("Failed to update vendor profile");
  }
};


  // const handleSaveVendorProfile = async () => {
  //   try {
  //     const { data } = await axios.put("/api/user/vendor-profile", vendorProfile);
  //     if (data.success) {
  //       toast.success("Vendor profile updated successfully");
  //       //setVendorProfile(data.vendorProfile);
  //       setVendorProfile(data.vendorProfile || {
  //       storeName: "",
  //       phoneNumber: "",
  //       businessType: "",
  //       address: "",
  //       city: "",
  //       state: "",
  //       country: "",
  //       postalCode: "",
  //       description: "",
  //       website: "",
  //       gstNumber: "",
  //       shopCoords: {
  //        lat: selectedLat,
  //        lng: selectedLng
  //     }
  //     });
  //       setIsEditing(false);
  //     } else {
  //       toast.error(data.message);
  //     }
  //   } catch (error) {
  //     toast.error("Failed to update vendor profile");
  //   }
  // };

  useEffect(() => {
    fetchUserProfile();
    if (user?.role === "owner") {
      fetchVendorProfile();
    }
  }, [user]);

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-2xl pt-20">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">My Profile</h2>

      {/* ===== Basic Profile Info ===== */}
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
        {/* <img
          src={profile.image || "https://via.placeholder.com/120"}
          alt="Profile"
          className="w-28 h-28 rounded-full border border-gray-300 object-cover shadow-sm"
        /> */}
        <div className='group relative'>
                            <label htmlFor="image">
                                 <img 
                                    src={image ? URL.createObjectURL(image) : user?.image || "https://i.pravatar.cc/150?img=3"} 
                                    alt="Profile" 
                                    className='h-24 w-24 rounded-full mx-auto border-4 border-indigo-200 object-cover cursor-pointer'
                                />
                                <input 
                                    type="file" 
                                    id='image' 
                                    accept="image/*" 
                                    hidden 
                                    onChange={e => setImage(e.target.files[0])} 
                                />

                                <div className='absolute hidden top-0 right-0 left-0 bottom-0 bg-black/30 rounded-full group-hover:flex items-center justify-center cursor-pointer transition'>
                                    <img src={assets.edit_icon} alt="Edit Icon" className='h-6 w-6 filter invert' />
                                </div>
                            </label>
                        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-semibold text-gray-900">{profile.name}</h3>
          <p className="text-gray-600">{profile.email}</p>
          <p className="mt-2 text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full inline-block font-medium">
            Role: {user?.role?.toUpperCase()}
          </p>
        </div>
      </div>

      {/* ===== Vendor Details Section (Owner Only) ===== */}
      {user?.role === "owner" && (
        <div className="mt-10 border-t border-gray-200 pt-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-gray-800">Vendor Details</h3>

            {isEditing ? (
              <div className="space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveVendorProfile}
                  className="px-4 py-2 text-sm rounded-lg text-white bg-green-600 hover:bg-green-700 transition"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-sm rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition"
              >
                Edit
              </button>
            )}
          </div>

          {/* ===== Vendor Info Fields ===== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { label: "Store Name", field: "storeName" },
              { label: "Phone Number", field: "phoneNumber" },
              { label: "Business Type", field: "businessType" },
              { label: "Website", field: "website" },
              { label: "GST Number", field: "gstNumber" },
              { label: "Address", field: "address" },
              { label: "City", field: "city" },
              { label: "State", field: "state" },
              { label: "Country", field: "country" },
              { label: "Postal Code", field: "postalCode" },
            ].map(({ label, field }) => (
              <div key={field}>
                <label className="block text-gray-700 font-medium mb-1">{label}:</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    value={vendorProfile[field] || ""}
                    onChange={(e) =>
                      setVendorProfile({ ...vendorProfile, [field]: e.target.value })
                    }
                  />
                ) : (
                  <p className="text-gray-800">
                    {vendorProfile[field] || <span className="text-gray-400">Not provided</span>}
                  </p>
                )}
              </div>
            ))}

            {/* Description Field (Full Width) */}
            <div className="sm:col-span-2">
              <label className="block text-gray-700 font-medium mb-1">Description:</label>
              {isEditing ? (
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none h-24"
                  value={vendorProfile.description || ""}
                  onChange={(e) =>
                    setVendorProfile({ ...vendorProfile, description: e.target.value })
                  }
                />
              ) : (
                <p className="text-gray-800">
                  {vendorProfile.description || (
                    <span className="text-gray-400">No description added</span>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;















// import React, { useEffect, useState } from 'react';
// import { useAppContext } from '../context/AppContext';
// import toast from 'react-hot-toast';
// import { Link } from 'react-router-dom';
// import { assets } from '../assets/assets'; // Assuming 'assets' is available


// const Profile = () => {
//     //const { toast, ToastComponent } = useToast();
//     // Use the local mock context
//     const { axios, isAdmin, isOwner, fetchUser } = useAppContext(toast); 
    
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [image, setImage] = useState('');
    
//     // State for local editing
//     const [isEditing, setIsEditing] = useState(false);
//     const [editableStoreName, setEditableStoreName] = useState('');
//     const [editablePhoneNumber, setEditablePhoneNumber] = useState('');
//     const [editableLocation, setEditableLocation] = useState('');


//     const updateImage = async () => {
//         if (!image) return;

//         try {
//             setLoading(true);
//             const fromData = new FormData();
//             fromData.append('image', image.name); // Mocking file upload

//             const { data } = await axios.post('/api/owner/update-image', fromData);

//             if (data.success) {
//                 if (fetchUser) fetchUser(); 
//                 setImage('');
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             toast.error("Failed to update image.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const getDashboardPath = () => {
//         if (isAdmin) return '#/admin';
//         if (isOwner) return '#/owner';
//         return '#/';
//     };

//     const fetchUserData = async () => {
//         try {
//             const response = await axios.get('/api/user/profile');
//             if (response.data.success) {
//                 setUser(response.data.user);
//             } else {
//                 toast.error(response.data.message || "Failed to fetch user data.");
//             }
//         } catch (error) {
//             toast.error("Failed to fetch user data.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     /**
//      * Handles saving updated vendor details.
//      * This function now correctly updates the main 'user' state 
//      * which controls all displayed non-input fields.
//      */
//     const handleSaveDetails = async () => {
//         try {
//             setLoading(true);
//             const updateData = {
//                 storeName: editableStoreName,
//                 phoneNumber: editablePhoneNumber,
//                 location: editableLocation,
//             };

//             const response = await axios.put('/api/owner/update-profile-details', updateData);

//             if (response.data.success) {
//                 // CRITICAL FIX: Update local state with fresh data from mock/API
//                 setUser(response.data.user); 
                
//                 // Update global state if necessary (mocked)
//                 if (fetchUser) fetchUser(); 
                
//                 setIsEditing(false); // Exit edit mode
//             } else {
//                 toast.error(response.data.message || "Failed to save details.");
//             }
//         } catch (error) {
//             console.error("Update Error:", error);
//             // Enhanced error handling for mock environment
//             const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred during save.";
//             toast.error(errorMessage);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchUserData();
//     }, []); 

//     // Initialize editable state when user data is fetched
//     useEffect(() => {
//         if (user) {
//             // Use nullish coalescing to ensure empty strings instead of null/undefined
//             setEditableStoreName(user.storeName ?? '');
//             setEditablePhoneNumber(user.phoneNumber ?? '');
//             setEditableLocation(user.location ?? '');
//         }
//     }, [user]);

//     if (loading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//                 <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
//                 <div className="ml-3 text-lg text-gray-700">Loading profile...</div>
//             </div>
//         );
//     }

//     if (!user) {
//         return <div className="p-8 text-center text-red-500 bg-white rounded-xl shadow-lg m-4">User not found. Please log in.</div>;
//     }

//     // Destructuring vendor-specific fields from the current state (these drive the display when not editing)
//     const { 
//         name, 
//         email, 
//         role, 
//         isVerified, 
//         storeName, 
//         phoneNumber, 
//         location
//     } = user;

//     return (
//         <div className="min-h-screen bg-gray-50 font-sans p-4 sm:p-6 lg:p-8">
//             {/* <ToastComponent /> Renders the temporary notification */}
//             <div className="flex flex-col items-center max-w-2xl mx-auto">
//                 <h1 className="text-3xl font-extrabold text-gray-800 mb-8 mt-4">User Profile</h1>
                
//                 <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full border border-gray-100">
//                     <div className="flex flex-col items-center relative mb-6">
                        
//                        <div className='group relative'>
//                             <label htmlFor="image">
//                                 <img 
//                                     src={image ? URL.createObjectURL(image) : user?.image || "https://i.pravatar.cc/150?img=3"} 
//                                     alt="Profile" 
//                                     className='h-24 w-24 rounded-full mx-auto border-4 border-indigo-200 object-cover cursor-pointer'
//                                 />
//                                 <input 
//                                     type="file" 
//                                     id='image' 
//                                     accept="image/*" 
//                                     hidden 
//                                     onChange={e => setImage(e.target.files[0])} 
//                                 />

//                                 <div className='absolute hidden top-0 right-0 left-0 bottom-0 bg-black/30 rounded-full group-hover:flex items-center justify-center cursor-pointer transition'>
//                                     <img src={assets.edit_icon} alt="Edit Icon" className='h-6 w-6 filter invert' />
//                                 </div>
//                             </label>
//                         </div>
                        
//                         {image && (
//                            <div className='absolute -top-4 right-0 flex space-x-2 p-2'>
//                                 <button className='flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-green-500 text-white hover:bg-green-600 transition shadow-md' onClick={updateImage} disabled={loading}>
//                                     {loading ? 'Saving...' : 'Save Image'} 
//                                     <img src={assets.check_icon} width={13} alt="Save" className="filter invert h-3 w-3" />
//                                 </button>
//                                 <button 
//                                     className='px-3 py-1 text-xs font-medium rounded-full bg-gray-300 text-gray-800 hover:bg-gray-400 transition shadow-md' 
//                                     onClick={() => setImage('')} 
//                                     disabled={loading}>
//                                     Cancel
//                                 </button>
//                            </div>
//                         )}

//                         <h2 className="text-2xl font-bold mt-4 text-gray-900">{name}</h2>
//                         <p className="text-gray-500">{email}</p>
//                         <p className="text-sm font-medium mt-2">
//                             Role: 
//                             <span className={`ml-1 px-3 py-1 rounded-full text-xs font-semibold
//                                 ${role === 'admin' ? 'bg-indigo-100 text-indigo-800' :
//                                 role === 'owner' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
//                                 {role}
//                             </span>
//                         </p>
//                     </div>

//                     <div className="border-t border-gray-200 pt-6">
//                         <h3 className="text-xl font-semibold text-gray-800 mb-4">Account Information</h3>
//                         <div className="space-y-4">
//                             <div className="flex items-start">
//                                 <strong className="w-1/3 text-gray-600">Full Name:</strong>
//                                 <span className="w-2/3 text-gray-900">{name}</span>
//                             </div>
//                             <div className="flex items-start">
//                                 <strong className="w-1/3 text-gray-600">Email:</strong>
//                                 <span className="w-2/3 text-gray-900">{email}</span>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Conditional rendering for vendors */}
//                     {user.role === 'owner' && (
//                         <div className="mt-8 border-t border-gray-200 pt-6">
//                             <div className="flex justify-between items-center mb-4">
//                                 <h3 className="text-xl font-semibold text-gray-800">Vendor Details</h3>
//                                 {/* Edit/Save/Cancel Button */}
//                                 {isEditing ? (
//                                     <div className="space-x-2">
//                                         {/* FIX: Properly reset editable state on Cancel */}
//                                         <button
//                                             onClick={() => {
//                                                 setIsEditing(false);
//                                                 // Reset local editable state to current user data
//                                                 setEditableStoreName(storeName ?? '');
//                                                 setEditablePhoneNumber(phoneNumber ?? '');
//                                                 setEditableLocation(location ?? '');
//                                             }}
//                                             className="px-3 py-1 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition shadow-md"
//                                             disabled={loading}
//                                         >
//                                             Cancel
//                                         </button>
//                                         <button
//                                             onClick={handleSaveDetails}
//                                             className="px-3 py-1 text-sm rounded-md text-white bg-green-600 hover:bg-green-700 transition shadow-md"
//                                             disabled={loading}
//                                         >
//                                             {loading ? 'Saving...' : 'Save Changes'}
//                                         </button>
//                                     </div>
//                                 ) : (
//                                     <button
//                                        // onClick={() => setIsEditing(true)}
//                                        // className="px-3 py-1 text-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-md"
//                                        // disabled={loading}
//                                     >
//                                         {/* Edit Details */}
//                                     </button>
//                                 )}
//                             </div>
                            
//                             <div className="space-y-4">
//                                 <div className="flex items-start">
//                                     <strong className="w-1/3 text-gray-600 pt-1">Verification Status:</strong>
//                                     {/* STATUS IS CORRECTLY READ FROM THE UPDATED 'user' state */}
//                                     <span className={`w-2/3 px-3 py-1 rounded-full text-xs font-semibold
//                                         ${isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                                         {isVerified ? 'Verified' : 'Unverified'}
//                                     </span>
//                                 </div>
                                
//                                 {/* Conditional field for Store Name */}
//                                 {/* <div className="flex items-start">
//                                     <strong className="w-1/3 text-gray-600 pt-1">Store Name:</strong>
//                                     {isEditing ? (
//                                         <input
//                                             type="text"
//                                             className="w-2/3 border border-gray-300 rounded-lg p-1.5 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
//                                             value={editableStoreName}
//                                             onChange={(e) => setEditableStoreName(e.target.value)}
//                                             placeholder="Enter store name"
//                                         />
//                                     ) : (
//                                         <span className="w-2/3 text-gray-900 pt-1">{storeName || 'Not provided - Click Edit to add'}</span>
//                                     )}
//                                 </div> */}
                                
//                                 {/* Conditional field for Phone Number */}
//                                 {/* <div className="flex items-start">
//                                     <strong className="w-1/3 text-gray-600 pt-1">Phone Number:</strong>
//                                     {isEditing ? (
//                                         <input
//                                             type="tel"
//                                             className="w-2/3 border border-gray-300 rounded-lg p-1.5 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
//                                             value={editablePhoneNumber}
//                                             onChange={(e) => setEditablePhoneNumber(e.target.value)}
//                                             placeholder="Enter phone number"
//                                         />
//                                     ) : (
//                                         <span className="w-2/3 text-gray-900 pt-1">{phoneNumber || 'Not provided - Click Edit to add'}</span>
//                                     )}
//                                 </div> */}
                                
//                                 {/* Conditional field for Location */}
//                                 {/* <div className="flex items-start">
//                                     <strong className="w-1/3 text-gray-600 pt-1">Location:</strong>
//                                     {isEditing ? (
//                                         <input
//                                             type="text"
//                                             className="w-2/3 border border-gray-300 rounded-lg p-1.5 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
//                                             value={editableLocation}
//                                             onChange={(e) => setEditableLocation(e.target.value)}
//                                             placeholder="Enter location"
//                                         />
//                                     ) : (
//                                         <span className="w-2/3 text-gray-900 pt-1">{location || 'Not provided - Click Edit to add'}</span>
//                                     )}
//                                 </div> */}
//                             </div>
//                             <div className="mt-6 flex justify-end">
//                                 <a 
//                                     href={getDashboardPath()} // Replaced <Link> with <a> tag
//                                     className="px-6 py-3 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
//                                 >
//                                     Go to Vendor Dashboard
//                                 </a>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Profile;