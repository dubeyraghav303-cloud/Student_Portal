"use client";

import { motion } from "framer-motion";

export function InterstitialLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        overflow: "hidden"
      }}
    >
      {/* Deep Spiral/Gradients (good_idea.mp4 inspired) */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          width: "150vw",
          height: "150vw",
          background: "conic-gradient(from 0deg, rgba(212,175,55,0.1), rgba(184,134,11,0.2), rgba(230,57,70,0.1), rgba(42,157,143,0.1), rgba(212,175,55,0.1))",
          borderRadius: "50%",
          filter: "blur(60px)",
          opacity: 0.7
        }}
      />
      
      {/* Morphing Center Orb */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 0.9, 1.1, 1],
          borderRadius: ["50%", "40% 60%", "60% 40%", "45% 55%", "50%"]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: "120px",
          height: "120px",
          background: "linear-gradient(135deg, var(--primary), var(--accent))",
          boxShadow: "0 0 40px rgba(212, 175, 55, 0.6), inset 0 0 20px rgba(255,255,255,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10
        }}
      >
        <motion.div
          animate={{ scale: [1, 0.5, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: "20px", height: "20px", background: "white", borderRadius: "50%", boxShadow: "0 0 10px white" }}
        />
      </motion.div>
    </motion.div>
  );
}
