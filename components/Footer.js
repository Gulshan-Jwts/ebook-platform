import Link from "next/link";
import React from "react";

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
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/about" className="header-link">
                About
              </Link>
            </li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Contact Us</h3>
          <p>Email: naveenkewat1144@gmail.com</p>
          <p>Email: anjaanjoker2025@gmail.com</p>
          <p>Phone: +91 70730 36234</p>
          <div className="footer-social">
            <a
              href="https://www.youtube.com/@thehiddengameofpower"
              target="_blank"
              className="social-icon"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 50 50"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M 44.898438 14.5 C 44.5 12.300781 42.601563 10.699219 40.398438 10.199219 C 37.101563 9.5 31 9 24.398438 9 C 17.800781 9 11.601563 9.5 8.300781 10.199219 C 6.101563 10.699219 4.199219 12.199219 3.800781 14.5 C 3.398438 17 3 20.5 3 25 C 3 29.5 3.398438 33 3.898438 35.5 C 4.300781 37.699219 6.199219 39.300781 8.398438 39.800781 C 11.898438 40.5 17.898438 41 24.5 41 C 31.101563 41 37.101563 40.5 40.601563 39.800781 C 42.800781 39.300781 44.699219 37.800781 45.101563 35.5 C 45.5 33 46 29.398438 46.101563 25 C 45.898438 20.5 45.398438 17 44.898438 14.5 Z M 19 32 L 19 18 L 31.199219 25 Z"></path>
              </svg>
            </a>
            <a
              href="https://www.instagram.com/anjaan__2025?igsh=cjdsbDJra3UzdDNn"
              target="_blank"
              className="social-icon"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
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
  );
};

export default Footer;
