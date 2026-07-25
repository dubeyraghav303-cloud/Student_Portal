"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function StudentRegister() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    enrollment_number: "",
    department: "",
    branch: "",
    year: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/register/student', {
        ...formData,
        year: parseInt(formData.year) || null
      });
      router.push('/login/student');
    } catch (err: any) {
      setError(err.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <motion.div 
        className="glass-panel"
        style={{ padding: '3rem', width: '100%', maxWidth: '500px' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Account</h2>
        {error && <div style={{ color: 'var(--error)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Full Name</label>
            <input type="text" name="name" className="input-field" onChange={handleChange} required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email</label>
            <input type="email" name="email" className="input-field" onChange={handleChange} required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Enrollment Number</label>
            <input type="text" name="enrollment_number" className="input-field" onChange={handleChange} required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Department</label>
            <select name="department" className="input-field" onChange={handleChange} required value={formData.department} style={{ appearance: 'auto', backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
              <option value="" disabled>Select Department</option>
              <option value="Technical department">Technical department</option>
              <option value="Media and content writing department">Media and content writing department</option>
              <option value="Operations and Management Department">Operations and Management Department</option>
              <option value="PR and Outreach Department">PR and Outreach Department</option>
              <option value="Graphic Design Department">Graphic Design Department</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Branch</label>
              <input type="text" name="branch" className="input-field" onChange={handleChange} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Year</label>
              <input type="number" name="year" className="input-field" onChange={handleChange} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Password</label>
            <input type="password" name="password" className="input-field" onChange={handleChange} required />
          </div>
          
          <motion.button type="submit" className="btn-primary" style={{ marginTop: '1rem' }} whileTap={{ scale: 0.98 }}>
            Register
          </motion.button>
        </form>
        
        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
          <span style={{ color: '#bcaecc' }}>Already have an account? </span>
          <span 
            style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => router.push('/login/student')}
          >
            Login here
          </span>
        </div>
      </motion.div>
    </main>
  );
}
