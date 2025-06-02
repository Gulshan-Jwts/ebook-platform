"use client";
import { useData } from "@/components/DataContext";
import Link from "next/link";
import { useEffect, useState } from "react";

const page = () => {
  const { dbUser, books, isLoading } = useData();
  const [purchasedBooks, setPurchasedBooks] = useState([]);

  useEffect(() => {
    if (dbUser === null || isLoading) {
      return;
    }
    const userPurchased = dbUser?.purchasedList || [];
    setPurchasedBooks(
      books.filter((book) => userPurchased.includes(book._id))
    );
  }, [isLoading, dbUser, books]);

  const skeletonBooks = Array(3).fill({});

  return (
    <main className="library-main">
      <h2 className="section-heading">Your Library</h2>
      {purchasedBooks.length > 0 || isLoading ? (
        <div className="books-grid">
          {(isLoading ? skeletonBooks : purchasedBooks).map((book, index) => (
            <div
              className="book-card"
              key={isLoading ? index : book._id}
            >
              <div className="book-thumbnail">
                {isLoading ? (
                  <div className="skeleton skeleton-thumbnail"></div>
                ) : (
                  <Link href={`/book/details/${book._id}`}>
                    <img
                      src={book.image || "/placeholder.jpg"}
                      alt={`${book.title} Book Cover`}
                    />
                  </Link>
                )}
              </div>
              <div className="book-info">
                {isLoading ? (
                  <>
                    <div className="skeleton skeleton-title"></div>
                    <div className="skeleton skeleton-button"></div>
                  </>
                ) : (
                  <>
                    <h3 className="book-title">{book.title}</h3>
                    <Link href={`/book/read/${book._id}`}>
                      <button className="buy-button">Read Now</button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-library">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="empty-library-icon"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <p className="empty-library-message">Your library is empty.</p>
          <Link href="/" className="cta-button">
            Explore Books
          </Link>
        </div>
      )}
    </main>
  );
};

export default page;