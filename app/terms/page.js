'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import '@/stylesheets/terms.css';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const TermsPage = () => {
  return (
    <div className="page-container">
       <div className="header-container">
          <motion.h1 
            id="terms-title"
            variants={fadeIn}
            initial="initial"
            animate="animate"
          >
            Terms & Conditions
          </motion.h1>
          <p className="header-subtitle">Naveen Kewat E-books</p>
        </div>

      <main className="main-content">
        <motion.section 
          className="section-block"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <h2 className="section-title">Introduction</h2>
          <p className="section-text">
            Welcome to Naveen Kewat E-books! These Terms & Conditions (&ldquo;Terms&ldquo;) govern your use of our website and the purchase of digital e-books from us. By accessing or using our services, you agree to be bound by these Terms. Please read them carefully.
          </p>
        </motion.section>

        <motion.section 
          className="section-block"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <h2 className="section-title">1. Intellectual Property</h2>
          <p className="section-text">
            All content available on Naveen Kewat E-books, including but not limited to e-books, text, graphics, logos, images, and software, is the property of Naveen Kewat E-books or its content suppliers and protected by international copyright laws. Your purchase of an e-book grants you a non-exclusive, non-transferable license to access and read the e-book for personal, non-commercial use only. You may not reproduce, distribute, modify, create derivative works of, publicly display, or in any way exploit any of the content, in whole or in part, without our express written permission.
          </p>
        </motion.section>

        <motion.section 
          className="section-block"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <h2 className="section-title">2. Payment Terms</h2>
          <p className="section-text">
            All prices for e-books are listed in INR and are subject to change without notice. We accept various payment methods as indicated on our website. By completing a purchase, you confirm that you are authorized to use the chosen payment method and that the payment information you provide is accurate and complete. All sales are final.
          </p>
        </motion.section>

        <motion.section 
          className="section-block"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <h2 className="section-title">3. E-Book Access Policy</h2>
          <p className="section-text">
            After purchasing an e-book, users will be granted online access to read it through our secure platform. Downloading, copying, or sharing the e-book files in any form is strictly prohibited. The e-books are meant for personal use only and cannot be transferred or sold.
          </p>
        </motion.section>

        <motion.section 
          className="section-block"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <h2 className="section-title">4. Usage Restrictions</h2>
          <p className="section-text">You agree not to:</p>
          <ul className="section-list">
            <li>Share, resell, or distribute purchased e-books to any third party.</li>
            <li>Remove any copyright or proprietary notices from the e-books.</li>
            <li>Use the e-books for any commercial purpose without explicit permission.</li>
            <li>Attempt to download, copy, or replicate the e-book content in any unauthorized way.</li>
            <li>Use our website or services for any unlawful purpose or in any way that could damage, disable, or impair our website.</li>
          </ul>
        </motion.section>

        <motion.section 
          className="section-block"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <h2 className="section-title">5. <b>Refund policy</b></h2>
          <p className="section-text">
            Due to the nature of digital products, we do not offer refunds or exchanges on e-books once they have been purchased and accessed. If you encounter any issues with your purchase, please contact us within 7 days of purchase, and we will do our best to assist you.
          </p>
        </motion.section>

        <motion.section 
          className="section-block"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <h2 className="section-title">6. Account Termination</h2>
          <p className="section-text">
            We reserve the right to suspend or terminate your account and access to our services, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms. Upon termination, your right to use the services will immediately cease. If you wish to terminate your account, you may simply discontinue using the services.
          </p>
        </motion.section>

        <motion.section 
          className="section-block"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <h2 className="section-title">7. Limitation of Liability</h2>
          <p className="section-text">
            In no event shall Naveen Kewat E-books, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from 
          </p>
          <ul className="section-list">
            <li>your access to or use of or inability to access or use the service;</li>
            <li>any conduct or content of any third party on the service;</li>
            <li>any content obtained from the service; and</li>
            <li>unauthorized access, use, or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.</li>
          </ul>
        </motion.section>

        <motion.section 
          className="section-block"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <h2 className="section-title">8. Contact Information</h2>
          <p className="section-text">
            If you have any questions about these Terms, please contact us:
          </p>
          <ul className="section-list">
            <li>Email: naveenkewat1144@gmail.com</li>
            <li>Phone: +91 70730 36234</li>
            <li>Website: <Link href="/">www.themegahub.online</Link></li>
          </ul>
        </motion.section>

        <motion.section 
          className="section-block"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <h2 className="section-title">Why Reading T&C is Important?</h2>
          <p className="section-text">
            These Terms & Conditions are crucial for both you and Naveen Kewat E-books. They clearly define the rules for using our website and purchasing our e-books, protecting your rights as a customer and outlining our responsibilities. Understanding them helps ensure a smooth and fair experience for everyone.
          </p>
          <button className="got-it-button" onClick={()=>{alert("thank you for visiting and reading, Happy to see you here")}}>Got It!</button>
        </motion.section>
      </main>
    </div>
  );
};

export default TermsPage;