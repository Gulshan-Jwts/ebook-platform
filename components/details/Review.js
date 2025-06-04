"use client";
import { useData } from "@/components/DataContext";
import Image from "next/image";
import { useState } from "react";

const Review = ({ book }) => {
  const { dbUser, isLoading } = useData();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [stars, setStars] = useState(0);
  const [hoverStars, setHoverStars] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dbUser) {
      setError("You must be logged in to submit a review.");
      return;
    }
    if (!title || !message || stars === 0) {
      setError("Please fill out all fields and select a star rating.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/user/review/${book._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: dbUser._id,
          bookId: book._bookid,
          title,
          message,
          stars,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("Review submitted successfully!");
        setTitle("");
        setMessage("");
        setStars(0);
      } else {
        setError(data.message || "Failed to submit review.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="book-reviews">
      {dbUser?.purchasedList.includes(book._id) &&
        (!book?.reviews.some(
          (elem) => elem.from.userId === dbUser.username
        ) && (
          <section className="reviews-form-section">
            <h2 className="reviews-heading">Write a Review</h2>
            {isLoading ? (
              <div className="skeleton skeleton-form"></div>
            ) : !dbUser ? (
              <p className="reviews-form-message">
                Please <a href="/login">Log in</a> to submit a review.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="reviews-form">
                <div className="form-group">
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`star ${
                          star <= (hoverStars || stars) ? "filled" : ""
                        }`}
                        onClick={() => setStars(star)}
                        onMouseEnter={() => setHoverStars(star)}
                        onTouchStart={() => setHoverStars(star)}
                        onTouchEnd={() => setHoverStars(0)}
                        onMouseLeave={() => setHoverStars(0)}
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill={
                          star <= (hoverStars || stars) ? "#ee9b00" : "none"
                        }
                        stroke={
                          star <= (hoverStars || stars) ? "none" : "#005f73"
                        }
                        strokeWidth="2"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <input
                    id="review-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter review title"
                    disabled={submitting}
                  />
                </div>
                <div className="form-group">
                  <textarea
                    id="review-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows="5"
                    disabled={submitting}
                  ></textarea>
                </div>
                {error && <p className="reviews-form-error">{error}</p>}
                {success && <p className="reviews-form-success">{success}</p>}
                <button
                  type="submit"
                  className="submit-button"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            )}
          </section>
        ))}

      <section className="reviews-display-section">
        <h2 className="reviews-heading">Reader Reviews</h2>
        {isLoading ? (
          <div className="skeleton skeleton-reviews"></div>
        ) : !book?.reviews || book.reviews.length === 0 ? (
          <p className="no-reviews">No reviews available for this book.</p>
        ) : (
          <div className="reviews-container">
            {book.reviews.map((review) => (
              <div className="review-card" key={review._id}>
                <div className="review-header">
                  <Image
                  width={50}
                  height={50}
                    src={review.from.avatar || "/placeholder.jpeg"}
                    alt="Reviewer Avatar"
                    className="reviewer-avatar"
                  />
                  <div className="reviewer-info">
                    <h4>{review.from.name || "Anonymous"}</h4>
                    <span>Verified Buyer</span>
                  </div>
                </div>
                <div className="rating">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill={i < review.rating ? "#ee9b00" : "none"}
                      stroke={i < review.rating ? "none" : "#005f73"}
                      strokeWidth="2"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                {review.title && <p className="review-title">{review.title}</p>}
                <p className="review-text">&ldquo;{review.message}&ldquo;</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Review;
