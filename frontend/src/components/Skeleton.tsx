"use client";

import { motion } from "framer-motion";

export function SkeletonDashboard() {
  return (
    <div style={{ minHeight: "100vh", padding: "2rem", width: "100%" }}>
      {/* Header Skeleton */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
        <motion.div 
          style={{ width: "250px", height: "40px", background: "var(--glass-border)", borderRadius: "8px" }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <div style={{ display: "flex", gap: "1rem" }}>
          <motion.div 
            style={{ width: "100px", height: "40px", background: "var(--glass-border)", borderRadius: "20px" }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />
          <motion.div 
            style={{ width: "100px", height: "40px", background: "var(--glass-border)", borderRadius: "20px" }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          />
        </div>
      </header>

      {/* Grid Skeleton */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        
        {/* Left Column Skeleton */}
        <div>
          <motion.div 
            style={{ width: "200px", height: "30px", background: "var(--glass-border)", borderRadius: "4px", marginBottom: "1.5rem" }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
          {[1, 2, 3].map((item, i) => (
            <motion.div 
              key={item}
              className="glass-panel"
              style={{ padding: "1.5rem", height: "120px", marginBottom: "1rem" }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
            />
          ))}
        </div>

        {/* Right Column Skeleton */}
        <div>
          <motion.div 
            style={{ width: "200px", height: "30px", background: "var(--glass-border)", borderRadius: "4px", marginBottom: "1.5rem" }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          />
          <motion.div 
            className="glass-panel"
            style={{ padding: "1.5rem", minHeight: "400px" }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
        </div>

      </div>
    </div>
  );
}

export function SkeletonTaskPage() {
  return (
    <div style={{ minHeight: "100vh", padding: "2rem", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <motion.div 
        className="glass-panel" 
        style={{ width: "100%", maxWidth: "700px", padding: "3rem", borderColor: "var(--glass-border)" }}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div style={{ width: "60px", height: "20px", background: "var(--glass-border)", borderRadius: "4px", marginBottom: "2rem" }} />
        
        <motion.div style={{ width: "300px", height: "40px", background: "var(--glass-border)", borderRadius: "4px", marginBottom: "1rem" }} />
        <motion.div style={{ width: "100%", height: "20px", background: "var(--glass-border)", borderRadius: "4px", marginBottom: "0.5rem" }} />
        <motion.div style={{ width: "80%", height: "20px", background: "var(--glass-border)", borderRadius: "4px", marginBottom: "2rem" }} />
        
        <motion.div style={{ width: "150px", height: "20px", background: "var(--glass-border)", borderRadius: "4px", marginBottom: "1rem" }} />
        <motion.div style={{ width: "100%", height: "150px", background: "var(--glass-border)", borderRadius: "8px", marginBottom: "2rem" }} />
        
        <motion.div style={{ width: "150px", height: "45px", background: "var(--glass-border)", borderRadius: "8px" }} />
      </motion.div>
    </div>
  );
}
