"use client";
// import { useData } from "@/components/DataContext";
import "@/stylesheets/about.css";
import Image from "next/image";
import Link from "next/link";

const Page = () => {
  const { isLoading } = false;

  return (
    <main className="about-page">
      <section className="about-section website-section">
        <h2 className="section-title">About Our Website</h2>
        {isLoading ? (
          <div className="skeleton skeleton-section"></div>
        ) : (
          <div className="section-content">
            <div className="section-text">
              <p>
                Our platform is a dynamic e-commerce solution for book
                enthusiasts, offering a seamless experience to browse, purchase,
                and read books. Powered by a single admin control panel, it
                ensures efficient management of inventory, orders, and user
                data. From this website we provide very premium books to you,
                for the sequrity you can read data only in builtin pdf viewer.
                The website is built with cutting-edge technologies to provide a
                fast, secure, and engaging user experience.
              </p>
              <p>Key technologies include:</p>
              <div className="tech-logos">
                <Image
                  src="/logos/razorpay.jpeg"
                  alt="Razorpay"
                  width={40}
                  height={40}
                  />
                <Image
                  src="/logos/mongodb.jpeg"
                  alt="MongoDB"
                  width={40}
                  height={40}
                  />
                <Image
                  src="/logos/react.jpeg"
                  alt="React"
                  width={40}
                  height={40}
                  />
                <Image
                  src="/logos/nodejs.jpeg"
                  alt="Node.js"
                  width={40}
                  height={40}
                  />
                <Image
                  src="/logos/framerMotion.jpeg"
                  alt="Framer Motion"
                  width={40}
                  height={40}
                />
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="about-section author-section">
        <h2 className="section-title">About the Author</h2>
        {isLoading ? (
          <div className="skeleton skeleton-section"></div>
        ) : (
          <div className="section-content">
            <div className="section-image">
              <Image
                src="/images/author.jpg"
                alt="Naveen Kewat"
                width={200}
                height={200}
                className="profile-image"
              />
            </div>
            <div className="section-text">
              <p>
                Naveen Kewat is a dedicated and hardworking author passionate
                about sharing his unique perspective through writing. With deep
                expertise in self-help, personality development, and psychology,
                Naveen crafts books that inspire and empower readers to
                transform their lives. His works resonate with those seeking
                personal growth and mental clarity, reflecting his commitment to
                making a positive impact.
              </p>
              <div className="contact-links">
                <Link
                  href="mailto:naveen@example.com"
                  className="contact-button"
                >
                  Email Naveen
                </Link>
                <Link
                  href="https://twitter.com/naveenkewat"
                  className="contact-button"
                >
                  Follow on Twitter
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="about-section developer-section">
        <h2 className="section-title">About the Developer</h2>
        {isLoading ? (
          <div className="skeleton skeleton-section"></div>
        ) : (
          <div className="section-content">
            <div className="section-image">
              <Image
                src="/images/developer.jpg"
                alt="Gulshan"
                width={200}
                height={200}
                className="profile-image"
              />
            </div>
            <div className="section-text">
              <p>
                Gulshan is the talented developer behind this website, bringing
                expertise in web development and backend technologies.
                Proficient in the MERN stack (MongoDB, Express.js, React,
                Node.js), Gulshan ensures a robust and scalable platform. His
                skills in animation libraries like Framer Motion and GSAP add a
                polished and interactive touch to the user experience, making
                the site both functional and visually appealing.
              </p>
              <div className="contact-links">
                <Link
                  href="mailto:gulshan@example.com"
                  className="contact-button"
                >
                  Email Gulshan
                </Link>
                <Link
                  href="https://github.com/gulshan"
                  className="contact-button"
                >
                  View GitHub
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default Page;
