"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { SkeletonDashboard } from "@/components/Skeleton";

export default function StudentDashboard() {
  const router = useRouter();
  const [tasks, setTasks] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Profile/Password State
  const [showProfile, setShowProfile] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwMsg, setPwMsg] = useState({ text: "", isError: false });
  const [studentDetails, setStudentDetails] = useState<any>(null);

  useEffect(() => {
    const usr = localStorage.getItem("user");
    if (!usr) {
      router.push("/login/student");
      return;
    }
    const parsedUser = JSON.parse(usr);
    setUser(parsedUser);
    fetchData(parsedUser.id);
  }, []);

  const fetchData = async (userId: string) => {
    try {
      const [tasksRes, subsRes, detailsRes] = await Promise.all([
        api.get("/tasks/"),
        api.get("/submissions/me"),
        api.get(`/students/${userId}`)
      ]);
      setTasks(tasksRes.data);
      setSubmissions(subsRes.data);
      setStudentDetails(detailsRes.data);
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

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg({ text: "", isError: false });
    try {
      await api.post("/auth/change-password", {
        old_password: oldPassword,
        new_password: newPassword
      });
      setPwMsg({ text: "Password updated successfully!", isError: false });
      setOldPassword("");
      setNewPassword("");
    } catch (err: any) {
      setPwMsg({ text: err.response?.data?.detail || "Failed to update password", isError: true });
    }
  };

  if (loading) return <SkeletonDashboard />;

  return (
    <div className="responsive-padding" style={{ minHeight: "100vh", padding: "2rem" }}>
      <header className="responsive-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }}
          style={{ color: 'var(--accent)' }}
        >
          Welcome, {user?.name}
        </motion.h1>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button onClick={() => setShowProfile(true)} className="btn-primary" style={{ background: "transparent", border: "1px solid var(--accent)", color: "var(--foreground)" }}>
            My Profile
          </button>
          <button onClick={handleLogout} className="btn-primary" style={{ background: "transparent", border: "1px solid var(--primary)", color: "var(--foreground)" }}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        {/* Left Column: Tasks */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
        >
          <h2 style={{ marginBottom: "1.5rem" }}>Available Tasks</h2>
          
          {tasks.length === 0 ? (
            <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
              <h3 style={{ color: "var(--accent)", marginBottom: "1rem", fontSize: '1.8rem' }}>All Caught Up!</h3>
              <p style={{ color: "var(--foreground)", opacity: 0.7, fontSize: '1.1rem' }}>There are currently no tasks assigned. Take a break and check back later.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {tasks.map((task, i) => {
                const isSubmitted = submissions.some(s => s.task_id === task.id);
                return (
                  <motion.div 
                    key={task.id} 
                    className="glass-panel" 
                    style={{ padding: "1.5rem" }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * i }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <h3 style={{ margin: "0 0 0.5rem 0", color: "var(--accent)" }}>{task.title}</h3>
                        <p style={{ color: "var(--foreground)", opacity: 0.8, margin: 0 }}>{task.description}</p>
                      </div>
                      {isSubmitted ? (
                        <span style={{ color: "var(--success)", fontWeight: 600, fontSize: "0.9rem" }}>✓ Submitted</span>
                      ) : (
                        <button 
                          className="btn-primary" 
                          style={{ padding: "8px 16px", fontSize: "0.9rem" }}
                          onClick={() => router.push(`/student/dashboard/task/${task.id}`)}
                        >
                          Submit
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.section>

        {/* Right Column: Activity History */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
        >
          <h2 style={{ marginBottom: "1.5rem" }}>Activity History</h2>
          <div className="glass-panel" style={{ padding: "1.5rem", minHeight: "300px" }}>
            {submissions.length === 0 ? (
              <p style={{ color: "var(--foreground)", opacity: 0.7, textAlign: "center", marginTop: "2rem" }}>No submissions yet.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
                {submissions.map((sub, i) => {
                  const taskObj = tasks.find(t => t.id === sub.task_id);
                  return (
                    <motion.li 
                      key={sub.id} 
                      style={{ borderBottom: "1px solid rgba(0,0,0,0.1)", paddingBottom: "1rem" }}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                    >
                      <h4 style={{ margin: "0 0 0.25rem 0", color: "var(--accent)" }}>{taskObj?.title || "Unknown Task"}</h4>
                      <p style={{ margin: "0 0 0.5rem 0", color: "var(--foreground)", opacity: 0.8, fontSize: "0.9rem" }}>{sub.submission_content}</p>
                      <small style={{ color: "var(--primary)" }}>{new Date(sub.submitted_at).toLocaleDateString()}</small>
                    </motion.li>
                  );
                })}
              </ul>
            )}
          </div>
        </motion.section>
      </div>

      {/* Profile & Password Modal */}
      <AnimatePresence>
        {showProfile && (
          <motion.div 
            style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(255,255,255,0.4)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="glass-panel" 
              style={{ width: "100%", maxWidth: "450px", padding: "2.5rem", borderColor: "var(--accent)", background: "rgba(253, 251, 247, 0.95)" }}
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
            >
              <h2 style={{ marginBottom: "1.5rem", color: "var(--accent)" }}>My Profile</h2>
              
              <div style={{ marginBottom: "2rem", color: "var(--foreground)" }}>
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Role:</strong> {user?.role.toUpperCase()}</p>
                <p><strong>Branch:</strong> {studentDetails?.branch || "N/A"}</p>
                <p><strong>Year:</strong> {studentDetails?.year || "N/A"}</p>
                <p><strong>Enrollment:</strong> {studentDetails?.enrollment_number || "N/A"}</p>
              </div>

              <h3 style={{ marginBottom: "1rem", color: "var(--accent)", fontSize: "1.2rem" }}>Change Password</h3>
              {pwMsg.text && (
                <div style={{ color: pwMsg.isError ? "var(--error)" : "var(--success)", marginBottom: "1rem", fontSize: "0.9rem" }}>
                  {pwMsg.text}
                </div>
              )}
              
              <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem" }}>Old Password</label>
                  <input type="password" required className="input-field" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem" }}>New Password</label>
                  <input type="password" required className="input-field" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
                  <button type="button" className="btn-primary" style={{ background: "transparent", color: "var(--foreground)", border: "1px solid var(--accent)" }} onClick={() => setShowProfile(false)}>Close</button>
                  <button type="submit" className="btn-primary">Update Password</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
