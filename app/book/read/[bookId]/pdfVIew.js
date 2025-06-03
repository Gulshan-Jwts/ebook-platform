"use client";

import { useEffect, useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { motion } from "framer-motion";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PDFViewerWithChunkedLoad({ bookId }) {
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [fitToScreen, setFitToScreen] = useState(true);
  const containerRef = useRef(null);
  const startX = useRef(0);

  useEffect(() => {
    const fetchPDFChunks = async () => {
      const chunkSize = 1024 * 1024;
      let start = 0;
      let chunks = [];
      let isDone = false;

      while (!isDone) {
        const end = start + chunkSize - 1;
        try {
          const res = await fetch(`/api/book/read/${bookId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Range: `bytes=${start}-${end}`,
            },
            body: JSON.stringify({ bookId }),
          });

          if (!res.ok) {
            const statusErrors = {
              401: "Unauthorized access",
              403: "Book not in library",
              404: "Book not found",
              400: "PDF URL missing",
            };
            setError(
              statusErrors[res.status] || `Failed to fetch chunk: ${res.status}`
            );
            break;
          }

          const chunk = await res.arrayBuffer();
          chunks.push(chunk);

          const contentRange = res.headers.get("Content-Range");
          const totalSize = contentRange
            ? parseInt(contentRange.split("/")[1])
            : 0;

          start = end + 1;
          if (start >= totalSize || res.status === 200) isDone = true;
        } catch (err) {
          console.error("Fetch error:", err);
          setError("Failed to load PDF");
          break;
        }
      }

      if (chunks.length > 0) {
        const fullBlob = new Blob(chunks, { type: "application/pdf" });
        setPdfBlobUrl(URL.createObjectURL(fullBlob));
      }
    };

    fetchPDFChunks();
    return () => {
    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl);
    }}
  }, [bookId]);

  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diff = startX.current - e.changedTouches[0].clientX;
    if (diff > 50) goToNextPage();
    else if (diff < -50) goToPrevPage();
  };

  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, numPages));

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div style={styles.container}>
      {error ? (
        <div style={styles.error}>{error}</div>
      ) : pdfBlobUrl ? (
        <>
          <div style={styles.toolbar}>
            <div style={styles.toolbarGroup}>
              <span style={styles.toggleLabel}>Fit Screen</span>
              <div
                style={{
                  ...styles.toggleSwitch,
                  backgroundColor: fitToScreen ? "#007bff" : "#ccc",
                }}
                onClick={() => setFitToScreen(!fitToScreen)}
              >
                <motion.div
                  style={styles.toggleCircle}
                  animate={{ x: fitToScreen ? "28px" : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              </div>
            </div>
            <div style={styles.toolbarGroup}>
              <div style={styles.sliderContainer}>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={zoomLevel}
                  onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                  disabled={fitToScreen}
                  style={styles.slider}
                />
              </div>
              <span style={styles.zoomValue}>
                {Math.round(zoomLevel * 100)}%
              </span>
            </div>
          </div>

          <div
            ref={containerRef}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={styles.pdfContainer}
          >
            <Document file={pdfBlobUrl} onLoadSuccess={onDocumentLoadSuccess}>
              <div
              >
                <Page
                  pageNumber={currentPage}
                  width={
                    fitToScreen
                      ? window.innerWidth - (window.innerWidth / 100) * 20
                      : undefined
                  }
                  scale={fitToScreen ? undefined : zoomLevel}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  style={styles.page}
                />
              </div>
            </Document>
          </div>

          <div style={styles.navBar}>
            <button
              style={{
                ...styles.button,
                ...(currentPage === 1 ? styles.buttonDisabled : {}),
              }}
              onClick={goToPrevPage}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span style={styles.pageInfo}>
              Page {currentPage} of {numPages}
            </span>
            <button
              style={{
                ...styles.button,
                ...(currentPage === numPages ? styles.buttonDisabled : {}),
              }}
              onClick={goToNextPage}
              disabled={currentPage === numPages}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div style={styles.loading}>Loading PDF in chunks...</div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#252627",
    padding: "20px",
    display: "flex",
    borderRadius: "10px",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "'Inter', sans-serif",
  },
  toolbar: {
    position: "sticky",
    top: 0,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "2REM",
    backgroundColor: "#252627",
    borderRadius: "8px",
    padding: "10px 20px",
    boxShadow: "0 2px 4px rgba(6, 6, 7, 0.26)",
    zIndex: 10,
  },
  toolbarGroup: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  toggleLabel: {
    fontSize: "14px",
    color: "#ccc",
    fontWeight: "500",
  },
  toggleSwitch: {
    position: "relative",
    minWidth: "50px",
    maxWidth: "50px",
    height: "22px",
    borderRadius: "20px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  toggleCircle: {
    width: "16px",
    height: "16px",
    backgroundColor: "#fff",
    borderRadius: "50%",
    position: "absolute",
    top: "3px",
    left: "3px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
  },
  zoomLabel: {
    fontSize: "14px",
    color: "#ccc",
    fontWeight: "500",
  },
  sliderContainer: {
    position: "relative",
    width: "120px",
    background: "transparent",
  },
  slider: {
    width: "100%",
    height: "8px",
    background: "#36393b",
    borderRadius: "4px",
    outline: "none",
    appearance: "none",
    cursor: "pointer",
    opacity: 1,
    transition: "opacity 0.2s",
  },
  "slider:disabled": {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  "slider::-webkit-slider-thumb": {
    appearance: "none",
    width: "16px",
    height: "16px",
    background: "#2e4057",
    borderRadius: "50%",
    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  "slider::-webkit-slider-thumb:hover": {
    background: "#1c2526",
  },
  "slider::-moz-range-thumb": {
    width: "16px",
    height: "16px",
    background: "#2e4057",
    borderRadius: "50%",
    border: "2px solid #fff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  "slider::-moz-range-thumb:hover": {
    background: "#1c2526",
  },
  "slider:disabled::-webkit-slider-thumb": {
    cursor: "not-allowed",
    background: "#36393b",
  },
  "slider:disabled::-moz-range-thumb": {
    cursor: "not-allowed",
    background: "#36393b",
  },
  zoomValue: {
    fontSize: "14px",
    color: "#ccc",
    fontWeight: "500",
    minWidth: "40px",
  },
  pdfContainer: {
    margin: "2rem 0",
    display: "flex",
    justifyContent: "center",
    width: "80vw",
    MaxHeight: "80vh",
    overflowY: "auto",
    padding: "10px",
    backgroundColor: "#1e1e1e",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  page: {
    transition: "transform 0.3s ease",
  },
  navBar: {
    position: "fixed",
    top: "calc(100svh - 10vh)",
    width: "100%",
    height: "10vh",
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    backgroundColor: "#36393b",
    padding: "10px 20px",
    boxShadow: "0 -2px 4px rgba(0,0,0,0.1)",
  },
  button: {
    padding: "8px 16px",
    backgroundColor: "#2e4057",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background-color 0.2s, transform 0.1s",
  },
  "button:hover": {
    backgroundColor: "#1c2526",
    transform: "scale(1.05)",
  },
  "button:active": {
    transform: "scale(0.95)",
  },
  buttonDisabled: {
    backgroundColor: "#404446",
    cursor: "not-allowed",
  },
  "buttonDisabled:hover": {
    backgroundColor: "#404446",
    transform: "none",
  },
  pageInfo: {
    fontSize: "14px",
    color: "#d3cec7",
    fontWeight: "500",
  },
  error: {
    color: "#d32f2f",
    fontSize: "16px",
    fontWeight: "600",
    padding: "20px",
    backgroundColor: "#ffebee",
    borderRadius: "4px",
  },
  loading: {
    fontSize: "16px",
    color: "#333",
    padding: "20px",
    backgroundColor: "#e0f7fa",
    borderRadius: "4px",
  },
};
