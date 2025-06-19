"use client";
import { useParams } from "next/navigation";
import { useData } from "@/components/DataContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Review from "@/components/details/Review";
import Image from "next/image";
import { useSession } from "next-auth/react";

const Page = () => {
  const params = useParams();
    const { data: session } = useSession();

  const { books, dbUser } = useData();
  const bookId = params.bookId;

  const router = useRouter();

  const book = books.find((b) => b._id === bookId);
  const hadPurchased = dbUser?.purchasedList.includes(bookId);
  const isInCart = dbUser?.cartList.includes(bookId);

  const initiatePayment = async () => {
    if (hadPurchased) {
      router.push(`/book/read/${bookId}`);
      return;
    }

    if (!dbUser && !session) {
      router.push("/user/login");
      return;
    }

    const res = await fetch("/api/payment/createOrder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: book.currentPrice }),
    });

    const { order } = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Ebook Store",
      description: "Ebook purchase",
      order_id: order.id,
      handler: async (response) => {
        const res = await fetch(`/api/book/addToLib/${book._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookId,amount: book.currentPrice }),
        });
        const data = await res.json();
        alert(data.message);
      },
      theme: {
        color: "#2e4057",
      },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  };

  if (!book) return <p>Book not found.</p>;
  return (
    <>
      <section className="book-section">
        <div className="book-details">
          {book.image && (
            <Image
              width={200}
              height={300}
              src={book.image}
              alt="Book Cover"
              className="book-image"
            />
          )}
          <div className="book-info">
            <h1>{book.title}</h1>
            <div className="author">By {book.author}</div>
            <div className="rating">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{
                    color: i < averageRating(book.reviews) ? "#ffc107" : "#e0e0e0",
                  }}
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
              <span style={{ color: "#e0e0e0", fontSize: "1.1rem" }}>
                ({averageRating(book.reviews)} / 5)
              </span>
            </div>
            <div className="price">
              <span className="old-price">&#8377;{book.oldPrice}</span>
              <span className="current-price">&#8377;{book.currentPrice}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="description-section">
        <h2>Book Description</h2>
        <p>{book.description}</p>
      </section>

      <Review book={book} />

      <div className="action-buttons">
        <button onClick={initiatePayment} className="action-button buy-now">
          READ NOW
        </button>
        {!hadPurchased && (
          <>
            {isInCart ? (
              <button className="action-button add-to-cart">
                <Link href="/user/cart">View in cart</Link>
              </button>
            ) : (
              <button
                onClick={async () => {
                  if (!session) {
                    router.push("/");
                    return
                  }
                  const res = await fetch(`/api/book/addToCart/${book._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ bookId }),
                  });
                  const data = await res.json();
                  alert(data.message);
                }}
                className="action-button add-to-cart"
              >
                Add to Cart
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Page;

function averageRating(reviews) {
  if (!reviews.length) return "0.0";
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  return avg.toFixed(1);
}
