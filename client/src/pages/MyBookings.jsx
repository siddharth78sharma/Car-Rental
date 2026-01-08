import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'

const MyBookings = () => {
  const { axios, user, currency } = useAppContext()

  const [bookings, setBookings] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [newReturnDate, setNewReturnDate] = useState('')
  const [loading, setLoading] = useState(false)

  /* 🔴 Cancel Modal State */
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelBookingId, setCancelBookingId] = useState(null)
  const [cancelReason, setCancelReason] = useState('')
  const [customReason, setCustomReason] = useState('')

  const fetchMyBookings = async () => {
    try {
      const { data } = await axios.get('/api/bookings/user')
      if (data.success) setBookings(data.bookings)
      else toast.error(data.message)
    } catch {
      toast.error('Failed to fetch bookings.')
    }
  }

  /* ❌ Cancel Booking with Reason */
  const handleCancelBooking = async () => {
    if (!cancelReason) {
      toast.error('Please select a reason')
      return
    }

    const finalReason =
      cancelReason === 'Other' ? customReason : cancelReason

    if (!finalReason) {
      toast.error('Please enter cancellation reason')
      return
    }

    try {
      setLoading(true)
      const { data } = await axios.put('/api/bookings/cancel', {
        bookingId: cancelBookingId,
        reason: finalReason,
      })

      if (data.success) {
        toast.success('Booking cancelled successfully!')
        fetchMyBookings()
        closeCancelModal()
      } else {
        toast.error(data.message || 'Cancellation failed.')
      }
    } catch {
      toast.error('Could not cancel booking.')
    } finally {
      setLoading(false)
    }
  }

  const closeCancelModal = () => {
    setShowCancelModal(false)
    setCancelBookingId(null)
    setCancelReason('')
    setCustomReason('')
  }

  /* ⏩ Extend Booking */
  const handleExtendBooking = async (bookingId) => {
    if (!newReturnDate) {
      toast.error('Please select a new return date.')
      return
    }

    try {
      setLoading(true)
      const { data } = await axios.put('/api/bookings/extend', {
        bookingId,
        newReturnDate,
      })

      if (data.success) {
        toast.success('Booking extended successfully!')
        setEditingId(null)
        setNewReturnDate('')
        fetchMyBookings()
      } else {
        toast.error(data.message)
      }
    } catch {
      toast.error('Could not extend booking.')
    } finally {
      setLoading(false)
      setEditingId(null)
    }
  }

  useEffect(() => {
    if (user) fetchMyBookings()
  }, [user])

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="px-6 md:px-16 lg:px-24 xl:px-32 pt-20 mt-16 max-w-7xl mx-auto"
    >
      <Title
        title="My Bookings"
        subTitle="View and manage all your bookings"
        align="left"
      />

      {bookings.map((booking, index) => (
        <motion.div
          key={booking._id}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-lg mt-6"
        >
          {/* Item Image + Info */}
          <div>
            <img
              src={booking.car?.image}
              alt=""
              className="rounded-md aspect-video object-cover"
            />
            <p className="text-lg font-medium mt-2">
              {booking.car?.brand} {booking.car?.model}
            </p>
            <p className="text-gray-500 text-sm">
              {booking.car?.year} • {booking.car?.category} •{' '}
              {booking.car?.location}
            </p>
          </div>

          {/* Booking Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <p className="px-3 py-1.5 bg-light rounded">
                Booking #{index + 1}
              </p>
              <p
                className={`px-3 py-1 text-xs rounded-full ${
                  booking.status === 'confirmed'
                    ? 'bg-green-400/15 text-green-600'
                    : 'bg-red-400/15 text-red-600'
                }`}
              >
                {booking.status}
              </p>
            </div>

            <div className="flex items-start gap-2 mt-3">
              <img
                src={assets.calendar_icon_colored}
                className="w-4 h-4 mt-1"
              />
              <div>
                <p className="text-gray-500">Rental Period</p>
                <p>
                  {new Date(booking.pickupDate).toLocaleDateString()} to{' '}
                  {new Date(booking.returnDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 mt-3">
              <img
                src={assets.location_icon_colored}
                className="w-4 h-4 mt-1"
              />
              <div>
                <p className="text-gray-500">Pick-up Location</p>
                <p>{booking.car?.location}</p>
              </div>
            </div>
          </div>

          {/* Price + Actions */}
          <div className="flex flex-col justify-between items-end">
            <div className="text-right text-sm text-gray-500">
              <p>Total Price</p>
              <h1 className="text-2xl font-semibold text-primary">
                {currency}
                {booking.price}
              </h1>
              <p>
                Booked on{' '}
                {new Date(booking.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex gap-3 mt-4">
              {editingId === booking._id ? (
                <>
                  <input
                    type="date"
                    value={newReturnDate}
                    onChange={(e) => setNewReturnDate(e.target.value)}
                    className="border p-2 rounded"
                  />
                  <button
                    onClick={() => handleExtendBooking(booking._id)}
                    className="px-4 py-2 bg-green-600 text-white rounded"
                  >
                    Save
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setEditingId(booking._id)
                    setNewReturnDate(
                      new Date(booking.returnDate)
                        .toISOString()
                        .split('T')[0]
                    )
                  }}
                  className="px-4 py-2 bg-blue-500/15 text-blue-600 rounded-lg"
                >
                  Extend Booking
                </button>
              )}

              <button
                onClick={() => {
                  setCancelBookingId(booking._id)
                  setShowCancelModal(true)
                }}
                className="px-4 py-2 bg-red-500/15 text-red-600 rounded-lg"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </motion.div>
      ))}

      {/* 🔴 Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-3">
              Cancel Booking
            </h2>

            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full border p-2 rounded mb-3"
            >
              <option value="">Select reason</option>
              <option>Change of plans</option>
              <option>Found better price</option>
              <option>Vehicle not required</option>
              <option>Other</option>
            </select>

            {cancelReason === 'Other' && (
              <textarea
                rows="3"
                placeholder="Enter reason"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="w-full border p-2 rounded mb-3"
              />
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={closeCancelModal}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Close
              </button>
              <button
                onClick={handleCancelBooking}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default MyBookings












// import React, { useEffect, useState } from 'react'
// import { assets } from '../assets/assets'
// import Title from '../components/Title'
// import { useAppContext } from '../context/AppContext'
// import toast from 'react-hot-toast'
// import { motion } from 'motion/react'

// const MyBookings = () => {
//     const { axios, user, currency } = useAppContext()

//     const [bookings, setBookings] = useState([])
//     const [editingId, setEditingId] = useState(null)
//     const [newReturnDate, setNewReturnDate] = useState('')
//     const [loading, setLoading] = useState(false)

//     const fetchMyBookings = async () => {
//         try {
//             const { data } = await axios.get('/api/bookings/user')
//             if (data.success) {
//                 setBookings(data.bookings)
//             } else {
//                 toast.error(data.message)
//             }
//         } catch (error) {
//             toast.error('Failed to fetch bookings.')
//         }
//     }

//     const handleCancelBooking = async (bookingId) => {
//         // NOTE: window.confirm is not ideal for user experience and may not show
//         // in this environment. A modal component would be a better solution.
//         if (window.confirm("Are you sure you want to cancel this booking?")) {
//             try {
//                 setLoading(true)
//                 const { data } = await axios.put('/api/bookings/cancel', { bookingId })
//                 if (data.success) {
//                     toast.success('Booking cancelled successfully!')
//                     fetchMyBookings() // Refresh the list after a successful cancellation
//                 } else {
//                     toast.error(data.message || 'Cancellation failed.')
//                 }
//             } catch (error) {
//                 toast.error('Could not cancel booking. Please try again.')
//             } finally {
//                 setLoading(false)
//             }
//         }
//     }

//     const handleExtendBooking = async (bookingId) => {
//         if (!newReturnDate) {
//             toast.error('Please select a new return date.')
//             return;
//         }
//         try {
//             setLoading(true)
//             const { data } = await axios.put('/api/bookings/extend', { bookingId, newReturnDate })
//             if (data.success) {
//                 toast.success('Booking extended successfully!')
//                 setEditingId(null)
//                 setNewReturnDate('')
//                 fetchMyBookings() // Refresh the list after a successful extension
//             } else {
//                 toast.error(data.message || 'Extension failed.')
//             }
//         } catch (error) {
//             toast.error('Could not extend booking. Please try again.')
//         } finally {
//             setLoading(false)
//             setEditingId(null); // Reset the editing state regardless of API success/failure
//         }
//     }

//     useEffect(() => {
//         if (user) {
//             fetchMyBookings()
//         }
//     }, [user])

//     return (
//         <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl mx-auto pt-20'>

//             <Title title='My Bookings' subTitle='View and manage all your bookings' align="left" />

//             <div>
//                 {bookings.map((booking, index) => (
//                     <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, delay: index * 0.1 }} key={booking._id} className='grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12'>
//                         {/* Item image + Info */}
//                         <div className='md:col-span-1'>
//                             <div className='rounded-md overflow-hidden mb-3'>
//                                 <img src={booking.car?.image} alt="" className='w-full h-auto aspect-video object-cover' />
//                             </div>
//                             <p className='text-lg font-medium mt-2'>{booking.car?.brand} {booking.car?.model}</p>

//                             <p className='text-gray-500'>{booking.car?.year} . {booking.car?.category} . {booking.car?.location}</p>
//                         </div>

//                         {/* booking info */}
//                         <div className='md:col-span-2'>
//                             <div className='flex items-center gap-2'>
//                                 <p className='px-3 py-1.5 bg-light rounded'>Booking #{index + 1}</p>
//                                 <p className={`px-3 py-1 text-xs rounded-full ${booking.status === 'confirmed' ? 'bg-green-400/15 text-green-600' : 'bg-red-400/15 text-red-600'}`}>{booking.status}</p>
//                             </div>

//                             <div className='flex items-start gap-2 mt-3'>
//                                 <img src={assets.calendar_icon_colored} alt="" className='w-4 h-4 mt-1' />
//                                 <div>
//                                     <p className='text-gray-500'>Rental Period</p>
//                                     <p>{new Date(booking.pickupDate).toLocaleDateString()} to {new Date(booking.returnDate).toLocaleDateString()}</p>
//                                 </div>
//                             </div>

//                             <div className='flex items-start gap-2 mt-3'>
//                                 <img src={assets.location_icon_colored} alt="" className='w-4 h-4 mt-1' />
//                                 <div>
//                                     <p className='text-gray-500'>Pick-up Location</p>
//                                     <p>{booking.car.location}</p>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* price & actions */}
//                         <div className='md:col-span-1 flex flex-col justify-between gap-6'>
//                             <div className='text-sm text-gray-500 text-right'>
//                                 <p>Total Price</p>
//                                 <h1 className='text-2xl font-semibold text-primary'>{currency}{booking.price}</h1>
//                                 <p>Booked on {new Date(booking.createdAt).toLocaleDateString()}</p>
//                             </div>

//                             {/* Action Buttons */}
//                             <div className='flex justify-end gap-3'>
//                                 {['confirmed', 'pending'].includes(booking.status) && (
//                                     <>
//                                         {editingId === booking._id ? (
//                                             <div className='flex flex-col sm:flex-row items-center gap-2'>
//                                                 <input
//                                                     type="date"
//                                                     value={newReturnDate}
//                                                     onChange={(e) => setNewReturnDate(e.target.value)}
//                                                     className='border border-gray-300 rounded-md p-2 text-gray-500 w-full sm:w-auto'
//                                                 />
//                                                 <button
//                                                     onClick={() => handleExtendBooking(booking._id)}
//                                                     disabled={loading}
//                                                     className={`px-4 py-2 rounded-md font-medium text-white bg-green-500 hover:bg-green-600 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
//                                                 >
//                                                     {loading ? 'Saving...' : 'Save'}
//                                                 </button>
//                                                 <button
//                                                     onClick={() => {
//                                                         setEditingId(null)
//                                                         setNewReturnDate('')
//                                                     }}
//                                                     className='px-4 py-2 rounded-md font-medium text-gray-600 bg-gray-300 hover:bg-gray-400 transition-all'
//                                                 >
//                                                     Cancel
//                                                 </button>
//                                             </div>
//                                         ) : (
//                                             <button
//                                                 onClick={() => {
//                                                     setEditingId(booking._id);
//                                                     setNewReturnDate(new Date(booking.returnDate).toISOString().split('T')[0]);
//                                                 }}
//                                                 className='px-4 py-2 bg-blue-500/15 text-blue-600 rounded-lg font-medium hover:bg-blue-500/25 transition-all'
//                                             >
//                                                 Extend Booking
//                                             </button>
//                                         )}
//                                         <button
//                                             onClick={() => handleCancelBooking(booking._id)}
//                                             disabled={loading}
//                                             className={`px-4 py-2 bg-red-500/15 text-red-600 rounded-lg font-medium hover:bg-red-500/25 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
//                                         >
//                                             Cancel Booking
//                                         </button>
//                                     </>
//                                 )}
//                             </div>
//                         </div>
//                     </motion.div>
//                 ))}
//             </div>
//         </motion.div>
//     )
// }

// export default MyBookings