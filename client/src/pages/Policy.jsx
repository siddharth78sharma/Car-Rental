import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16 text-gray-700'>
      <div className='text-center mb-12'>
        <h1 className='text-4xl md:text-5xl font-bold text-gray-800'>Privacy Policy</h1>
        <p className='mt-4 text-lg text-gray-600'>Last updated: October 26, 2025</p>
      </div>

      <div className='max-w-4xl mx-auto space-y-8'>
        <section>
          <h2 className='text-2xl font-semibold text-gray-800 mb-3'>1. Introduction</h2>
          <p>
            Your privacy is important to us. This Privacy Policy explains how Rentall ("we," "our," or "us") collects, uses, and protects your personal information when you use our website, services, and mobile applications. By using our Services, you consent to the data practices described in this policy.
          </p>
        </section>

        <section>
          <h2 className='text-2xl font-semibold text-gray-800 mb-3'>2. Information We Collect</h2>
          <p>We may collect several types of information from and about you, including:</p>
          <ul className='list-disc list-inside space-y-2 mt-2'>
            <li>
              <span className="font-semibold">Personal Information:</span> This includes your name, email address, phone number, and any other information you provide when creating an account or listing an item.
            </li>
            <li>
              <span className="font-semibold">Transaction Information:</span> Details about your bookings and listings, including rental dates and item details.
            </li>
            <li>
              <span className="font-semibold">Usage Data:</span> Information about how you access and use our Services, such as your IP address, browser type, and pages visited.
            </li>
          </ul>
        </section>

        <section>
          <h2 className='text-2xl font-semibold text-gray-800 mb-3'>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className='list-disc list-inside space-y-2 mt-2'>
            <li>Provide, maintain, and improve our Services.</li>
            <li>Process your bookings and manage your listings.</li>
            <li>Communicate with you about your account and our Services.</li>
            <li>Monitor and analyze usage and trends to improve your experience.</li>
            <li>Detect and prevent fraudulent or illegal activity.</li>
          </ul>
        </section>
        
        <section>
          <h2 className='text-2xl font-semibold text-gray-800 mb-3'>4. Data Security</h2>
          <p>
            We implement reasonable security measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the Internet is completely secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className='text-2xl font-semibold text-gray-800 mb-3'>5. Your Choices and Rights</h2>
          <p>
            You have the right to access, update, or delete your personal information. You can manage your account information by logging into your profile settings. If you wish to delete your account, please contact us.
          </p>
        </section>

        <section>
          <h2 className='text-2xl font-semibold text-gray-800 mb-3'>6. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page. Your continued use of our Services after any changes indicates your acceptance of the updated policy.
          </p>
        </section>
        
        <section>
          <h2 className='text-2xl font-semibold text-gray-800 mb-3'>7. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us:
            <br />
            Email: <a href="mailto:support@rentall.com" className='text-primary hover:underline'>support@rentall.com</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;