import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
  consumer: { type: String, required: true },
  amount: { type: String, required: true },
  product: { type: String, required: true },
  time: { type: String, required: true },
});

export default mongoose.models.Sale || mongoose.model("Sale", saleSchema);
