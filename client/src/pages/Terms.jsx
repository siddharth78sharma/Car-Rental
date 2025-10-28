import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, FileText, Info } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20 px-6 md:px-16 lg:px-32 text-gray-700">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <ShieldCheck className="text-primary w-10 h-10" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-2">
          Terms of Service
        </h1>
        <p className="text-gray-500 text-lg">
          Please read our terms carefully before using RentAll services.
        </p>
        <p className="text-sm text-gray-400 mt-1">Last updated: October 26, 2025</p>
      </motion.div>

      {/* MAIN CONTENT */}
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Section 1 */}
        <motion.section
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white shadow-md rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-all"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            1. Introduction
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Welcome to <span className="font-semibold text-primary">RentAll</span>, your trusted rental marketplace for cars, bikes, villas, furniture, electronics, and instruments. 
            By accessing or using our services, you agree to be bound by these Terms and our Privacy Policy. 
            If you disagree with any part, you may not use our platform.
          </p>
        </motion.section>

        {/* Section 2 */}
        <motion.section
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white shadow-md rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-all"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            2. User Accounts
          </h2>
          <p className="text-gray-600 leading-relaxed">
            You must create an account to access rental services. 
            Provide accurate and up-to-date information, and maintain the confidentiality of your login credentials. 
            You are responsible for all activities that occur under your account. 
            We reserve the right to suspend or terminate accounts that violate our policies.
          </p>
        </motion.section>

        {/* Section 3 */}
        <motion.section
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white shadow-md rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-all"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            3. Rental Services
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 leading-relaxed">
            <li>
              <span className="font-semibold text-primary">Booking:</span> 
              Rentals depend on availability and confirmation by the item owner.
              RentAll acts as a facilitator and is not part of the rental contract.
            </li>
            <li>
              <span className="font-semibold text-primary">Payments:</span> 
              Transactions are handled securely between renter and owner. 
              We are not responsible for payment disputes or refund delays.
            </li>
            <li>
              <span className="font-semibold text-primary">Cancellations:</span> 
              Each owner defines their own cancellation policy. 
              Review it carefully before booking.
            </li>
          </ul>
        </motion.section>

        {/* Section 4 */}
        <motion.section
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white shadow-md rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-all"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            4. User Content
          </h2>
          <p className="text-gray-600 leading-relaxed">
            You are responsible for the accuracy and legality of any content you upload. 
            By uploading content (images, item descriptions, etc.), 
            you grant RentAll a non-exclusive, royalty-free license to use it for service operation.
            Do not upload content that is illegal, offensive, or infringes others’ rights.
          </p>
        </motion.section>

        {/* Section 5 */}
        <motion.section
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white shadow-md rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-all"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            5. Limitation of Liability
          </h2>
          <p className="text-gray-600 leading-relaxed">
            RentAll provides services on an “as-is” basis. 
            We are not responsible for direct or indirect losses caused by rental transactions, 
            including booking cancellations, item damages, or disputes between users.
          </p>
        </motion.section>

        {/* Section 6 */}
        <motion.section
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white shadow-md rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-all"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            6. Changes to Terms
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We may update these Terms periodically to reflect operational or legal changes. 
            Any changes will be posted on this page. 
            Continued use of the platform implies acceptance of the revised Terms.
          </p>
        </motion.section>

        {/* Section 7 */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-primary/10 to-blue-50 shadow-md rounded-2xl p-8 border border-primary/20 hover:shadow-lg transition-all"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Info className="w-6 h-6 text-primary" /> Contact Us
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Have questions about these Terms or any rental policies?
            <br />
            Email us at:{" "}
            <a
              href="mailto:support@rentall.com"
              className="text-primary font-medium hover:underline"
            >
              support@rentall.com
            </a>
          </p>
        </motion.section>
      </div>

      {/* Footer Accent */}
      <div className="text-center text-gray-400 mt-16 text-sm">
        © {new Date().getFullYear()} RentAll — All rights reserved.
      </div>
    </div>
  );
};

export default Terms;