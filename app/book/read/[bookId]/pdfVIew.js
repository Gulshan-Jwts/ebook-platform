// components/PDFViewerWithChunkedLoad.js
"use client";

import { useEffect, useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { motion, AnimatePresence } from "framer-motion";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PDFViewerWithChunkedLoad({ bookId }) {
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [fitToScreen, setFitToScreen] = useState(true);
  const [prevPage, setPrevPage] = useState(2);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef(null);
  const lastSwipeTime = useRef(0);

  // Save current page to localStorage
  useEffect(() => {
    const savedPage = localStorage.getItem(`book_${bookId}_currentPage`);
    if (savedPage && currentPage !== parseInt(savedPage, 10)) {
      setCurrentPage(parseInt(savedPage, 10));
    }
  }, [bookId]);

  async function cachePDF(bookId, blob) {
    const cache = await caches.open("ebook-cache");
    const response = new Response(blob, {
      headers: { "Content-Type": "application/pdf" },
    });
    await cache.put(`/cached/${bookId}.pdf`, response);
  }

  async function loadPDF(bookId) {
    const cache = await caches.open("ebook-cache");
    const response = await cache.match(`/cached/${bookId}.pdf`);
    if (!response) return null;
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }

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
        await cachePDF(bookId, fullBlob);
        setPdfBlobUrl(URL.createObjectURL(fullBlob));
      }
    };

    const init = async () => {
      const cachedUrl = await loadPDF(bookId);
      if (cachedUrl) {
        setPdfBlobUrl(cachedUrl);
      } else {
        fetchPDFChunks();
      }
    };
    init();
    return () => {
      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
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

  const goToPrevPage = () => {
    const newPage = Math.max(currentPage - 1, 1);
    if (newPage !== currentPage) {
      localStorage.setItem(`book_${bookId}_currentPage`, newPage.toString());
      handlePageChange(newPage);
    }
  };

  const goToNextPage = () => {
    const newPage = Math.min(currentPage + 1, numPages);
    if (newPage !== currentPage) {
      localStorage.setItem(`book_${bookId}_currentPage`, newPage.toString());
      handlePageChange(newPage);
    }
  };

  const handlePageChange = (newPage) => {
    if (isAnimating || newPage === currentPage) return;

    setIsAnimating(true);
    setPrevPage(currentPage);
    setCurrentPage(newPage);
  };

  // Handle swipe for page change, prevent during zoom/pan
  const handleSwipe = ({ event, direction: [dx], velocity, distance }) => {
    if (zoomLevel > 1 || Date.now() - lastSwipeTime.current < 300) return;
    if (fitToScreen) {
      if (distance > 50 && velocity > 0.5) {
        if (dx > 0) goToNextPage();
        else goToPrevPage();
        lastSwipeTime.current = Date.now();
      }
    }
  };

  const pageVariants = {
    initial: {
      opacity: 0,
      rotateY: -90,
      scale: 0.95,
      transformOrigin: "right",
    },
    animate: { opacity: 1, rotateY: 0, scale: 1, transformOrigin: "right" },
    exit: { opacity: 0.8, rotateY: -90, scale: 0.95, transformOrigin: "left" },
  };

  return (
    <div style={styles.container}>
      {error ? (
        <div style={styles.error}>{error}</div>
      ) : pdfBlobUrl ? (
        <>
          <div style={styles.toolbar}>
            <div style={styles.toolbarGroup}>
              <span style={styles.toggleLabel}>Fit to Screen</span>
              <div
                style={{
                  ...styles.toggleSwitch,
                  backgroundColor: fitToScreen ? "#007bff" : "#ccc",
                }}
                onClick={() => {
                  setFitToScreen(!fitToScreen);
                  setZoomLevel(1);
                }}
              >
                <motion.div
                  style={styles.toggleCircle}
                  animate={{ x: fitToScreen ? 20 : 0 }}
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

          <div ref={containerRef} style={styles.pdfContainer}>
            <TransformWrapper
              initialScale={fitToScreen ? 1 : zoomLevel}
              minScale={0.5}
              maxScale={3}
              disabled={fitToScreen}
              onZoom={(ref) => setZoomLevel(ref.state.scale)}
              onPanningStart={() => (lastSwipeTime.current = Date.now())}
              onSwipe={handleSwipe}
              limitToBounds={true}
              panning={{ disabled: fitToScreen || zoomLevel <= 1 }}
              pinch={{ disabled: fitToScreen }}
              wheel={{ disabled: false }}
            >
              <TransformComponent>
                <Document
                  file={pdfBlobUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentPage}
                      style={{ perspective: "1000px" }}
                    >
                      <motion.div
                        key={`current-${currentPage}`}
                        variants={pageVariants}
                        initial="animate"
                      >
                        <Page
                          pageNumber={currentPage}
                          width={
                            fitToScreen
                              ? window.innerWidth -
                                (window.innerWidth / 100) * 20
                              : undefined
                          }
                          scale={fitToScreen ? undefined : zoomLevel}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                          style={styles.page}
                        />
                      </motion.div>
                      {prevPage && (
                        <motion.div
                          key={`prev-${prevPage}`}
                          initial="animate"
                          animate="exit"
                          exit="exit"
                          variants={pageVariants}
                          transition={{ duration: 0.6 }}
                          style={{ position: "absolute", top: 0 }}
                          onAnimationComplete={() => {
                            setPrevPage(null);
                            setIsAnimating(false);
                          }}
                        >
                          <Page
                            pageNumber={currentPage}
                            width={
                              fitToScreen
                                ? window.innerWidth -
                                  (window.innerWidth / 100) * 20
                                : undefined
                            }
                            scale={fitToScreen ? undefined : zoomLevel}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            style={styles.page}
                          />
                        </motion.div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </Document>
              </TransformComponent>
            </TransformWrapper>
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
    width: "90vw",
    height: "fit-content",
    maxHeight: "80vh",
    overflow: "hidden",
    overflowY: "auto",
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
