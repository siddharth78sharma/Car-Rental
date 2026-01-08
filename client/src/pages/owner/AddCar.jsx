import React, { useState, useEffect } from 'react';
//import Title from '../../components/owner/Title';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-hot-toast';

// Self-contained mock components and assets to fix the import errors
// const assets = {
//     upload_icon: "https://placehold.co/100x100/A5B4FC/3730A3?text=Upload"
// };

// const useAppContext = () => ({
//     axios: {
//         post: async (url, data) => {
//             // Mock API response
//             await new Promise(resolve => setTimeout(resolve, 1000));
//             return { data: { success: true, message: 'Item added successfully!' } };
//         }
//     },
//     fetchItems: () => console.log('Fetching items...'),
// });

const Title = ({ title, subTitle }) => (
    <header className='mb-6 text-center'>
        <h1 className='text-3xl font-bold text-gray-800'>{title}</h1>
        <p className='text-gray-500 mt-1'>{subTitle}</p>
    </header>
);

const AddService = () => {
    const { axios, fetchItems } = useAppContext();

    const [type, setType] = useState('');
    const [formData, setFormData] = useState({});
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!image) {
            toast.error('Please upload an image.');
            return;
        }

        setLoading(true);

        const data = new FormData();
        data.append('image', image);
        data.append('itemData', JSON.stringify({ type, ...formData }));

        try {
            const response = await axios.post('/api/owner/add-item', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                toast.success(response.data.message);
             //   await fetchItems();
                setType('');
                setFormData({});
                setImage(null);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderFields = () => {
        switch (type) {
            case 'Car':
                return (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div className='flex flex-col w-full'>
                            <label className='font-medium text-gray-700'>Brand</label>
                            <input type="text" name="brand" placeholder="e.g. BMW, toyota" required value={formData.brand || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all' />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='font-medium text-gray-700'>Model</label>
                            <input type="text" name="model" placeholder="e.g. X5, S-class" required value={formData.model || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all' />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='font-medium text-gray-700'>Category</label>
                            <input type="text" name="category" placeholder="e.g. Car..." required value={formData.category || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all' />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='font-medium text-gray-700'>Seat Capacity</label>
                            <input type="number" name="seating_capacity" placeholder="e.g. 4, 7..." required value={formData.seating_capacity || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all' />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='font-medium text-gray-700'>Fuel Type</label>
                            <input type="text" name="fuel_type" placeholder="e.g. Petrol, Diesel" required value={formData.fuel_type || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all' />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='font-medium text-gray-700'>Year</label>
                            <input type="number" name="year" placeholder="e.g. 2024" required value={formData.year || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all' />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='font-medium text-gray-700'>Daily Price (₹)</label>
                            <input type="number" name="pricePerDay" placeholder="e.g. 500" required value={formData.pricePerDay || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all' />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='font-medium text-gray-700'>Location</label>
                            <input type="text" name="location" placeholder="City, State" required value={formData.location || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all' />
                        </div>
                        <div className='flex flex-col w-full md:col-span-2'>
                            <label className='font-medium text-gray-700'>Features</label>
                            <input type="text" name="features" placeholder="e.g. electric, automatic, Bluetooth..." value={formData.features || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all' />
                        </div>
                        <div className='flex flex-col w-full md:col-span-2'>
                            <label className='font-medium text-gray-700'>Description</label>
                            <textarea name="description" placeholder="Describe the Car..." required value={formData.description || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[100px]' />
                        </div>
                    </div>
                );

            case 'Bike':
                return (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div className='flex flex-col w-full'>
                            <label className='font-medium text-gray-700'>Brand</label>
                            <input type="text" name="brand" placeholder="e.g. Hero,suzuki" required value={formData.brand || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all' />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='font-medium text-gray-700'>Model</label>
                            <input type="text" name="model" placeholder="e.g. classic,R15" required value={formData.model || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all' />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='font-medium text-gray-700'>Category</label>
                            <input type="text" name="category" placeholder="e.g. Bike..." required value={formData.category || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all' />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='font-medium text-gray-700'>Seat Capacity</label>
                            <input type="number" name="seating_capacity" placeholder="e.g. 2, 1..." required value={formData.seating_capacity || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all' />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='font-medium text-gray-700'>Year</label>
                            <input type="number" name="year" placeholder="e.g. 2024" required value={formData.year || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all' />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='font-medium text-gray-700'>Daily Price (₹)</label>
                            <input type="number" name="pricePerDay" placeholder="e.g. 500" required value={formData.pricePerDay || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all' />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='font-medium text-gray-700'>Location</label>
                            <input type="text" name="location" placeholder="City, State" required value={formData.location || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all' />
                        </div>
                        <div className='flex flex-col w-full md:col-span-2'>
                            <label className='font-medium text-gray-700'>Features</label>
                            <input type="text" name="features" placeholder="e.g. electric , blutooth..." value={formData.features || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all' />
                        </div>
                        <div className='flex flex-col w-full md:col-span-2'>
                            <label className='font-medium text-gray-700'>Description</label>
                            <textarea name="description" placeholder="Describe the features..." required value={formData.description || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[100px]' />
                        </div>
                    </div>
                );

            case 'House':
                return (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div className='flex flex-col w-full'>
                            <label className='font-medium text-gray-700'>House Name</label>
                            <input type="text" name="brand" placeholder="e.g. name of Villa or house" required value={formData.brand || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all' />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='font-medium text-gray-700'>Category</label>
                            <input type="text" name="category" placeholder="e.g. house, vila..." required value={formData.category || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all' />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='font-medium text-gray-700'>Number of Rooms</label>
                            <input type="number" name="rooms" placeholder="e.g. 2,3..." required value={formData.rooms || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all' />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='font-medium text-gray-700'>Location</label>
                            <input type="text" name="location" placeholder="City, State" required value={formData.location || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all' />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='font-medium text-gray-700'>Daily Price (₹)</label>
                            <input type="number" name="pricePerDay" placeholder="e.g. 1500" required value={formData.pricePerDay || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all' />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='font-medium text-gray-700'>Features</label>
                            <input type="text" name="features" placeholder="e.g. Wi-Fi, AC, garden" value={formData.features || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all' />
                        </div>
                        <div className='flex flex-col w-full md:col-span-2'>
                            <label className='font-medium text-gray-700'>Description</label>
                            <textarea name="description" placeholder="Describe the house..." required value={formData.description || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[100px]' />
                        </div>
                    </div>
                );

            case 'Furniture':
                return (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div className='flex flex-col w-full'>
                            <label className='font-medium text-gray-700'>Brand</label>
                            <input type="text" name="brand" placeholder="e.g. IKEA..." required value={formData.brand || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all' />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='font-medium text-gray-700'>Category</label>
                            <input type="text" name="category" placeholder="e.g. table,sofa,chair..." required value={formData.category || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all' />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='font-medium text-gray-700'>Daily Price (₹)</label>
                            <input type="number" name="pricePerDay" placeholder="e.g. 400" required value={formData.pricePerDay || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all' />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='font-medium text-gray-700'>Location</label>
                            <input type="text" name="location" placeholder="City, State" required value={formData.location || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all' />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='font-medium text-gray-700'>Features</label>
                            <input type="text" name="features" placeholder="e.g. Wooden..." value={formData.features || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all' />
                        </div>
                        <div className='flex flex-col w-full md:col-span-2'>
                            <label className='font-medium text-gray-700'>Description</label>
                            <textarea name="description" placeholder="Item details..." required value={formData.description || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[100px]' />
                        </div>
                    </div>
                );

            case 'Electronics':
                return (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div className='flex flex-col w-full'>
                            <label className='font-medium text-gray-700'>Brand</label>
                            <input type="text" name="brand" placeholder="e.g. LG, Samsung..." required value={formData.brand || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all' />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='font-medium text-gray-700'>Category</label>
                            <input type="text" name="category" placeholder="e.g. home applience..." required value={formData.category || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all' />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='font-medium text-gray-700'>Daily Price (₹)</label>
                            <input type="number" name="pricePerDay" placeholder="e.g. 400" required value={formData.pricePerDay || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all' />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='font-medium text-gray-700'>Location</label>
                            <input type="text" name="location" placeholder="City, State" required value={formData.location || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all' />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='font-medium text-gray-700'>Features</label>
                            <input type="text" name="features" placeholder="e.g. item feature..." value={formData.features || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all' />
                        </div>
                        <div className='flex flex-col w-full md:col-span-2'>
                            <label className='font-medium text-gray-700'>Description</label>
                            <textarea name="description" placeholder="Item details..." required value={formData.description || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[100px]' />
                        </div>
                    </div>
                );

            case 'Instruments':
                return (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div className='flex flex-col w-full'>
                            <label className='font-medium text-gray-700'>Brand</label>
                            <input type="text" name="brand" placeholder="e.g. Gibson,Fender..." required value={formData.brand || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all' />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='font-medium text-gray-700'>Category</label>
                            <input type="text" name="category" placeholder="e.g. Gitar,Drum..." required value={formData.category || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all' />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='font-medium text-gray-700'>Daily Price (₹)</label>
                            <input type="number" name="pricePerDay" placeholder="e.g. 400" required value={formData.pricePerDay || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all' />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='font-medium text-gray-700'>Location</label>
                            <input type="text" name="location" placeholder="City, State" required value={formData.location || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all' />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label className='font-medium text-gray-700'>Features</label>
                            <input type="text" name="features" placeholder="e.g. item feature..." value={formData.features || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all' />
                        </div>
                        <div className='flex flex-col w-full md:col-span-2'>
                            <label className='font-medium text-gray-700'>Description</label>
                            <textarea name="description" placeholder="Item details..." required value={formData.description || ''} onChange={handleChange} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[100px]' />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className='min-h-screen bg-gray-100 flex items-center justify-center p-6'>
            <div className='bg-white shadow-xl rounded-2xl p-8 w-full max-w-4xl'>
                <Title title="Add New Services" subTitle="Fill in details to list a new service for booking, including pricing, availability, and specification." />
                <form onSubmit={handleSubmit} className='flex flex-col gap-6 text-gray-700 text-sm'>
                    {/* Type Selection */}
                    <div className='flex flex-col w-full'>
                        <label className='font-medium text-gray-700'>Type</label>
                        <select
                            name="type"
                            required
                            value={type}
                            onChange={(e) => {
                                setType(e.target.value);
                                setFormData({});
                            }}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
                        >
                            <option value="">Select a type</option>
                            <option value="Car">Car</option>
                            <option value="Bike">Bike</option>
                            <option value="House">House</option>
                            <option value="Furniture">Furniture</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Instruments">Instruments</option>
                        </select>
                    </div>

                    {type && (
                        <>
                            <div className='flex flex-col gap-3'>
                                <label className='font-medium text-gray-700'>Item Image</label>
                                <label htmlFor="car-image" className='flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors'>
                                    {image ? (
                                        <img src={URL.createObjectURL(image)} alt="Preview" className='h-32 w-auto object-cover rounded-lg' />
                                    ) : (
                                        <div className='flex flex-col items-center justify-center text-gray-400'>
                                            <img src={assets.upload_icon} alt="Upload Icon" className='w-16 h-16' />
                                            <p className='mt-2'>Click to upload an image</p>
                                        </div>
                                    )}
                                    <input type="file" id="car-image" accept="image/*" hidden onChange={e => setImage(e.target.files[0])} />
                                </label>
                            </div>

                            {renderFields()}

                            <button type="submit" disabled={loading} className='w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'>
                                {loading ? 'Submitting...' : `List your ${type}`}
                            </button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default AddService;











































// import React, { useState } from 'react';
// import Title from '../../components/owner/Title';
// import { assets } from '../../assets/assets';
// import { useAppContext } from '../../context/AppContext';
// import { toast } from 'react-hot-toast';

// const AddService = () => {
//   // FIX: Import the 'fetchItems' function from the context
//   const { axios, fetchItems } = useAppContext();

//   const [type, setType] = useState('');
//   const [formData, setFormData] = useState({});
//   const [image, setImage] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

// const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!image) {
//         toast.error('Please upload an image.');
//         return;
//     }

//     setLoading(true);

//     const data = new FormData();
//     data.append('image', image);
//     data.append('itemData', JSON.stringify({ type, ...formData }));

//     try {
//         const response = await axios.post('/api/owner/add-item', data, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             },
//         });

//         if (response.data.success) {
//             toast.success(response.data.message);

//             // FIX: Call the fetchItems function to refresh the global state
//             await fetchItems();

//             // Reset the form fields
//             setType('');
//             setFormData({});
//             setImage(null);
//         } else {
//             toast.error(response.data.message);
//         }
//     } catch (error) {
//         console.error(error);
//         toast.error('An error occurred. Please try again.');
//     } finally {
//         setLoading(false);
//     }
// };

//   const renderFields = () => {
//     switch (type) {
//       case 'Car':
//         return (
//           <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
//             <div className='flex flex-col w-full'>
//               <label>Brand</label>
//               <input type="text" name="brand" placeholder="e.g. BMW, toyota" required value={formData.brand || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             <div className='flex flex-col w-full'>
//               <label>Model</label>
//               <input type="text" name="model" placeholder="e.g. X5, S-class" required value={formData.model || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             <div className='flex flex-col w-full'>
//               <label>Category</label>
//               <input type="text" name="category" placeholder="e.g. Car..." required value={formData.category || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             <div className='flex flex-col w-full'>
//               <label>Seat Capacity</label>
//               <input type="number" name="seating_capacity" placeholder="e.g. 4, 7..." required value={formData.seating_capacity || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             <div className='flex flex-col w-full'>
//               <label>Fuel Type</label>
//               <input type="text" name="fuel_type" placeholder="e.g. Petrol, Diesel" required value={formData.fuel_type || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             <div className='flex flex-col w-full'>
//               <label>Year</label>
//               <input type="number" name="year" placeholder="e.g. 2024" required value={formData.year || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             <div className='flex flex-col w-full'>
//               <label>Daily Price (₹)</label>
//               <input type="number" name="pricePerDay" placeholder="e.g. 500" required value={formData.pricePerDay || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             <div className='flex flex-col w-full'>
//               <label>Location</label>
//               <input type="text" name="location" placeholder="City, State" required value={formData.location || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             <div className='flex flex-col w-full'>
//               <label>Features</label>
//               <input type="text" name="features" placeholder="e.g. electric, automatic, Bluetooth..." value={formData.features || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             <div className='flex flex-col w-full'>
//               <label>Description</label>
//               <textarea name="description" placeholder="Describe the Car..." required value={formData.description || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             <input type="hidden" name="category" value="Car" onChange={handleChange} />
//             <input type="hidden" name="rooms" value={0} onChange={handleChange} />
//           </div>
//         );

//       case 'Bike':
//         return (
//           <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
//             <div className='flex flex-col w-full'>
//               <label>Brand</label>
//               <input type="text" name="brand" placeholder="e.g. Hero,suzuki" required value={formData.brand || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             <div className='flex flex-col w-full'>
//               <label>Model</label>
//               <input type="text" name="model" placeholder="e.g. classic,R15" required value={formData.model || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             <div className='flex flex-col w-full'>
//               <label>Category</label>
//               <input type="text" name="category" placeholder="e.g. Bike..." required value={formData.category || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             <div className='flex flex-col w-full'>
//               <label>Seat Capacity</label>
//               <input type="number" name="seating_capacity" placeholder="e.g. 2, 1..." required value={formData.seating_capacity || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             <div className='flex flex-col w-full'>
//               <label>Year</label>
//               <input type="number" name="year" placeholder="e.g. 2024" required value={formData.year || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             <div className='flex flex-col w-full'>
//               <label>Daily Price (₹)</label>
//               <input type="number" name="pricePerDay" placeholder="e.g. 500" required value={formData.pricePerDay || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             <div className='flex flex-col w-full'>
//               <label>Location</label>
//               <input type="text" name="location" placeholder="City, State" required value={formData.location || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             <div className='flex flex-col w-full'>
//               <label>Features</label>
//               <input type="text" name="features" placeholder="e.g. electric , blutooth..." value={formData.features || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             <div className='flex flex-col w-full md:col-span-2'>
//               <label>Description</label>
//               <textarea name="description" placeholder="Describe the features..." required value={formData.description || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             {/* Hidden fields to satisfy schema */}
//             <input type="hidden" name="category" value="Bike" onChange={handleChange} />
//             <input type="hidden" name="fuel_type" value="Petrol" onChange={handleChange} />
//             <input type="hidden" name="rooms" value={0} onChange={handleChange} />
//           </div>
//         );

//       case 'House':
//         return (
//           <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
//             <div className='flex flex-col w-full'>
//               <label>House Name</label>
//               <input type="text" name="brand" placeholder="e.g. name of Villa or house" required value={formData.brand || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             <div className='flex flex-col w-full'>
//               <label>Category</label>
//               <input type="text" name="category" placeholder="e.g. house, vila..." required value={formData.category || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             <div className='flex flex-col w-full'>
//               <label>Number of Rooms</label>
//               <input type="number" name="rooms" placeholder="e.g. 2,3..." required value={formData.rooms || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             <div className='flex flex-col w-full'>
//               <label>Location</label>
//               <input type="text" name="location" placeholder="City, State" required value={formData.location || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             <div className='flex flex-col w-full'>
//               <label>Daily Price (₹)</label>
//               <input type="number" name="pricePerDay" placeholder="e.g. 1500" required value={formData.pricePerDay || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             <div className='flex flex-col w-full'>
//               <label>Features</label>
//               <input type="text" name="features" placeholder="e.g. Wi-Fi, AC, garden" value={formData.features || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             <div className='flex flex-col w-full md:col-span-2'>
//               <label>Description</label>
//               <textarea name="description" placeholder="Describe the house..." required value={formData.description || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             {/* Hidden fields to satisfy schema */}
//             <input type="hidden" name="brand" value="N/A" onChange={handleChange} />
//             <input type="hidden" name="model" value="N/A" onChange={handleChange} />
//             <input type="hidden" name="seating_capacity" value={0} onChange={handleChange} />
//             <input type="hidden" name="fuel_type" value="N/A" onChange={handleChange} />
//             <input type="hidden" name="year" value={new Date().getFullYear()} onChange={handleChange} />
//             <input type="hidden" name="rooms" value={0} onChange={handleChange} />
//           </div>
//         );

//       case 'Furniture':
//         return (
//           <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
//             <div className='flex flex-col w-full'>
//               <label>Brand</label>
//               <input type="text" name="brand" placeholder="e.g. IKEA..." required value={formData.brand || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             <div className='flex flex-col w-full'>
//               <label>Category</label>
//               <input type="text" name="category" placeholder="e.g. table,sofa,chair..." required value={formData.category || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             <div className='flex flex-col w-full'>
//               <label>Daily Price (₹)</label>
//               <input type="number" name="pricePerDay" placeholder="e.g. 400" required value={formData.pricePerDay || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             <div className='flex flex-col w-full'>
//               <label>Location</label>
//               <input type="text" name="location" placeholder="City, State" required value={formData.location || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             <div className='flex flex-col w-full'>
//               <label>Features</label>
//               <input type="text" name="features" placeholder="e.g. Wooden..." value={formData.features || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             <div className='flex flex-col w-full md:col-span-2'>
//               <label>Description</label>
//               <textarea name="description" placeholder="Item details..." required value={formData.description || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             {/* Hidden fields to satisfy schema */}
//             <input type="hidden" name="model" value="N/A" onChange={handleChange} />
//             <input type="hidden" name="seating_capacity" value={0} onChange={handleChange} />
//             <input type="hidden" name="fuel_type" value="N/A" onChange={handleChange} />
//             <input type="hidden" name="year" value={new Date().getFullYear()} onChange={handleChange} />
//             <input type="hidden" name="rooms" value={0} onChange={handleChange} />
//           </div>
//         );

//       case 'Electronics':
//         return (
//           <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
//             <div className='flex flex-col w-full'>
//               <label>Brand</label>
//               <input type="text" name="brand" placeholder="e.g. LG, Samsung..." required value={formData.brand || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             <div className='flex flex-col w-full'>
//               <label>Category</label>
//               <input type="text" name="category" placeholder="e.g. home applience..." required value={formData.category || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             <div className='flex flex-col w-full'>
//               <label>Daily Price (₹)</label>
//               <input type="number" name="pricePerDay" placeholder="e.g. 400" required value={formData.pricePerDay || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             <div className='flex flex-col w-full'>
//               <label>Location</label>
//               <input type="text" name="location" placeholder="City, State" required value={formData.location || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             <div className='flex flex-col w-full'>
//               <label>Features</label>
//               <input type="text" name="features" placeholder="e.g. item feature..." value={formData.features || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             <div className='flex flex-col w-full md:col-span-2'>
//               <label>Description</label>
//               <textarea name="description" placeholder="Item details..." required value={formData.description || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             {/* Hidden fields to satisfy schema */}
//             <input type="hidden" name="model" value="N/A" onChange={handleChange} />
//             <input type="hidden" name="seating_capacity" value={0} onChange={handleChange} />
//             <input type="hidden" name="fuel_type" value="N/A" onChange={handleChange} />
//             <input type="hidden" name="year" value={new Date().getFullYear()} onChange={handleChange} />
//             <input type="hidden" name="rooms" value={0} onChange={handleChange} />
//           </div>
//         );

//       case 'Instruments':
//         return (
//           <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
//             <div className='flex flex-col w-full'>
//               <label>Brand</label>
//               <input type="text" name="brand" placeholder="e.g. Gibson,Fender..." required value={formData.brand || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             <div className='flex flex-col w-full'>
//               <label>Category</label>
//               <input type="text" name="category" placeholder="e.g. Gitar,Drum..." required value={formData.category || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             <div className='flex flex-col w-full'>
//               <label>Daily Price (₹)</label>
//               <input type="number" name="pricePerDay" placeholder="e.g. 400" required value={formData.pricePerDay || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             <div className='flex flex-col w-full'>
//               <label>Location</label>
//               <input type="text" name="location" placeholder="City, State" required value={formData.location || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             <div className='flex flex-col w-full'>
//               <label>Features</label>
//               <input type="text" name="features" placeholder="e.g. item feature..." value={formData.features || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             <div className='flex flex-col w-full md:col-span-2'>
//               <label>Description</label>
//               <textarea name="description" placeholder="Item details..." required value={formData.description || ''} onChange={handleChange} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' />
//             </div>
//             {/* Hidden fields to satisfy schema */}
//             <input type="hidden" name="model" value="N/A" onChange={handleChange} />
//             <input type="hidden" name="seating_capacity" value={0} onChange={handleChange} />
//             <input type="hidden" name="fuel_type" value="N/A" onChange={handleChange} />
//             <input type="hidden" name="year" value={new Date().getFullYear()} onChange={handleChange} />
//             <input type="hidden" name="rooms" value={0} onChange={handleChange} />
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className='px-4 py-10 md:px-10 flex-1 max-w-3xl mx-auto'>
//       <Title title="Add New Services" subTitle="Fill in details to list a new service for booking, including pricing, availability, and specification." />
//       <form onSubmit={handleSubmit} className='flex flex-col gap-5 text-gray-700 text-sm mt-6'>
//         {/* Type Selection */}
//         <div className='flex flex-col w-full max-w-sm'>
//           <label>Type</label>
//           <select
//             name="type"
//             required
//             value={type}
//             onChange={(e) => {
//               setType(e.target.value);
//               setFormData({}); // reset form data on type change
//             }}
//             className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'
//           >
//             <option value="">Select a type</option>
//             <option value="Car">Car</option>
//             <option value="Bike">Bike</option>
//             <option value="House">House</option>
//             <option value="Furniture">Furniture</option>
//             <option value="Electronics">Electronics</option>
//             <option value="Instruments">Instruments</option>
//           </select>
//         </div>
//         {type && (
//           <div className='flex items-center gap-2 w-full'>
//             <label htmlFor="car-image">
//               <img src={image ? URL.createObjectURL(image) : assets.upload_icon} alt="" className='h-14 rounded cursor-pointer' />
//               <input type="file" id="car-image" accept="image/*" hidden onChange={e => setImage(e.target.files[0])} />
//             </label>
//             <p className='text-sm text-gray-500'>Upload a picture of your item</p>
//           </div>
//         )}
//         {renderFields()}
//         {type && (
//           <button type="submit" disabled={loading} className='bg-black text-white px-6 py-2 rounded-md w-fit mt-4 hover:bg-gray-800 disabled:bg-gray-400'>
//             {loading ? 'Submitting...' : `List your ${type}`}
//           </button>
//         )}
//       </form>
//     </div>
//   );
// };

// export default AddService;
