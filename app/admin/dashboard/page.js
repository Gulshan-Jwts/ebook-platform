"use client";
import React, { useState, useEffect } from "react";
import { useTopLoader } from "nextjs-toploader";
import "@/stylesheets/adminDashboard.css";
import "@uploadthing/react/styles.css";
import { UploadButton } from "@uploadthing/react";
import { useData } from "@/components/DataContext";
import { motion, AnimatePresence } from "framer-motion";

const Page = () => {
  const { books } = useData();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState("");
  const [sales, setSales] = useState({});
  const { start, done } = useTopLoader();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    oldPrice: "",
    currentPrice: "",
    description: "",
    pdfUrl: "",
    imageUrl: "",
  });
  const [editBookId, setEditBookId] = useState(null);
  const [deleteBookId, setDeleteBookId] = useState(null);
  const [imageUploadStatus, setImageUploadStatus] = useState("");
  const [bookUploadStatus, setBookUploadStatus] = useState("");

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    setError("");
    start();

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        setFormData({
          title: "",
          author: "",
          category: "",
          oldPrice: "",
          currentPrice: "",
          description: "",
        });
      } else {
        setError(data.error || "Failed to upload book");
      }
    } catch (err) {
      setError("Server error");
    } finally {
      done();
    }
  };

  const handleEditClick = (book) => {
    setEditBookId(book._id);
    setFormData({
      title: book.title,
      author: book.author,
      oldPrice: book.oldPrice,
      currentPrice: book.currentPrice,
      description: book.description,
      pdfUrl: book.pdfUrl,
      imageUrl: book.imageUrl,
    });
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();
    setError("");
    start();

    try {
      const response = await fetch(`/api/admin/update/${editBookId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        setEditBookId(null);
        setFormData({
          title: "",
          author: "",
          category: "",
          oldPrice: "",
          currentPrice: "",
          description: "",
        });
      } else {
        setError(data.error || "Failed to update book");
      }
    } catch (err) {
      alert(err)
      setError("something went wrong from the server");
    } finally {
      done();
    }
  };

  const handleDeleteClick = (book) => {
    setDeleteBookId(book._id);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteBookId(null);
  };

  const handleConfirmDelete = async () => {
    start();
    try {
      const response = await fetch(`/api/admin/delete/${deleteBookId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setShowDeleteModal(false);
        setDeleteBookId(null);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete book");
      }
    } catch (err) {
      setError("Server error");
    } finally {
      done();
    }
  };

  useEffect(() => {
    async function getSale() {
      start();
      try {
        const response = await fetch("/api/book/getSale", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (response.ok) {
          setSales(data);
        }
      } catch (err) {
        setError("Failed to fetch sales data");
      } finally {
        done();
      }
    }
    getSale();
  },);

  const expandVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: "auto", opacity: 1 },
  };
  const [openBookId, setOpenBookId] = useState(null);

  return (
    <div className="admin-container">
      {showSuccess && (
        <div className="success-message">
          {editBookId ? "Book updated successfully!" : "Book added successfully!"}
        </div>
      )}
      {error && <div className="error-message">{error}</div>}

      <section className="add-book-section">
        <h3>{editBookId ? "Edit Book" : "Add New Book"}</h3>
        <form onSubmit={editBookId ? handleUpdateBook : handleAddBook} className="form">
          <div className="form-group">
            <label htmlFor="title">Book Title</label>
            <input
              type="text"
              id="title"
              placeholder="Enter book title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="author">Author Name</label>
            <input
              type="text"
              id="author"
              placeholder="Enter author name"
              value={formData.author}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="oldPrice">Old Price (₹)</label>
            <input
              type="number"
              id="oldPrice"
              placeholder="Enter old price"
              value={formData.oldPrice}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="currentPrice">Current Price (₹)</label>
            <input
              type="number"
              id="currentPrice"
              placeholder="Enter current price"
              value={formData.currentPrice}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Book Cover Image</label>
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                if (res) {
                  setFormData((prev) => ({
                    ...prev,
                    imageUrl: res[0].ufsUrl,
                  }));
                  setImageUploadStatus(`Image uploaded`);
                }
              }}
              onUploadError={(error) => {
                setImageUploadStatus(`Image upload failed: ${error.message}`);
              }}
            />
            <p>{imageUploadStatus}</p>
          </div>
          <div className="form-group">
            <label>Book File (PDF)</label>
            <UploadButton
              endpoint="pdfUploader"
              onClientUploadComplete={(res) => {
                if (res) {
                  setFormData((prev) => ({
                    ...prev,
                    pdfUrl: res[0].ufsUrl,
                  }));
                  setBookUploadStatus(`PDF uploaded`);
                }
              }}
              onUploadError={(error) => {
                setBookUploadStatus(`PDF upload failed: ${error.message}`);
              }}
            />
            <p>{bookUploadStatus}</p>
          </div>
          <div className="form-group">
            <label htmlFor="description">Book Description</label>
            <textarea
              id="description"
              placeholder="Enter book description"
              value={formData.description}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          <button type="submit" className="buy-button add-book-button">
            {editBookId ? "Update Book" : "Add Book"}
          </button>
          {editBookId && (
            <button
              type="button"
              className="cancel-button"
              onClick={() => {
                setEditBookId(null);
                setFormData({
                  title: "",
                  author: "",
                  category: "",
                  oldPrice: "",
                  currentPrice: "",
                  description: "",
                });
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </section>

      <section className="books-data-section">
        <h3>Books Data</h3>
        <div className="stats">
          <div className="stat-item">
            <h4>Total</h4>
            <p>{books.length}</p>
          </div>
          <div className="stat-item">
            <h4>Sales</h4>
            <p>{sales.totalSales || 0}</p>
          </div>
          <div className="stat-item">
            <h4>Revenue</h4>
            <p>{sales.totalRevenue || 0}</p>
          </div>
        </div>

        <div className="book-list">
          {books.map((book, index) => {
            const isOpen = openBookId === index;

            return (
              <div className="book-item" key={index}>
                <div
                  className="book-summary"
                  onClick={() => setOpenBookId(isOpen ? null : index)}
                >
                  <p>
                    <b>{book.title}</b> by <i> {book.author}</i> at{" "}
                    <b>{book.uploadDate}</b>
                  </p>
                </div>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="book-details"
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={expandVariants}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="book-prices">
                        <div className="book-detail-price">
                          <strong>Old Price:</strong> ₹{book.oldPrice}
                        </div>
                        <div className="book-detail-price">
                          <strong>Current Price:</strong> ₹{book.currentPrice}
                        </div>
                      </div>
                      <div className="book-detail-description">
                        <strong>Description:</strong> {book.description}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="book-actions">
                  <button
                    className="edit-button"
                    onClick={() => handleEditClick(book)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteClick(book)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Deletion</h3>
            <p>
              Are you sure you want to delete this book? This action cannot be
              undone.
            </p>
            <div className="modal-actions">
              <button className="cancel-button" onClick={handleCancelDelete}>
                Cancel
              </button>
              <button
                className="delete-confirm-button"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;