"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { SkeletonTaskPage } from "@/components/Skeleton";

export default function TaskSubmissionPage() {
  const router = useRouter();
  const { taskId } = useParams();
  
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [submissionContent, setSubmissionContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await api.get("/tasks/");
        const found = res.data.find((t: any) => t.id === taskId);
        setTask(found);
      } catch (err) {
        console.error("Error fetching task");
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [taskId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      let file_url = null;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await api.post("/submissions/upload", formData);
        file_url = uploadRes.data.file_url;
      }
      
      await api.post("/submissions/", {
        task_id: taskId,
        submission_content: submissionContent,
        file_url
      });
      setSubmitted(true);
    } catch (err: any) {
      alert("Submission failed: " + (err.response?.data?.detail || err.message));
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <SkeletonTaskPage />;
  if (!task) return <div style={{ color: "var(--foreground)", padding: "2rem" }}>Task not found</div>;
  
  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", padding: "2rem", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <motion.div 
          className="glass-panel" 
          style={{ padding: "3rem", textAlign: "center", maxWidth: "500px" }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <h2 style={{ color: "var(--success)" }}>Submission Successful!</h2>
          <p style={{ margin: "1rem 0" }}>Your work has been securely transmitted to the admin panel.</p>
          <button className="btn-primary" onClick={() => router.push("/student/dashboard")}>Back to Dashboard</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", padding: "2rem", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <motion.div 
        className="glass-panel" 
        style={{ width: "100%", maxWidth: "700px", padding: "3rem", borderColor: "var(--accent)" }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button 
          style={{ background: "transparent", border: "none", color: "var(--primary)", cursor: "pointer", marginBottom: "1rem", fontWeight: 600 }}
          onClick={() => router.push("/student/dashboard")}
        >
          ← Back
        </button>
        
        <h1 style={{ color: "var(--foreground)", marginBottom: "0.5rem" }}>{task.title}</h1>
        <p style={{ color: "var(--accent)", marginBottom: "2rem" }}>{task.description}</p>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Your Submission Notes</label>
            <textarea 
              className="input-field" 
              style={{ minHeight: "150px", resize: "vertical" }}
              placeholder="Provide a summary or link to your work..."
              value={submissionContent}
              onChange={(e) => setSubmissionContent(e.target.value)}
              required 
            />
          </div>
          
          {task.allow_attachments && (
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>File Attachment (Optional)</label>
              <input 
                type="file" 
                className="input-field" 
                style={{ padding: "10px" }}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
          )}
          
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={uploading}
            style={{ opacity: uploading ? 0.7 : 1 }}
          >
            {uploading ? "Submitting..." : "Submit Task"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
