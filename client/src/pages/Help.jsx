import React from 'react';

const Help = () => {
  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16'>
      <div className='text-center mb-12'>
        <h1 className='text-4xl md:text-5xl font-bold text-gray-800'>Help Center</h1>
        <p className='mt-4 text-lg text-gray-600'>Find answers to your questions and get support.</p>
      </div>

      <div className='max-w-4xl mx-auto'>
        <h2 className='text-3xl font-semibold text-gray-800 mb-6'>Frequently Asked Questions</h2>
        <div className='space-y-8'>
          {/* FAQ Item 1 */}
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h3 className='text-xl font-medium text-gray-900'>How do I rent an item?</h3>
            <p className='mt-2 text-gray-700'>
              To rent an item, simply browse our services, select the item you want, choose your pickup and return dates, and click "Book Now." You will need to be logged in to complete the booking.
            </p>
          </div>

          {/* FAQ Item 2 */}
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h3 className='text-xl font-medium text-gray-900'>How can I list my own item?</h3>
            <p className='mt-2 text-gray-700'>
              You can list your own item by navigating to the "Add Service" page in your dashboard. You will need to provide details like the item's name, brand, type, description, and images.
            </p>
          </div>
          
          {/* FAQ Item 3 */}
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h3 className='text-xl font-medium text-gray-900'>What happens if I need to cancel a booking?</h3>
            <p className='mt-2 text-gray-700'>
              You can cancel a booking from your "My Bookings" page. Please note that cancellation policies may vary based on the item and the owner's terms.
            </p>
          </div>

          {/* FAQ Item 4 */}
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h3 className='text-xl font-medium text-gray-900'>How do payments work?</h3>
            <p className='mt-2 text-gray-700'>
              Currently, our platform facilitates the booking process. Payment arrangements are typically made directly with the owner upon pickup. We do not require credit card details to reserve an item.
            </p>
          </div>

          {/* FAQ Item 5 */}
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h3 className='text-xl font-medium text-gray-900'>What if the item I want is unavailable?</h3>
            <p className='mt-2 text-gray-700'>
              If an item is unavailable for your selected dates, the booking button will be disabled. We recommend trying different dates or browsing our other related items, which will be shown on the item's details page.
            </p>
          </div>
        </div>
      </div>

      <div className='mt-16 text-center'>
        <h2 className='text-3xl font-semibold text-gray-800 mb-4'>Need more help?</h2>
        <p className='text-lg text-gray-700'>
          If you can't find the answer to your question, feel free to contact us directly.
        </p>
        <div className='flex flex-col sm:flex-row justify-center items-center gap-4 mt-6'>
          <a href="tel:+919876543210" className='flex items-center gap-2 text-primary font-medium hover:underline'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.774a11.08 11.08 0 006.107 6.107l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            +91-9876543210
          </a>
          <a href="mailto:support@rentall.com" className='flex items-center gap-2 text-primary font-medium hover:underline'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            support@rentall.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default Help;