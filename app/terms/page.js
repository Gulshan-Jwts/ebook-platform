'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import '@/stylesheets/terms.css';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Page = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <motion.h1 
            className="text-3xl font-bold text-gray-900"
            variants={fadeIn}
            initial="initial"
            animate="animate"
          >
            Terms & Conditions
          </motion.h1>
          <p className="mt-1 text-lg text-gray-600">Naveen Kewat E-books</p>
          <p className="mt-1 text-sm text-gray-500">Last Updated: June 1, 2025</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <motion.section 
          className="bg-white shadow rounded-lg p-6 mb-8"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p className="text-gray-700">
            Welcome to Naveen Kewat E-books! These Terms & Conditions (&quote;Terms&quote;) govern your use of our website and the purchase of digital e-books from us. By accessing or using our services, you agree to be bound by these Terms. Please read them carefully.
          </p>
        </motion.section>

        <motion.section 
          className="bg-white shadow rounded-lg p-6 mb-8"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <h2 className="text-2xl font-semibold mb-4">1. Intellectual Property</h2>
          <p className="text-gray-700">
            All content available on Naveen Kewat E-books, including but not limited to e-books, text, graphics, logos, images, and software, is the property of Naveen Kewat E-books or its content suppliers and protected by international copyright laws. Your purchase of an e-book grants you a non-exclusive, non-transferable license to access and read the e-book for personal, non-commercial use only. You may not reproduce, distribute, modify, create derivative works of, publicly display, or in any way exploit any of the content, in whole or in part, without our express written permission.
          </p>
        </motion.section>

        <motion.section 
          className="bg-white shadow rounded-lg p-6 mb-8"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <h2 className="text-2xl font-semibold mb-4">2. Payment Terms</h2>
          <p className="text-gray-700">
            All prices for e-books are listed in INR and are subject to change without notice. We accept various payment methods as indicated on our website. By completing a purchase, you confirm that you are authorized to use the chosen payment method and that the payment information you provide is accurate and complete. All sales are final.
          </p>
        </motion.section>

        <motion.section 
          className="bg-white shadow rounded-lg p-6 mb-8"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <h2 className="text-2xl font-semibold mb-4">3. E-Book Access Policy</h2>
          <p className="text-gray-700">
            After purchasing an e-book, users will be granted online access to read it through our secure platform. Downloading, copying, or sharing the e-book files in any form is strictly prohibited. The e-books are meant for personal use only and cannot be transferred or sold.
          </p>
        </motion.section>

        <motion.section 
          className="bg-white shadow rounded-lg p-6 mb-8"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <h2 className="text-2xl font-semibold mb-4">4. Usage Restrictions</h2>
          <p className="text-gray-700">You agree not to:</p>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Share, resell, or distribute purchased e-books to any third party.</li>
            <li>Remove any copyright or proprietary notices from the e-books.</li>
            <li>Use the e-books for any commercial purpose without explicit permission.</li>
            <li>Attempt to download, copy, or replicate the e-book content in any unauthorized way.</li>
            <li>Use our website or services for any unlawful purpose or in any way that could damage, disable, or impair our website.</li>
          </ul>
        </motion.section>

        <motion.section 
          className="bg-white shadow rounded-lg p-6 mb-8"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <h2 className="text-2xl font-semibold mb-4">5. Account Termination</h2>
          <p className="text-gray-700">
            We reserve the right to suspend or terminate your account and access to our services, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms. Upon termination, your right to use the services will immediately cease. If you wish to terminate your account, you may simply discontinue using the services.
          </p>
        </motion.section>

        <motion.section 
          className="bg-white shadow rounded-lg p-6 mb-8"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
          <p className="text-gray-700">
            In no event shall Naveen Kewat E-books, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from 
          </p>
          <ul className="list-disc pl-6 text-gray-700">
            <li>your access to or use of or inability to access or use the service;</li>
            <li>any conduct or content of any third party on the service;</li>
            <li>any content obtained from the service; and</li>
            <li>unauthorized access, use, or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.</li>
          </ul>
        </motion.section>

        <motion.section 
          className="bg-white shadow rounded-lg p-6 mb-8"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <h2 className="text-2xl font-semibold mb-4">7. Contact Information</h2>
          <p className="text-gray-700">
            If you have any questions about these Terms, please contact us:
          </p>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Email: <a href="mailto:[email protected]" className="text-blue-600 hover:underline">[email protected]</a></li>
            <li>Website: <Link href="http://naveenkewatebooks.in" className="text-blue-600 hover:underline">naveenkewatebooks.in</Link></li>
          </ul>
        </motion.section>

        <motion.section 
          className="bg-white shadow rounded-lg p-6 mb-8"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <h2 className="text-2xl font-semibold mb-4">Why Reading T&C is Important?</h2>
          <p className="text-gray-700">
            These Terms & Conditions are crucial for both you and Naveen Kewat E-books. They clearly define the rules for using our website and purchasing our e-books, protecting your rights as a customer and outlining our responsibilities. Understanding them helps ensure a smooth and fair experience for everyone.
          </p>
          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Got It!
          </button>
        </motion.section>
      </main>

      <footer className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-gray-600">© 2025 Naveen Kewat E-books. All rights reserved.</p>
          <p className="text-gray-600">Email: <a href="mailto:[email protected]" className="text-blue-600 hover:underline">[email protected]</a></p>
        </div>
      </footer>
    </div>
  );
};

export default Page;