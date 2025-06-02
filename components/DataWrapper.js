import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { DataContext } from "./DataContext";

const DataWrapper = ({ children }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const [isLogedIn, setIsLogedIn] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        try {
          const res = await fetch("/api/user/getUser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: session.user.email }),
          });
          const data = await res.json();
          setUser(data.user);
        } catch (err) {
          console.error("User fetch failed:", err);
        }
      }
    };
    if (status === "authenticated") {
      fetchUserData();
      setIsLogedIn(true);
    }else {
      setIsLogedIn(false);
    }
  }, [status,session?.user]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("/api/book/getBooks", {
          method: "GET",
        });
        const data = await res.json();
        setBooks(data.books || []);
      } catch (err) {
        console.error("Books fetch failed:", err);
      }
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    if (books && user || !isLogedIn) {
      console.log("hit")
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [books, user,isLogedIn]);

  return (
    <DataContext.Provider value={{ dbUser: user, books, isLoading }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataWrapper;
