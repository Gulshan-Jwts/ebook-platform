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
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const isPanning = useRef(false);
  const initialDistance = useRef(null);
  const initialZoom = useRef(1);
  const initialPan = useRef({ x: 0, y: 0 });
  const lastTouchTime = useRef(0);

  // Save current page to localStorage whenever it changes

  useEffect(() => {
    const savedPage = localStorage.getItem(`book_${bookId}_currentPage`);
    if (savedPage && currentPage !== parseInt(savedPage, 10)) {
      setCurrentPage(parseInt(savedPage, 10));
    }
  }, [bookId]);

  // Fetch PDF chunks
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
      }
    };
  }, [bookId]);

  // Disable context menu
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // Calculate distance between two touches for pinch-to-zoom
  const getTouchDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Get midpoint between two touches
  const getTouchMidpoint = (touches) => {
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2,
    };
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      startX.current = e.touches[0].clientX;
      startY.current = e.touches[0].clientY;
      lastTouchTime.current = Date.now();
      isPanning.current = zoomLevel > 1 || !fitToScreen;
    } else if (e.touches.length === 2) {
      isPanning.current = false;
      initialDistance.current = getTouchDistance(e.touches);
      initialZoom.current = zoomLevel;
      initialPan.current = { ...panOffset };
      const midpoint = getTouchMidpoint(e.touches);
      const containerRect = containerRef.current.getBoundingClientRect();
      const relativeX = midpoint.x - containerRect.left;
      const relativeY = midpoint.y - containerRect.top;
      initialPan.current = {
        x: panOffset.x - relativeX,
        y: panOffset.y - relativeY,
      };
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1 && isPanning.current) {
      const dx = e.touches[0].clientX - startX.current;
      const dy = e.touches[0].clientY - startY.current;
      setPanOffset({ x: panOffset.x + dx, y: panOffset.y + dy });
      startX.current = e.touches[0].clientX;
      startY.current = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
      const currentDistance = getTouchDistance(e.touches);
      const scaleChange = currentDistance / initialDistance.current;
      const newZoom = Math.max(
        0.5,
        Math.min(initialZoom.current * scaleChange, 3)
      );
      setZoomLevel(newZoom);

      const midpoint = getTouchMidpoint(e.touches);
      const containerRect = containerRef.current.getBoundingClientRect();
      const relativeX = midpoint.x - containerRect.left;
      const relativeY = midpoint.y - containerRect.top;
      const newPanX =
        initialPan.current.x + relativeX * (1 - newZoom / initialZoom.current);
      const newPanY =
        initialPan.current.y + relativeY * (1 - newZoom / initialZoom.current);
      setPanOffset({ x: newPanX, y: newPanY });
    }
  };

  const handleTouchEnd = (e) => {
    if (e.changedTouches.length === 1 && !isPanning.current) {
      const diffX = startX.current - e.changedTouches[0].clientX;
      const diffTime = Date.now() - lastTouchTime.current;
      if (Math.abs(diffX) > 50 && diffTime < 300) {
        if (diffX > 0) goToNextPage();
        else goToPrevPage();
      }
    }
    isPanning.current = false;
    initialDistance.current = null;
  };

  const goToPrevPage = () => {
    localStorage.setItem(`book_${bookId}_currentPage`, Math.min(currentPage - 1, 1).toString());
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  const goToNextPage = () => {
    localStorage.setItem(`book_${bookId}_currentPage`, Math.min(currentPage + 1, numPages).toString());
    setCurrentPage((prev) => Math.min(prev + 1, numPages));
  };

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
                onClick={() => {
                  setFitToScreen(!fitToScreen);
                  setZoomLevel(1);
                  setPanOffset({ x: 0, y: 0 });
                }}
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
                  onChange={(e) => {
                    setZoomLevel(parseFloat(e.target.value));
                    setPanOffset({ x: 0, y: 0 });
                  }}
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
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={styles.pdfContainer}
          >
            <Document file={pdfBlobUrl} onLoadSuccess={onDocumentLoadSuccess}>
              <motion.div
                style={{
                  transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
                }}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
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
              </motion.div>
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
    gap: "2rem",
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
    maxHeight: "80vh",
    overflow: "hidden",
    padding: "10px",
    backgroundColor: "#1e1e1e",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    position: "relative",
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
