import mongoose from "mongoose";
import clientPromise from "@/lib/mongodb";

const connectMongo = async () => {
  if (mongoose.connections[0].readyState === 1) return;

  const client = await clientPromise;
  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: "ebook",
    tls: true,
    tlsAllowInvalidCertificates: true,
  });
};

export default connectMongo;
