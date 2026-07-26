"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NotFound() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--background)", overflow: "hidden", position: "relative" }}>
      
      {/* Background Orbs for Atmosphere */}
      <motion.div 
        style={{ position: "absolute", top: "10%", left: "20%", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(0,0,0,0) 70%)", filter: "blur(40px)" }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        style={{ position: "absolute", bottom: "10%", right: "20%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(184,134,11,0.1) 0%, rgba(0,0,0,0) 70%)", filter: "blur(60px)" }}
        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* SVG Diagnostic Robot Animation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ marginBottom: "2rem", display: "flex", justifyContent: "center", alignItems: "center", height: "250px" }}
      >
        <svg width="300" height="250" viewBox="0 0 300 250" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Monitor Outline */}
          <rect x="50" y="40" width="200" height="140" rx="10" stroke="var(--primary)" strokeWidth="4" fill="var(--glass-bg)" />
          <rect x="50" y="40" width="200" height="30" rx="10" fill="var(--primary)" />
          <circle cx="70" cy="55" r="5" fill="var(--background)" />
          <circle cx="90" cy="55" r="5" fill="var(--background)" />
          <circle cx="110" cy="55" r="5" fill="var(--background)" />
          <text x="130" y="60" fill="var(--background)" fontSize="14" fontWeight="bold" fontFamily="monospace">DIAGNOSTIC...</text>
          
          {/* Heartbeat Line Animation */}
          <motion.path
            d="M 60 140 L 90 140 L 105 110 L 125 170 L 140 130 L 155 150 L 170 140 L 240 140"
            stroke="var(--error)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Blinking Cross */}
          <motion.g
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <rect x="200" y="80" width="10" height="30" fill="var(--success)" rx="2" />
            <rect x="190" y="90" width="30" height="10" fill="var(--success)" rx="2" />
          </motion.g>

          {/* Scanning Line */}
          <motion.line
            x1="50" y1="70" x2="250" y2="70"
            stroke="rgba(42, 157, 143, 0.5)"
            strokeWidth="2"
            animate={{ y: [70, 175, 70] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ textAlign: "center", zIndex: 10 }}
      >
        <h1 style={{ fontSize: "6rem", margin: 0, background: "linear-gradient(135deg, var(--primary), var(--accent))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          404
        </h1>
        <h2 style={{ fontSize: "1.5rem", marginTop: "-10px", color: "var(--foreground)", opacity: 0.8 }}>
          Diagnostic Failed. Page Not Found.
        </h2>
        <p style={{ maxWidth: "400px", color: "var(--foreground)", opacity: 0.6, marginBottom: "2rem" }}>
          The requested system module could not be located. It might have been removed, renamed, or temporarily unavailable.
        </p>

        <motion.button 
          onClick={() => router.push("/")}
          className="btn-primary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ fontSize: "1.1rem", padding: "14px 32px", border: "none", background: "linear-gradient(135deg, var(--primary), var(--accent))", color: "white", borderRadius: "8px", cursor: "pointer" }}
        >
          Return to Base
        </motion.button>
      </motion.div>
    </div>
  );
}
