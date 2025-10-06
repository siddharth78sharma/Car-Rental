import React from 'react';

const AboutUs = () => {
  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16'>
      <div className='text-center mb-12'>
        <h1 className='text-4xl md:text-5xl font-bold text-gray-800'>About Us</h1>
        <p className='mt-4 text-lg text-gray-600'>Connecting you to what you need, when you need it.</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
        <div className='order-2 md:order-1'>
          <h2 className='text-3xl font-semibold text-gray-800'>Our Mission</h2>
          <p className='mt-4 text-gray-700 leading-relaxed'>
            Our mission is to simplify the rental process and provide a reliable platform where individuals and businesses can effortlessly rent a wide variety of items. From cars and bikes for your daily commute to furniture and electronics for your home, we strive to make high-quality rentals accessible to everyone. We believe in a shared economy that promotes sustainability and convenience.
          </p>
        </div>
        <div className='order-1 md:order-2'>
          <img
            src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
            alt="A team collaborating on a project"
            className='rounded-xl shadow-lg w-full h-auto object-cover'
          />
        </div>
      </div>

      <div className='mt-16'>
        <h2 className='text-3xl font-semibold text-gray-800 text-center'>Our Story</h2>
        <p className='mt-4 text-gray-700 leading-relaxed max-w-4xl mx-auto text-center'>
          Rentall started as a simple idea: what if you could rent anything you need with a single click? Frustrated by the complexities of traditional rental services, our founders set out to create a seamless, user-friendly platform. We built a system that prioritizes trust, transparency, and a vast selection, allowing our community to find the perfect item for any occasion.
        </p>
      </div>

      <div className='mt-16'>
        <h2 className='text-3xl font-semibold text-gray-800 text-center'>Meet the Team</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8'>
          {/* Team Member 1 */}
          <div className='flex flex-col items-center text-center'>
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Team Member 1"
              className='w-32 h-32 rounded-full object-cover shadow-md'
            />
            <h3 className='mt-4 text-xl font-medium text-gray-900'>John Doe</h3>
            <p className='text-gray-500'>Founder & CEO</p>
          </div>
          {/* Team Member 2 */}
          <div className='flex flex-col items-center text-center'>
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="Team Member 2"
              className='w-32 h-32 rounded-full object-cover shadow-md'
            />
            <h3 className='mt-4 text-xl font-medium text-gray-900'>Jane Smith</h3>
            <p className='text-gray-500'>Lead Developer</p>
          </div>
          {/* Team Member 3 */}
          <div className='flex flex-col items-center text-center'>
            <img
              src="https://randomuser.me/api/portraits/men/50.jpg"
              alt="Team Member 3"
              className='w-32 h-32 rounded-full object-cover shadow-md'
            />
            <h3 className='mt-4 text-xl font-medium text-gray-900'>David Williams</h3>
            <p className='text-gray-500'>Head of Operations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;