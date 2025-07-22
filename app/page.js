"use client";
import Hero from "@/components/feed/Hero.js";
import BooksGrid from "@/components/feed/BooksGrid.js";
import "@/stylesheets/feed.css";
import { useData } from "@/components/DataContext.js";
import { useEffect, useState } from "react";
import Image from "next/image";

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
  }, [books, getTopSellingBook]);

  return (
    <>
      <div className="min-h-screen bg-[#2e4057] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-lg shadow-lg p-6">
          <Image
            src="/newChhaka.jpg"
            alt="Sample Image"
            width={400}
            height={300}
            className="w-full h-64 object-cover rounded-md mb-4"
          />
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Chaaal haaaaaawawt!</h1>
            <p className="text-gray-200">
              Bada aaya website wala, pehle pese de mere.
            </p>
          </div>
        </div>
      </div>
      {/* <main>
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
      </main> */}
    </>
  );
};

export default Page;
