import React from 'react'
import Title from './Title'
import { assets } from '../assets/assets'
import CarCard from './CarCard'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import {motion} from 'motion/react'

const FeaturedSection = () => {

      const navigate = useNavigate()
      // FIX: Change 'cars' to 'items' to match the new data model
      const { items } = useAppContext()

  return (
    <motion.div initial={{y: 40, opacity:0}} whileInView={{ y: 0, opacity: 1}} transition={{ duration: 1, ease: "easeOut" }} className='flex flex-col items-center py-6 md:px-16 lg:px-24 xl:px-32'>

        <motion.div initial={{y: 20, opacity:0}} whileInView={{ y: 0, opacity: 1}} transition={{ duration: 1, delay: 0.5 }}>
            <Title title='Featured Services' subTitle='Explore our selection of premium services available for your new adventure.'/>
        </motion.div>

        <motion.div initial={{y: 100, opacity:0}} whileInView={{ y: 0, opacity: 1}} transition={{ duration: 1, delay: 0.5 }} className='grid grid-cols-1 sm:grid-cols-3 gap-8 mt-18'>
            {
                // FIX: Map over 'items' instead of 'cars' and safely handle if items is undefined
                items?.slice(0,6).map((item) => (
                    <motion.div key={item._id} initial={{ scale: 0.95, opacity:0}} whileInView={{ scale: 1, opacity: 1}} transition={{ duration: 0.4, ease: "easeOut" }}>
                        {/* FIX: Pass the data as an 'item' prop */}
                        <CarCard item={item}/>
                    </motion.div>
                ))
            }
        </motion.div>

        <motion.button initial={{y: 20, opacity:0}} whileInView={{ y: 0, opacity: 1}} transition={{ duration: 0.4, delay: 0.6 }} onClick={()=> {
            navigate('/services'); scrollTo(0,0)
        }}
        className='flex items-center justify-center gap-2 px-6 py-2 border border-borderColor hover:bg-gray-50 rounded-md mt-18 cursor=pointer'> 
            Explore all Services <img src={assets.arrow_icon} alt="arrow" />
        </motion.button>

    </motion.div>
  )
}

export default FeaturedSection






// import React from 'react'
// import Title from './Title'
// import { assets, dummyCarData } from '../assets/assets'
// import CarCard from './CarCard'
// import { useNavigate } from 'react-router-dom'
// import { useAppContext } from '../context/AppContext'

// const FeaturedSection = () => {

//       const navigate = useNavigate()
//       const {cars} = useAppContext()

//   return (
//     <div className='flex flex-col items-center py-6 md:px-16 lg:px-24 xl:px-32'>

//         <div>
//             <Title title='Featured Services' subTitle='Explore our selection of premium services available for your new adventure.'/>
//         </div>

//         <div className='grid grid-cols-1 sm:grid-cols-3 gap-8 mt-18'>
//             {
//                 cars.slice(0,6).map((car)=> (
//                     <div key={car._id}>
//                         <CarCard car={car}/>
//                     </div>
//                 ))
//             }
//         </div>

//         <button onClick={()=> {
//             navigate('/cars'); scrollTo(0,0)
//         }}
//         className='flex items-center justify-center gap-2 px-6 py-2 border border-borderColor hover:bg-gray-50 rounded-md mt-18 cursor=pointer'> 
//             Explore all Services <img src={assets.arrow_icon} alt="arrow" />
//         </button>

//     </div>
//   )
// }

// export default FeaturedSection