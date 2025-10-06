import React from 'react';

const Terms = () => {
  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16 text-gray-700'>
      <div className='text-center mb-12'>
        <h1 className='text-4xl md:text-5xl font-bold text-gray-800'>Terms of Service</h1>
        <p className='mt-4 text-lg text-gray-600'>Last updated: October 26, 2025</p>
      </div>

      <div className='max-w-4xl mx-auto space-y-8'>
        <section>
          <h2 className='text-2xl font-semibold text-gray-800 mb-3'>1. Introduction</h2>
          <p>
            Welcome to Rentall. These Terms of Service ("Terms") govern your access to and use of our website, mobile applications, and services ("Services"). By accessing or using our Services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree, you may not use our Services.
          </p>
        </section>

        <section>
          <h2 className='text-2xl font-semibold text-gray-800 mb-3'>2. User Accounts</h2>
          <p>
            To access certain features of the Services, you must register for an account. You agree to provide accurate and complete information and to keep this information updated. You are responsible for safeguarding your password and for all activities that occur under your account. We reserve the right to suspend or terminate your account at our sole discretion.
          </p>
        </section>

        <section>
          <h2 className='text-2xl font-semibold text-gray-800 mb-3'>3. Rental Services</h2>
          <ul className='list-disc list-inside space-y-2'>
            <li>
              <span className="font-semibold">Booking:</span> All bookings are subject to availability and are confirmed once the owner accepts your request. We facilitate the booking but are not a party to the rental agreement between you and the item owner.
            </li>
            <li>
              <span className="font-semibold">Payments:</span> Payments are handled directly between the renter and the item owner. We do not process payments and are not responsible for any disputes related to payment or booking fees.
            </li>
            <li>
              <span className="font-semibold">Cancellations:</span> Cancellation policies are set by the individual item owners. Please review these policies before making a booking.
            </li>
          </ul>
        </section>

        <section>
          <h2 className='text-2xl font-semibold text-gray-800 mb-3'>4. User Content</h2>
          <p>
            You are responsible for any content you upload, including photos and descriptions of items you list. By providing content, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, and display your content on our platform for the purpose of operating our Services. You agree not to upload any content that is illegal, defamatory, or infringes on the rights of others.
          </p>
        </section>

        <section>
          <h2 className='text-2xl font-semibold text-gray-800 mb-3'>5. Limitation of Liability</h2>
          <p>
            The Services are provided "as is" and "as available" without any warranties. We are not liable for any damages, whether direct, indirect, incidental, or consequential, arising from your use of the Services or from any items rented through our platform. This includes, but is not limited to, damages from a booking, cancellation, or dispute between users.
          </p>
        </section>

        <section>
          <h2 className='text-2xl font-semibold text-gray-800 mb-3'>6. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page. Your continued use of the Services after such modifications constitutes your acceptance of the new Terms.
          </p>
        </section>

        <section>
          <h2 className='text-2xl font-semibold text-gray-800 mb-3'>7. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
            <br />
            Email: <a href="mailto:support@rentall.com" className='text-primary hover:underline'>support@rentall.com</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;