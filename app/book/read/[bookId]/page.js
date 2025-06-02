"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation.js";

const PDFViewer = dynamic(() => import("./pdfVIew.js"), { ssr: false });

const page = () => {

  const { bookId } = useParams();

  return <PDFViewer bookId={bookId} />
};

export default page;
