import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Title from '../../components/owner/Title';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const EditItem = () => {
    

    // The component uses the 'itemId' from the URL to fetch the specific item.
    const { itemId } = useParams();
    const navigate = useNavigate();
    const { axios, currency } = useAppContext();

    const [loading, setLoading] = useState(true);
    const [item, setItem] = useState({});
    const [originalItem, setOriginalItem] = useState({});

    // This list contains keys that should NOT be editable in the form.
    const excludedKeys = [
        'id',
        '_id',
        '__v',
        'createdAt',
        'updatedAt',
        'owner',
        'availableForDates',
        'isAvailable' // isAvailable is handled as a separate checkbox for better user experience
    ];

    const locations = ["Jaipur", "Delhi", "Mumbai", "Chennai", "Kolkata", "Bengaluru", "Hyderabad", "Pune"];

    // Function to fetch the specific item's data
    const fetchItem = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/owner/item/${itemId}`);
            if (data.success) {
                setItem(data.item);
                setOriginalItem(data.item);
            } else {
                toast.error(data.message);
                navigate('/owner/dashboard');
            }
        } catch (error) {
            toast.error("Failed to fetch item details. Please check server logs for details.");
            console.error(error);
            navigate('/owner/dashboard');
        } finally {
            setLoading(false);
        }
    };

    // Function to handle the form submission for updating the item
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(`/api/owner/item/${itemId}`, item);
            if (data.success) {
                toast.success(data.message);
                navigate('/owner/dashboard');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to update item.");
            console.error(error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setItem(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // The useEffect hook fetches the data when the component mounts.
    useEffect(() => {
        if (itemId) {
            fetchItem();
        }
    }, [itemId, axios, navigate]);

    if (loading) {
        return <div className='p-6 md:p-10 text-center text-gray-500'>Loading...</div>;
    }

    const itemKeys = Object.keys(item);

    return (
        <div className='p-6 md:p-10 bg-gray-50 min-h-screen font-sans'>
            <Title
                title="Edit Item"
                subTitle="Update the details for your listed item."
            />

            <div className='w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg mt-8 p-8'>
                <form onSubmit={handleUpdate} className='space-y-6'>
                    {/* Dynamically generate input fields based on item data */}
                    {itemKeys.filter(key => !excludedKeys.includes(key)).map(key => {
                        const value = item[key];
                        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

                        // Handle specific input types
                        let inputElement;
                        if (key === 'location') {
                            inputElement = (
                                <select
                                    name={key}
                                    value={value}
                                    onChange={handleChange}
                                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    required
                                >
                                    <option value="">Select a location</option>
                                    {locations.map((loc) => (
                                        <option key={loc} value={loc}>{loc}</option>
                                    ))}
                                </select>
                            );
                        } else if (key === 'description') {
                            inputElement = (
                                <textarea
                                    name={key}
                                    value={value}
                                    onChange={handleChange}
                                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    rows="4"
                                    placeholder={`Enter ${label.toLowerCase()}`}
                                    required
                                ></textarea>
                            );
                        } else if (typeof value === 'number') {
                            inputElement = (
                                <input
                                    type="number"
                                    name={key}
                                    value={value}
                                    onChange={handleChange}
                                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    placeholder={`Enter ${label.toLowerCase()}`}
                                    required
                                />
                            );
                        } else {
                            inputElement = (
                                <input
                                    type="text"
                                    name={key}
                                    value={value}
                                    onChange={handleChange}
                                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    placeholder={`Enter ${label.toLowerCase()}`}
                                    required
                                />
                            );
                        }

                        return (
                            <div key={key}>
                                <label className='block text-gray-700 font-semibold mb-2'>{label}</label>
                                {inputElement}
                            </div>
                        );
                    })}
                    
                    {/* Checkbox for availability is handled separately for clarity */}
                    <div className='flex items-center space-x-2'>
                        <input
                            type="checkbox"
                            id="isAvailable"
                            name="isAvailable"
                            checked={item.isAvailable}
                            onChange={handleChange}
                            className='h-5 w-5 text-blue-600 rounded focus:ring-blue-500'
                        />
                        <label htmlFor="isAvailable" className='text-gray-700 font-semibold'>Available for booking</label>
                    </div>

                    <button
                        type="submit"
                        className='w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md'
                    >
                        Update Item
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditItem;















// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import Title from '../../components/owner/Title';
// import { useAppContext } from '../../context/AppContext';
// import toast from 'react-hot-toast';

// const EditItem = () => {
//     // The key change is here:
//     const { itemId } = useParams();
//     const navigate = useNavigate();
//     const { axios, currency } = useAppContext();

//     const [loading, setLoading] = useState(true);
//     const [item, setItem] = useState({
//         brand: '',
//         model: '',
//         image: '',
//         description: '',
//         pricePerDay: 0,
//         location: '',
//         isAvailable: true
//     });

//     const locations = ["Jaipur", "Delhi", "Mumbai", "Chennai", "Kolkata", "Bengaluru", "Hyderabad", "Pune"];

//     // Function to fetch the specific item's data
//     const fetchItem = async () => {
//         setLoading(true);
//         try {
//             // Use the correct variable name 'itemId' here
//             const { data } = await axios.get(`/api/owner/item/${itemId}`);
//             if (data.success) {
//                 setItem(data.item);
//             } else {
//                 toast.error(data.message);
//                 navigate('/owner/dashboard');
//             }
//         } catch (error) {
//             toast.error("Failed to fetch item details. Check server logs for details.");
//             console.error(error);
//             navigate('/owner/dashboard');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Function to handle the form submission for updating the item
//     const handleUpdate = async (e) => {
//         e.preventDefault();
//         try {
//             // Corrected API call for the update request
//             const { data } = await axios.put(`/api/owner/item/${itemId}`, item);
//             if (data.success) {
//                 toast.success(data.message);
//                 navigate('/owner/dashboard');
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             toast.error("Failed to update item.");
//             console.error(error);
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setItem(prev => ({
//             ...prev,
//             [name]: type === 'checkbox' ? checked : value
//         }));
//     };

//     useEffect(() => {
//         if (itemId) {
//             fetchItem();
//         }
//     }, [itemId, axios, navigate]);

//     if (loading) {
//         return <div className='p-6 md:p-10 text-center text-gray-500'>Loading...</div>;
//     }

//     return (
//         <div className='p-6 md:p-10 bg-gray-50 min-h-screen font-sans'>
//             <Title
//                 title="Edit Item"
//                 subTitle="Update the details for your listed item."
//             />

//             <div className='w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg mt-8 p-8'>
//                 <form onSubmit={handleUpdate} className='space-y-6'>
//                     <div>
//                         <label className='block text-gray-700 font-semibold mb-2'>Brand</label>
//                         <input
//                             type="text"
//                             name="brand"
//                             value={item.brand}
//                             onChange={handleChange}
//                             className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
//                             placeholder='e.g., Toyota'
//                             required
//                         />
//                     </div>
//                     <div>
//                         <label className='block text-gray-700 font-semibold mb-2'>Model</label>
//                         <input
//                             type="text"
//                             name="model"
//                             value={item.model}
//                             onChange={handleChange}
//                             className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
//                             placeholder='e.g., Camry'
//                             required
//                         />
//                     </div>
//                     <div>
//                         <label className='block text-gray-700 font-semibold mb-2'>Image URL</label>
//                         <input
//                             type="text"
//                             name="image"
//                             value={item.image}
//                             onChange={handleChange}
//                             className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
//                             placeholder='Paste image URL here'
//                             required
//                         />
//                     </div>
//                     <div>
//                         <label className='block text-gray-700 font-semibold mb-2'>Description</label>
//                         <textarea
//                             name="description"
//                             value={item.description}
//                             onChange={handleChange}
//                             className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
//                             rows="4"
//                             placeholder='A short description of your item'
//                             required
//                         ></textarea>
//                     </div>
//                     <div>
//                         <label className='block text-gray-700 font-semibold mb-2'>Price per Day ({currency})</label>
//                         <input
//                             type="number"
//                             name="pricePerDay"
//                             value={item.pricePerDay}
//                             onChange={handleChange}
//                             className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
//                             required
//                         />
//                     </div>
//                     <div>
//                         <label className='block text-gray-700 font-semibold mb-2'>Location</label>
//                         <select
//                             name="location"
//                             value={item.location}
//                             onChange={handleChange}
//                             className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
//                             required
//                         >
//                             <option value="">Select a location</option>
//                             {locations.map((loc) => (
//                                 <option key={loc} value={loc}>{loc}</option>
//                             ))}
//                         </select>
//                     </div>
//                     <div className='flex items-center space-x-2'>
//                         <input
//                             type="checkbox"
//                             id="isAvailable"
//                             name="isAvailable"
//                             checked={item.isAvailable}
//                             onChange={handleChange}
//                             className='h-5 w-5 text-blue-600 rounded focus:ring-blue-500'
//                         />
//                         <label htmlFor="isAvailable" className='text-gray-700 font-semibold'>Available for booking</label>
//                     </div>
//                     <button
//                         type="submit"
//                         className='w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md'
//                     >
//                         Update Item
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default EditItem;