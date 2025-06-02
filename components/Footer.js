import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer>
        <div className="footer-content">
            <div className="footer-column">
                <h3>About Naveen Kewat</h3>
                <p>Naveen Kewat Books for Invest in your self</p>
            </div>
            <div className="footer-column">
                <h3>Quick Links</h3>
                <ul className="footer-links">
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/about" className="header-link">About</Link></li>
                    <li><a href="#">FAQ</a></li>
                </ul>
            </div>
            <div className="footer-column">
                <h3>Contact Us</h3>
                <p>Email: support@naveenkewatbooks.com</p>
                <p>Phone: +91 123 456 7890</p>
                <div className="footer-social">
                    <a href="#" className="social-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                    </a>
                    <a href="#" className="social-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                        </svg>
                    </a>
                    <a href="#" className="social-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
        <div className="footer-bottom">
            <p>© 2025 Naveen Kewat Books. All rights reserved.</p>
        </div>
    </footer>
  )
}

export default Footer