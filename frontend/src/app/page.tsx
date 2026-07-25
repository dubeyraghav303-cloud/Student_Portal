"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import ThreeBackground from "@/components/ThreeBackground";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <ThreeBackground />
      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          className="glass-panel"
          style={{ padding: '3rem', textAlign: 'center', maxWidth: '600px', margin: '0 20px' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            style={{ marginBottom: '1rem', background: 'linear-gradient(to right, #f2e6e6, #e63946)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            C-Cell, RGPV
          </motion.h1>

          <motion.p
            style={{ fontSize: '1.2rem', marginBottom: '2.5rem', color: '#bcaecc', lineHeight: 1.6 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Manage tasks, track submissions, and collaborate seamlessly in one dashboard.
          </motion.p>

          <motion.div
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <button className="btn-primary" onClick={() => router.push('/login/student')}>
              Student Login
            </button>
            <button
              className="btn-primary"
              style={{ background: 'transparent', color: 'var(--foreground)', border: '1px solid var(--primary)', boxShadow: 'none' }}
              onClick={() => router.push('/login/admin')}
            >
              Admin Login
            </button>
          </motion.div>
        </motion.div>
      </main>
    </>
  );
}
