"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { InterstitialLoader } from "@/components/InterstitialLoader";

export default function StudentLogin() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login/student', { identifier, password });
      localStorage.setItem('access_token', res.data.access_token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      router.push('/student/dashboard');
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
        style={{ padding: '3rem', width: '100%', maxWidth: '400px' }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Student Login</h2>
        {error && <div style={{ color: 'var(--error)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email or Enrollment No.</label>
            <input 
              type="text" 
              className="input-field" 
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Password</label>
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
            style={{ marginTop: '1rem' }}
            whileTap={{ scale: 0.98 }}
          >
            Sign In
          </motion.button>
        </form>
        
        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
          <span style={{ color: '#bcaecc' }}>Don't have an account? </span>
          <span 
            style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => router.push('/register/student')}
          >
            Register here
          </span>
        </div>
      </motion.div>
    </main>
    </>
  );
}
