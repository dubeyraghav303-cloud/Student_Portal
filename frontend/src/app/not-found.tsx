"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NotFound() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyItems: "center", justifyContent: "center", textAlign: "center", padding: "2rem" }}>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
      >
        <h1 style={{ 
          fontSize: "8rem", 
          margin: 0, 
          background: 'linear-gradient(135deg, var(--primary), #e63946)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent',
          lineHeight: 1
        }}>
          404
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        style={{ marginTop: "1rem" }}
      >
        <h2 style={{ fontSize: "2rem", color: "var(--accent)", marginBottom: "1rem" }}>
          Looks like you're lost in space.
        </h2>
        <p style={{ fontSize: "1.1rem", color: "var(--foreground)", opacity: 0.8, maxWidth: "500px", margin: "0 auto 2.5rem auto" }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <button 
            className="btn-primary" 
            onClick={() => router.back()}
            style={{ background: "transparent", color: "var(--foreground)", border: "1px solid var(--primary)" }}
          >
            Go Back
          </button>
          
          <Link href="/">
            <button className="btn-primary">
              Return Home
            </button>
          </Link>
        </div>
      </motion.div>

      {/* Floating Elements Background Effect */}
      <motion.div 
        style={{ position: "absolute", width: "50px", height: "50px", borderRadius: "50%", background: "var(--primary)", filter: "blur(40px)", zIndex: -1, top: "20%", left: "20%" }}
        animate={{ y: [0, 50, 0], x: [0, 30, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        style={{ position: "absolute", width: "100px", height: "100px", borderRadius: "50%", background: "#e63946", filter: "blur(60px)", zIndex: -1, bottom: "20%", right: "20%" }}
        animate={{ y: [0, -60, 0], x: [0, -40, 0], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </div>
  );
}
