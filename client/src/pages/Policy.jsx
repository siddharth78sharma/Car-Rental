import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Mail, Lock } from "lucide-react";

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "1. Introduction",
      content: `Your privacy is important to us. This Privacy Policy explains how RentAll ("we," "our," or "us") collects, uses, and protects your personal information when you use our website, mobile app, and services. By using our platform, you consent to the practices described below.`,
    },
    {
      title: "2. Information We Collect",
      content: (
        <>
          <p>We collect several types of information to provide and improve our services:</p>
          <ul className="list-disc list-inside space-y-2 mt-3">
            <li>
              <span className="font-semibold text-gray-800">Personal Information:</span> Your name, email address, phone number, and any other data you provide when creating an account or listing an item.
            </li>
            <li>
              <span className="font-semibold text-gray-800">Transaction Information:</span> Details about your bookings, payments, and rental activities.
            </li>
            <li>
              <span className="font-semibold text-gray-800">Usage Data:</span> Device type, IP address, browser version, and interactions with our site.
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "3. How We Use Your Information",
      content: (
        <>
          <p>We use your information responsibly and only for legitimate business purposes, including to:</p>
          <ul className="list-disc list-inside space-y-2 mt-3">
            <li>Provide, maintain, and improve our Services.</li>
            <li>Process bookings, transactions, and payments.</li>
            <li>Send updates, notifications, and promotional offers.</li>
            <li>Enhance security and detect fraudulent activity.</li>
            <li>Comply with legal obligations and resolve disputes.</li>
          </ul>
        </>
      ),
    },
    {
      title: "4. Data Security",
      content: `We use advanced encryption and secure server technology to protect your data from unauthorized access. However, no online platform is 100% secure, and we cannot guarantee absolute security.`,
    },
    {
      title: "5. Your Rights and Choices",
      content: `You can review, update, or delete your personal information anytime by logging into your account settings. To request full account deletion or data export, contact us at the email below.`,
    },
    {
      title: "6. Policy Updates",
      content: `We may update this Privacy Policy periodically. All changes will be reflected on this page with a new “Last Updated” date. Continued use of our platform means you accept the revised policy.`,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6 sm:px-10 md:px-20 font-sans text-gray-700 pt-24">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <div className="flex justify-center mb-4">
          <ShieldCheck className="w-12 h-12 text-indigo-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
          Privacy Policy
        </h1>
        <p className="text-gray-600 text-lg">
          Last updated: <span className="font-medium">October 26, 2025</span>
        </p>
      </motion.header>

      {/* Sections */}
      <div className="max-w-4xl mx-auto space-y-10">
        {sections.map((section, index) => (
          <motion.section
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-all"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              {section.title}
            </h2>
            <div className="text-gray-600 leading-relaxed text-[15px]">
              {section.content}
            </div>
          </motion.section>
        ))}

        {/* Contact Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-all"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            7. Contact Us
          </h2>
          <p className="text-gray-600">
            If you have any questions or requests regarding this Privacy Policy,
            please contact us at:
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-4">
            <div className="flex items-center gap-2 text-gray-700">
              <Mail className="text-indigo-600 w-5 h-5" />
              <a
                href="mailto:support@rentall.com"
                className="text-indigo-600 hover:underline"
              >
                support@rentall.com
              </a>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Lock className="text-indigo-600 w-5 h-5" />
              <span>We respond within 24 hours</span>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
