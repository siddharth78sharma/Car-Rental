import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

// The component receives an 'item' prop
const CarCard = ({ item }) => {

      const currency = import.meta.env.VITE_CURRENCY
      const navigate = useNavigate()

      // Function to handle image loading errors
      const handleImageError = (e) => {
        // Log a clear error message to the console
        console.error("Image failed to load:", e.target.src);
        // Optionally, you could set a placeholder image here
        e.target.src = 'https://placehold.co/400x300/e5e7eb/6b7280?text=Image+Not+Found';
      };

  return (
    <div 
      onClick={()=> {navigate(`/car-details/${item._id}`); scrollTo(0,0)}} 
      className='group rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 transition-all duration-500 cursor-pointer'
    >

        <div className='relative h-48 overflow-hidden'>
            <img 
              src={item.image} 
              alt="Car Image" 
              className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
              onError={handleImageError}
            />
            {item.isAvaliable && <p className='absolute top-4 left-4 bg-primary/90 text-white text-x5 px-2.5 py-1 rounded-full'>Available Now</p>}

            <div className='absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg'>
              <span className='font-semibold'>{currency}{item.pricePerDay}</span>
              <span className='text-sm text-white/80'> / day</span>

            </div>
        </div>

        <div className='p-4 sm:p-5'>
           <div className='flex justify-between items-start mb-2'> 
                <div>
                    <h3 className='text-lg font-medium'>{item.brand} {item.model}</h3>
                    <p className='text-muted-foreground text-sm'>{item.category} . {item.year}</p>
                </div>
           </div>

           <div className='mt-4 grid-cols-2 gap-y-2 text-gray-600'>
             <div className='flex items-center text-sm text-muted-foreground'>
              <img src={assets.users_icon} alt="" className='h-4 mr-2'/>
                <span>{item.seating_capacity} </span>
             </div>
             <div className='flex items-center text-sm text-muted-foreground'>
                <img src={assets.location_icon} alt="" className='h-4 mr-2'/>
                <span>{item.location}</span>
             </div>
           </div>

        </div>

    </div>
  )
}

export default CarCard
