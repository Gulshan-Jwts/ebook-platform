"use client";
import Hero from "@/components/feed/Hero.js";
import BooksGrid from "@/components/feed/BooksGrid.js";
import "@/stylesheets/feed.css";
import { useData } from "@/components/DataContext.js";
import { useEffect, useState } from "react";

const Page = () => {
  const { books, isLoading } = useData();
  const [hero, setHero] = useState(null);

  function getTopSellingBook() {
    if (!books || books.length === 0) return null;
    return books.reduce((top, current) => {
      const topSells = parseInt(top.sells) || 0;
      const currentSells = parseInt(current.sells) || 0;
      return currentSells > topSells ? current : top;
    }, books[0]);
  }

  useEffect(() => {
    setHero(getTopSellingBook());
  }, [books]);

  return (
    <>
      <main>
        {isLoading ? (
          <>
            <Hero isLoading={isLoading} />
            <h2 className="section-heading">Extra to Read</h2>
            <BooksGrid isLoading={isLoading} books={[]} />
          </>
        ) : (
          <>
            <Hero book={hero} isLoading={isLoading} />
            <h2 className="section-heading">Extra to Read</h2>
            <BooksGrid books={books} isLoading={isLoading} />
          </>
        )}
        {books && books.length === 0 && (
          <div className="no-books">No books to show</div>
        )}
      </main>
    </>
  );
};

export default Page;
