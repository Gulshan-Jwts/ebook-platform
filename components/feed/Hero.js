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
            <div className="hero-tagline">&quot;Grab it before it rules you! 👑&quot;</div>
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
              src={book?.image || "/placeholder.jpg"}
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
              <span className="old-price">{book?.oldPrice || "0.00"}</span>
              <span className="current-price">{book?.currentPrice || "0.00"}</span>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;