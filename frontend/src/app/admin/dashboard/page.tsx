"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { SkeletonDashboard } from "@/components/Skeleton";

export default function AdminDashboard() {
  const router = useRouter();
  const [tasks, setTasks] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState<any>(null);

  // New Task State
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [allowAttachments, setAllowAttachments] = useState(false);

  // View State (Task-Wise or Student-Wise)
  const [viewMode, setViewMode] = useState<"task" | "student">("task");
  
  // Specific Selection State
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  
  // Data for selected state
  const [submissions, setSubmissions] = useState<any[]>([]); 

  useEffect(() => {
    const usr = localStorage.getItem("user");
    if (!usr) {
      router.push("/login/admin");
      return;
    }
    const parsed = JSON.parse(usr);
    if (parsed.role !== "admin") {
      router.push("/");
      return;
    }
    setAdmin(parsed);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, studentsRes] = await Promise.all([
        api.get("/tasks/"),
        api.get("/students/")
      ]);
      setTasks(tasksRes.data);
      setStudents(studentsRes.data);
    } catch (error) {
      console.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    router.push("/");
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/tasks/", { 
        title: newTaskTitle, 
        description: newTaskDesc,
        allow_attachments: allowAttachments
      });
      setNewTaskTitle("");
      setNewTaskDesc("");
      setAllowAttachments(false);
      setShowTaskModal(false);
      fetchData();
    } catch (err) {
      alert("Failed to create task");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if(!confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      if(selectedTaskId === taskId) setSelectedTaskId(null);
      fetchData();
    } catch (err) {
      alert("Failed to delete task");
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if(!confirm("Are you sure you want to remove this student? This action cannot be undone.")) return;
    try {
      await api.delete(`/students/${studentId}`);
      if(selectedStudentId === studentId) setSelectedStudentId(null);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to remove student");
    }
  };

  const fetchSubmissionsForTask = async (taskId: string) => {
    try {
      const res = await api.get(`/submissions/task/${taskId}`);
      setSubmissions(res.data);
      setSelectedTaskId(taskId);
    } catch(err) {
      alert("Failed to fetch submissions");
    }
  };
  
  const fetchSubmissionsForStudent = async (studentId: string) => {
    try {
      const res = await api.get(`/submissions/student/${studentId}`);
      setSubmissions(res.data);
      setSelectedStudentId(studentId);
    } catch(err) {
      alert("Failed to fetch student submissions");
    }
  };

  if (loading) return <SkeletonDashboard />;

  return (
    <div className="responsive-padding" style={{ minHeight: "100vh", padding: "2rem", background: "var(--background)" }}>
      <header className="responsive-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }}
          style={{ color: "var(--primary)" }}
        >
          Admin Portal: {admin?.name}
        </motion.h1>
        <button onClick={handleLogout} className="btn-primary" style={{ background: "transparent", border: "1px solid var(--accent)", color: "var(--foreground)" }}>
          Logout
        </button>
      </header>
      
      {/* View Toggle */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <button 
          className="btn-primary"
          style={{ opacity: viewMode === "task" ? 1 : 0.5, boxShadow: viewMode === "task" ? undefined : "none" }}
          onClick={() => { setViewMode("task"); setSelectedStudentId(null); setSubmissions([]); }}
        >
          Task-Wise View
        </button>
        <button 
          className="btn-primary"
          style={{ opacity: viewMode === "student" ? 1 : 0.5, boxShadow: viewMode === "student" ? undefined : "none" }}
          onClick={() => { setViewMode("student"); setSelectedTaskId(null); setSubmissions([]); }}
        >
          Student-Wise View
        </button>
      </div>

      <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        {/* Left Column: List based on mode */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          {viewMode === "task" ? (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h2 style={{ margin: 0, color: "var(--foreground)" }}>Manage Tasks</h2>
                <button className="btn-primary" onClick={() => setShowTaskModal(true)}>
                  + New Task
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {tasks.length === 0 ? <p style={{ color: "var(--foreground)", opacity: 0.7 }}>No tasks created yet.</p> : null}
                {tasks.map((task, i) => (
                  <motion.div 
                    key={task.id} 
                    className="glass-panel" 
                    style={{ padding: "1.5rem", borderLeft: selectedTaskId === task.id ? "4px solid var(--primary)" : "1px solid var(--glass-border)", cursor: "pointer" }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 * i }}
                    onClick={() => fetchSubmissionsForTask(task.id)}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <h3 style={{ margin: "0 0 0.5rem 0", color: "var(--accent)" }}>{task.title} {task.allow_attachments && "📎"}</h3>
                        <p style={{ color: "var(--foreground)", opacity: 0.8, margin: 0, fontSize: "0.9rem" }}>{task.description}</p>
                      </div>
                      <button 
                        style={{ background: "transparent", border: "none", color: "var(--error)", cursor: "pointer", fontSize: "1.2rem" }}
                        onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.id); }}
                      >
                        ×
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ) : (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h2 style={{ marginBottom: "1.5rem", color: "var(--foreground)" }}>Student Directory</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {students.map((student, i) => (
                  <motion.div 
                    key={student.id} 
                    className="glass-panel"
                    style={{ padding: "1.5rem", borderLeft: selectedStudentId === student.id ? "4px solid var(--primary)" : "1px solid var(--glass-border)", cursor: "pointer" }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i }}
                    onClick={() => fetchSubmissionsForStudent(student.id)}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <h4 style={{ margin: "0 0 0.25rem 0", color: "var(--accent)", fontSize: "1.1rem" }}>{student.name} ({student.enrollment_number})</h4>
                        <p style={{ margin: 0, color: "var(--foreground)", opacity: 0.7, fontSize: "0.9rem" }}>{student.email} • {student.branch || "N/A"} • Year: {student.year || "N/A"}</p>
                      </div>
                      <button 
                        style={{ background: "transparent", border: "1px solid var(--error)", color: "var(--error)", cursor: "pointer", fontSize: "0.8rem", padding: "4px 8px", borderRadius: "4px" }}
                        onClick={(e) => { e.stopPropagation(); handleDeleteStudent(student.id); }}
                      >
                        Remove
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

        </div>

        {/* Right Column: Submissions Viewer */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          {selectedTaskId || selectedStudentId ? (
            <div className="glass-panel" style={{ padding: "1.5rem", minHeight: "500px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h2 style={{ margin: 0, color: "var(--primary)" }}>
                  {selectedTaskId ? "Task Submissions" : "Student's Work"}
                </h2>
                <button style={{ background: "transparent", border: "none", color: "var(--foreground)", opacity: 0.7, cursor: "pointer" }} onClick={() => { setSelectedTaskId(null); setSelectedStudentId(null); setSubmissions([]); }}>Clear</button>
              </div>
              
              {submissions.length === 0 ? (
                <p style={{ color: "var(--foreground)", opacity: 0.7 }}>No submissions found for this selection.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {submissions.map((sub, i) => (
                    <motion.div 
                      key={sub.id} 
                      style={{ background: "rgba(255,255,255,0.6)", padding: "1rem", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.05)" }}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                    >
                      <h4 style={{ margin: "0 0 0.5rem 0", color: "var(--accent)" }}>
                        {selectedTaskId ? `Student: ${sub.student_name}` : `Task: ${tasks.find(t => t.id === sub.task_id)?.title || "Unknown Task"}`}
                      </h4>
                      <p style={{ margin: "0 0 0.5rem 0", color: "var(--foreground)", opacity: 0.9, fontSize: "0.95rem", whiteSpace: "pre-wrap" }}>{sub.submission_content}</p>
                      
                      {sub.file_url && (
                        <div style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}>
                          <a href={sub.file_url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "underline" }}>
                            📎 View Attachment
                          </a>
                        </div>
                      )}
                      
                      <small style={{ color: "var(--accent)", opacity: 0.8 }}>{new Date(sub.submitted_at).toLocaleString()}</small>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: "3rem", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "500px", textAlign: "center" }}>
              <h3 style={{ color: "var(--accent)", marginBottom: "1rem" }}>Viewer Panel</h3>
              <p style={{ color: "var(--foreground)", opacity: 0.7 }}>Select a {viewMode} on the left to view their detailed submissions here.</p>
            </div>
          )}
        </motion.section>
      </div>

      {/* Create Task Modal */}
      <AnimatePresence>
        {showTaskModal && (
          <motion.div 
            style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(255,255,255,0.4)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="glass-panel" 
              style={{ width: "100%", maxWidth: "500px", padding: "2.5rem", borderColor: "var(--accent)", background: "rgba(253, 251, 247, 0.95)" }}
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
            >
              <h2 style={{ marginBottom: "1.5rem", color: "var(--accent)" }}>Create New Task</h2>
              <form onSubmit={handleCreateTask} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "var(--foreground)" }}>Title</label>
                  <input className="input-field" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} required />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "var(--foreground)" }}>Description</label>
                  <textarea className="input-field" style={{ minHeight: "100px", resize: "vertical" }} value={newTaskDesc} onChange={(e) => setNewTaskDesc(e.target.value)} required />
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <input 
                    type="checkbox" 
                    id="allowAttachments" 
                    checked={allowAttachments} 
                    onChange={(e) => setAllowAttachments(e.target.checked)} 
                    style={{ width: "18px", height: "18px", accentColor: "var(--primary)" }}
                  />
                  <label htmlFor="allowAttachments" style={{ fontWeight: 600, color: "var(--foreground)", cursor: "pointer" }}>
                    Allow File Attachments
                  </label>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
                  <button type="button" className="btn-primary" style={{ background: "transparent", color: "var(--foreground)", border: "1px solid var(--accent)" }} onClick={() => setShowTaskModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Create Task</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
