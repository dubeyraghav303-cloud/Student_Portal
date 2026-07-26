"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function StartupAnimation({ children }: { children: React.ReactNode }) {
  const [showAnimation, setShowAnimation] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const lastSeenStr = localStorage.getItem("c_cell_startup_last_seen");
    const now = new Date().getTime();

    // Check if 24 hours (86400000 ms) have passed
    if (!lastSeenStr || (now - parseInt(lastSeenStr)) > 86400000) {
      setShowAnimation(true);
      localStorage.setItem("c_cell_startup_last_seen", now.toString());
      
      // Hide animation after 4 seconds
      setTimeout(() => {
        setShowAnimation(false);
      }, 4000);
    }
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <>
      <AnimatePresence>
        {showAnimation && (
          <motion.div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "#050510", // Dark futuristic background
              zIndex: 9999,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column"
            }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Grid Background Effect */}
            <div style={{
              position: "absolute",
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundImage: "linear-gradient(rgba(212, 175, 55, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 175, 55, 0.1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              opacity: 0.3
            }}></div>

            <motion.div
              style={{ display: "flex", alignItems: "center", zIndex: 10 }}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
            >
              <svg width="100" height="120" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* The "C" Path drawing animation */}
                <motion.path
                  d="M 90 20 C 50 -10, 10 20, 10 60 C 10 100, 50 130, 90 100"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#d4af37" />
                    <stop offset="100%" stopColor="#b8860b" />
                  </linearGradient>
                </defs>
              </svg>

              <motion.div
                initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                animate={{ opacity: 1, width: "auto", marginLeft: "10px" }}
                transition={{ delay: 1.5, duration: 0.8 }}
                style={{ overflow: "hidden" }}
              >
                <h1 style={{ color: "white", fontSize: "4rem", margin: 0, fontFamily: "'Inter', sans-serif", letterSpacing: "2px" }}>
                  -Cell
                </h1>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showAnimation && children}
    </>
  );
}
