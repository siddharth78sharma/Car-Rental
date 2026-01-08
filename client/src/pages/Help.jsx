import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "How do I rent an item?",
    answer:
      'To rent an item, simply browse our services, select the item you want, choose your pickup and return dates, and click "Book Now." You’ll need to log in to complete your booking.',
  },
  {
    question: "How can I list my own item?",
    answer:
      'Go to your dashboard and open the "Add Service" page. Fill in details like item name, brand, type, description, price, and upload images. Once approved, your listing goes live!',
  },
  {
    question: "What happens if I need to cancel a booking?",
    answer:
      'You can cancel a booking anytime from the "My Bookings" page. However, cancellation policies vary by item and owner, so please review the terms before booking.',
  },
  {
    question: "How do payments work?",
    answer:
      "Our platform ensures secure transactions. You can pay through integrated methods or directly at pickup, depending on the listing. No credit card info is stored without consent.",
  },
  {
    question: "What if the item I want is unavailable?",
    answer:
      "If an item isn’t available for your selected dates, the booking option will be disabled. Try different dates or explore similar items recommended on the item page.",
  },
];

const Help = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-16 px-6 md:px-16 lg:px-24 xl:px-32 pt-24">
      {/* Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-5xl font-extrabold text-gray-800">Help Center</h1>
        <p className="mt-4 text-lg text-gray-600">
          Find answers, get assistance, and make the most of your RentAll
          experience.
        </p>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left px-6 py-4 flex justify-between items-center focus:outline-none"
              >
                <h3 className="text-lg font-medium text-gray-900">
                  {faq.question}
                </h3>
                <span className="text-gray-500 text-xl">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    className="px-6 pb-4 text-gray-700 leading-relaxed"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Contact Section */}
      <motion.div
        className="mt-20 text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Still Need Help?
        </h2>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Our support team is always ready to help. Get in touch with us via
          phone or email, and we’ll assist you as soon as possible.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
          <a
            href="tel:+919876543210"
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition"
          >
            📞 +91-9876543210
          </a>
          <a
            href="mailto:support@rentall.com"
            className="flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-full hover:bg-gray-900 transition"
          >
            📧 support@rentall.com
          </a>
        </div>
      </motion.div>

      {/* Footer Message */}
      <motion.div
        className="mt-16 text-center text-gray-500"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <p>© {new Date().getFullYear()} RentAll — Making Renting Simple & Smart.</p>
      </motion.div>
    </div>
  );
};

export default Help;
