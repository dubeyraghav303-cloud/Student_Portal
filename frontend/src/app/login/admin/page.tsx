"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { InterstitialLoader } from "@/components/InterstitialLoader";

export default function AdminLogin() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login/admin', { identifier, password });
      localStorage.setItem('access_token', res.data.access_token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid credentials");
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <InterstitialLoader />}
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div 
        className="glass-panel"
        style={{ padding: '3rem', width: '100%', maxWidth: '400px', borderColor: 'rgba(242, 153, 74, 0.3)' }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--accent)' }}>Admin Portal</h2>
        {error && <div style={{ color: 'var(--error)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Admin ID or Email</label>
            <input 
              type="text" 
              className="input-field" 
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Secure Password</label>
            <input 
              type="password" 
              className="input-field" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <motion.button 
            type="submit" 
            className="btn-primary" 
            style={{ marginTop: '1rem', background: 'linear-gradient(135deg, var(--accent), #d17826)', boxShadow: '0 4px 14px rgba(242, 153, 74, 0.4)' }}
            whileTap={{ scale: 0.98 }}
          >
            Access Dashboard
          </motion.button>
        </form>
      </motion.div>
    </main>
    </>
  );
}
