import mongoose from "mongoose";

const reviewer = new mongoose.Schema(
  {
    name: { type: String, required: true },
    avatar: { type: String, required: true },
    userId: { type: String, required: true },
    id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema({
  from: reviewer,
  rating: { type: Number, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
});

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  uploadDate: { type: String, required: true },
  pdf: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  reviews: [reviewSchema],
  oldPrice: { type: String, required: true },
  currentPrice: { type: String, required: true },
  sells: { type: String },
});

export default mongoose.models.Book || mongoose.model("Book", bookSchema);
