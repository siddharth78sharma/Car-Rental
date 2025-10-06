import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { assets } from '../../assets/assets';
import Loader from '../../components/Loader';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const ViewItem = () => {
    const { itemId } = useParams();
    const { axios } = useAppContext();
    const navigate = useNavigate();
    const [itemData, setItemData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await axios.get(`/api/owner/item/${itemId}`);
                if (response.data.success) {
                    setItemData(response.data.item);
                } else {
                    toast.error(response.data.message);
                    navigate('/owner/manage-items');
                }
            } catch (error) {
                toast.error("Failed to fetch item details.");
                navigate('/owner/manage-items');
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [itemId, axios, navigate]);

    // Helper function to get details based on item type
    const getItemDetails = (item) => {
        switch (item.type) {
            case 'Car':
                return [
                    { icon: assets.users_icon, text: item.seating_capacity ? `${item.seating_capacity} Seats` : '' },
                    { icon: assets.fuel_icon, text: item.fuel_type || '' },
                    { icon: assets.car_icon, text: item.transmission || '' },
                    { icon: assets.location_icon, text: item.location || '' },
                ];
            case 'Bike':
                return [
                    { icon: assets.fuel_icon, text: item.fuel_type || '' },
                    { icon: assets.users_icon, text: item.seating_capacity ? `${item.seating_capacity} Seats` : '' },
                    { icon: assets.location_icon, text: item.location || '' },
                ];
            case 'House':
                return [
                    { icon: assets.rooms_icon, text: item.rooms ? `${item.rooms} Rooms` : '' },
                    { icon: assets.build_icon, text: item.year ? `Built in ${item.year}` : '' },
                    { icon: assets.location_icon, text: item.location || '' },
                ];
            case 'Furniture':
                return [
                    { icon: assets.furniture_icon, text: item.category || '' },
                    { icon: assets.build_icon, text: item.features || '' },
                    { icon: assets.location_icon, text: item.location || '' },
                ];
            case 'Electronics':
                return [
                    { icon: assets.electronics_icon, text: item.category || '' },
                    { icon: assets.build_icon, text: item.features || '' },
                    { icon: assets.location_icon, text: item.location || '' },
                ];
            case 'Instruments':
                return [
                    { icon: assets.instrument_icon, text: item.category || '' },
                    { icon: assets.build_icon, text: item.features || '' },
                    { icon: assets.location_icon, text: item.location || '' },
                ];
            default:
                return [];
        }
    };

    const detailsToDisplay = itemData ? getItemDetails(itemData) : [];
    const filteredDetails = detailsToDisplay.filter(detail => detail.text);

    if (loading) {
        return <Loader />;
    }

    if (!itemData) {
        return <div>Item not found.</div>;
    }

    return (
        <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16'>
            <button onClick={() => navigate(-1)} className='flex items-center gap-2 mb-6 text-gray-500 cursor-pointer'>
                <img src={assets.arrow_icon} alt='' className='rotate-180 opacity-65' />
                Back to dashboard
            </button>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
                {/* Left: item image & details */}
                <div className='lg:col-span-2'>
                    <img src={itemData.image} alt='' className='w-full h-auto md:max-h-100 object-cover rounded-xl mb-6 shadow-md' />
                    
                    <div className='space-y-6'>
                        <div>
                            <h1 className='text-3xl font-bold'>
                                {itemData.name || (itemData.brand && itemData.model ? `${itemData.brand} ${itemData.model}` : itemData.brand) || ''}
                            </h1>
                            <p className='text-gray-500 text-lg'>
                                {itemData.location || ''} {itemData.year ? ` . ${itemData.year}` : ''}
                            </p>
                        </div>
                        <hr className='border-borderColor my-6' />

                        {filteredDetails.length > 0 && (
                            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                                {filteredDetails.map(({ icon, text }) => (
                                    <div key={text} className='flex-col items-center bg-light p-4 rounded-lg'>
                                        <img src={icon} alt='' className='h-5 mb-2' />
                                        {text}
                                    </div>
                                ))}
                            </div>
                        )}

                        <div>
                            <h1 className='text-xl font-medium mb-3'>Description</h1>
                            <p className='text-gray-500'>{itemData.description}</p>
                        </div>

                        {itemData.features && (
                            <div>
                                <h1 className='text-xl font-medium mb-3'>Features</h1>
                                <ul className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                                    {itemData.features.map((feature) => (
                                        <li key={feature} className='flex items-center text-gray-500'>
                                            <img src={assets.check_icon} className='h-4 mr-2' alt='' />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Booking Form */}
                <div className='shadow-lg h-max sticky top-18 rounded-xl p-6 space-y-6 text-gray-500'>
                    <p className='flex items-center justify-between text-2xl text-gary-800 font-semibold'>
                        {itemData.pricePerDay ? `${itemData.pricePerDay}` : ''}
                        <span className='text-base text-gray-400 font-normal'>per day</span>
                    </p>
                    <hr className='border-borderColor my-6' />
                    <button className='w-full bg-primary hover:bg-primary-dull transition-all py-3 font-medium text-white rounded-xl cursor-pointer' onClick={() => navigate(`/owner/items/edit/${itemData._id}`)}>
                        Edit Item
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewItem;
