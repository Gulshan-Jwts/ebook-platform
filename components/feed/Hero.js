import Image from "next/image";
import Link from "next/link";


const Hero = ({ book, isLoading }) => {

  return (
    <section className="hero">
      <div className="hero-content">
        {isLoading ? (
          <>
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-tagline"></div>
            <div className="skeleton skeleton-button"></div>
          </>
        ) : (
          <>
            <h1>{book?.title || "Book Title"}</h1>
            <div className="hero-tagline">&ldquo;Grab it before it rules you! 👑&ldquo;</div>
            <Link href={`/book/details/${book?._id || "#"}`} className="cta-button">
              BUY NOW
            </Link>
          </>
        )}
      </div>
      <div className="featured-book">
        {isLoading ? (
          <div className="skeleton skeleton-book-cover"></div>
        ) : (
          <Link href={`/book/details/${book?._id || "#"}`}>
            <Image
              width={200}
              height={300}
              src={book?.image || "/placeholder.jpeg"}
              alt={`${book?.title || "Book"} Book Cover`}
              className="book-cover"
            />
          </Link>
        )}
        <div className="book-price">
          {isLoading ? (
            <>
              <div className="skeleton skeleton-price"></div>
              <div className="skeleton skeleton-price"></div>
            </>
          ) : (
            <>
              <span className="old-price">&#8377;{book?.oldPrice || "0.00"}</span>
              <span className="current-price">&#8377;{book?.currentPrice || "0.00"}</span>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;