import "./globals.css";
import Navbar from "@/components/Navbar.js";
import "@/stylesheets/detail.css";
import "@/stylesheets/feed.css";
import "./globals.css";
import Footer from "@/components/Footer.js";
import SessionWrapper from "@/components/SessionWrapper";
import NextTopLoader from "nextjs-toploader";
import Script from "next/script";

export const metadata = {
  title: "Naveen Kewat - eBook Store",
  keywords:
    "Naveen Kewat, eBook Store, Self-Help, Books, Online Store, Buy Books",
  description:
    "Naveen Kewat's eBook Store offers a wide range of self-help books to empower and inspire you. Shop online for the best collection of books.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={`antialiased`}>
        <SessionWrapper>
          <NextTopLoader
            color="#f4c430"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
          />
          {/* <Navbar /> */}
          {children}
          {/* <Footer /> */}
        </SessionWrapper>
      </body>
    </html>
  );
}
