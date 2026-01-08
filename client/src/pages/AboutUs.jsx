import React from "react";
import { motion } from "framer-motion";

const AboutUs = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-16 px-6 md:px-16 lg:px-24 xl:px-32 pt-24">
      {/* Header Section */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl font-extrabold text-gray-800">
          About <span className="text-blue-600">RentAll</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
          Your one-stop solution for renting Cars, Bikes, Villas, Furniture,
          Electronics, and Instruments — all in one place.
        </p>
      </motion.div>

      {/* Mission Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          className="order-2 md:order-1"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-700 leading-relaxed text-justify">
            At <span className="font-semibold text-blue-600">RentAll</span>, our
            mission is to make renting effortless and affordable. Whether you
            need a car for a road trip, a villa for a vacation, or furniture for
            your new home — we’ve got you covered. We aim to promote
            sustainability by reducing waste through shared use and ensure a
            seamless rental experience for everyone.
          </p>
        </motion.div>

        <motion.div
          className="order-1 md:order-2"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <img
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1470&q=80"
            alt="Our Mission"
            className="rounded-2xl shadow-xl w-full h-auto object-cover"
          />
        </motion.div>
      </div>

      {/* Story Section */}
      <motion.div
        className="mt-24 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          Our Story
        </h2>
        <p className="text-gray-700 leading-relaxed max-w-4xl mx-auto">
          RentAll began with a simple vision — to connect people with the things
          they need without the burden of ownership. Tired of expensive and
          unreliable rental options, our founders built a secure and transparent
          platform that empowers both owners and renters. Today, we’re proud to
          support thousands of users simplifying their lives through smart,
          sustainable renting.
        </p>
      </motion.div>

      {/* Services Highlight Section */}
      <motion.div
        className="mt-24 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-semibold text-gray-800 mb-10">
          What You Can Rent
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {[
            { name: "Cars", icon: "🚗" },
            { name: "Bikes", icon: "🏍️" },
            { name: "Villas", icon: "🏡" },
            { name: "Furniture", icon: "🛋️" },
            { name: "Electronics", icon: "💻" },
            { name: "Instruments", icon: "🎸" },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="p-6 bg-white shadow-md rounded-xl hover:shadow-lg transition transform hover:-translate-y-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Team Section */}
      <motion.div
        className="mt-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-semibold text-gray-800 text-center">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mt-10">
          {[
            {
              name: "John Doe",
              role: "Founder & CEO",
              img: "https://randomuser.me/api/portraits/men/32.jpg",
            },
            {
              name: "Jane Smith",
              role: "Lead Developer",
              img: "https://randomuser.me/api/portraits/women/44.jpg",
            },
            {
              name: "David Williams",
              role: "Head of Operations",
              img: "https://randomuser.me/api/portraits/men/50.jpg",
            },
          ].map((member, index) => (
            <motion.div
              key={index}
              className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-xl transition"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-28 h-28 rounded-full object-cover shadow-md mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-900">
                {member.name}
              </h3>
              <p className="text-gray-500">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AboutUs;
