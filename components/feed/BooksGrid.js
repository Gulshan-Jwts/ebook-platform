import Image from "next/image";
import Link from "next/link";
import React from "react";

const BooksGrid = ({ books, isLoading }) => {
  const skeletonBooks = Array(3).fill({});

  return (
    <div className="books-grid">
      {(isLoading ? skeletonBooks : Object.keys(books)).map((key, index) => (
        <div className="book-card" key={isLoading ? index : books[key]._id}>
          <div className="book-thumbnail">
            {isLoading ? (
              <div className="skeleton skeleton-thumbnail"></div>
            ) : (
              <Link href={`/book/details/${books[key]._id}`}>
                <Image
                  width={200}
                  height={300}
                  src={books[key].image || "/placeholder.jpeg"}
                  alt={`${books[key].title} Book Cover`}
                />
              </Link>
            )}
          </div>
          <div className="book-info">
            {isLoading ? (
              <>
                <div className="skeleton skeleton-title"></div>
                <div className="skeleton skeleton-price-grid"></div>
                <div className="skeleton skeleton-button"></div>
              </>
            ) : (
              <>
                <h3 className="book-title">{books[key].title}</h3>
                <div className="book-price-grid">
                  <span className="old-price">&#8377;{books[key].oldPrice}</span>
                  <span className="current-price">&#8377;{books[key].currentPrice}</span>
                </div>
                <Link href={`/book/details/${books[key]._id}`}>
                  <button className="buy-button">BUY NOW</button>
                </Link>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BooksGrid;