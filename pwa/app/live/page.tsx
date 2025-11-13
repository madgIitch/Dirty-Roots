// app/live/page.tsx  
"use client";  
  
import { useEffect, useState } from "react";  
import { useRouter } from "next/navigation";  
import { ensureAnonAuth, auth } from "@/src/lib/firebase";  
import { listLiveSessions, deleteLiveSession } from "@/src/lib/firestore";  
import Link from "next/link";  
import ProtectedRoute from "@/src/components/ProtectedRoute";  
  
export default function LiveSessionsPage() {  
  const router = useRouter();  
  const [mounted, setMounted] = useState(false);  
  const [sessions, setSessions] = useState<any[]>([]);  
  const [loading, setLoading] = useState(true);  
  const [showCreateForm, setShowCreateForm] = useState(false);  
  
  // Form state  
  const [title, setTitle] = useState("");  
  const [description, setDescription] = useState("");  
  const [date, setDate] = useState("");  
  const [time, setTime] = useState("");  
  const [youtubeLink, setYoutubeLink] = useState("");  
  const [submitting, setSubmitting] = useState(false);  
  
  useEffect(() => {  
    setMounted(true);  
  }, []);  
  
  useEffect(() => {  
    if (!mounted) return;  
      
    ensureAnonAuth();  
    loadSessions();  
  }, [mounted]);  
  
  async function loadSessions() {  
    try {  
      const data = await listLiveSessions(50);  
      // Ordenar por fecha (próximas primero)  
      const sorted = data.sort((a, b) => {  
        const dateA = a.date?.toDate?.() || new Date(0);  
        const dateB = b.date?.toDate?.() || new Date(0);  
        return dateA.getTime() - dateB.getTime();  
      });  
      setSessions(sorted);  
    } catch (error) {  
      console.error("Error loading sessions:", error);  
    } finally {  
      setLoading(false);  
    }  
  }  
  
  async function handleCreateSession(e: React.FormEvent) {  
    e.preventDefault();  
      
    if (!title.trim() || !date || !time || !youtubeLink.trim()) {  
      alert("Please fill in all required fields");  
      return;  
    }  
  
    setSubmitting(true);  
    try {  
      await ensureAnonAuth();  
      const uid = auth.currentUser?.uid || "anon";  
  
      // Combinar fecha y hora en un Timestamp  
      const dateTime = new Date(`${date}T${time}`);  
        
      const { addLiveSession } = await import("@/src/lib/firestore");  
      await addLiveSession({  
        title: title.trim(),  
        description: description.trim(),  
        date: dateTime,  
        youtubeLink: youtubeLink.trim(),  
        createdBy: uid,  
        status: "upcoming"  
      });  
  
      // Reset form  
      setTitle("");  
      setDescription("");  
      setDate("");  
      setTime("");  
      setYoutubeLink("");  
      setShowCreateForm(false);  
  
      // Reload sessions  
      await loadSessions();  
      alert("✅ Session created successfully!");  
    } catch (error) {  
      console.error("Error creating session:", error);  
      alert("Error creating session. Please try again.");  
    } finally {  
      setSubmitting(false);  
    }  
  }  
  
  async function handleDeleteSession(sessionId: string) {  
    if (!confirm("Are you sure you want to delete this session?")) return;  
  
    try {  
      await deleteLiveSession(sessionId);  
      setSessions(sessions.filter(s => s.id !== sessionId));  
      alert("✅ Session deleted");  
    } catch (error) {  
      console.error("Error deleting session:", error);  
      alert("Error deleting session. Please try again.");  
    }  
  }  
  
  function getSessionStatus(session: any) {  
    const now = new Date();  
    const sessionDate = session.date?.toDate?.() || new Date(0);  
      
    if (session.status === "live") return { text: "🔴 LIVE NOW", color: "#FF60A8" };  
    if (session.status === "ended") return { text: "Ended", color: "#666666" };  
    if (sessionDate < now) return { text: "Past", color: "#666666" };  
    return { text: "Upcoming", color: "#A4CB3E" };  
  }  
  
  if (!mounted) {  
    return (  
      <div style={{  
        width: '100vw',  
        height: '100vh',  
        display: 'flex',  
        alignItems: 'center',  
        justifyContent: 'center',  
        background: '#0B0B0B'  
      }}>  
        <div style={{ textAlign: 'center' }}>  
          <div style={{  
            display: 'inline-block',  
            width: '48px',  
            height: '48px',  
            border: '4px solid #A4CB3E',  
            borderTopColor: 'transparent',  
            borderRadius: '50%',  
            animation: 'spin 1s linear infinite',  
            marginBottom: '16px'  
          }}></div>  
          <p style={{ color: '#B6B9BF', fontSize: '18px' }}>Loading...</p>  
        </div>  
        <style jsx>{`  
          @keyframes spin {  
            to { transform: rotate(360deg); }  
          }  
        `}</style>  
      </div>  
    );  
  }  
  
  return (  
    <ProtectedRoute>  
      <div style={{  
        minHeight: '100vh',  
        background: '#0B0B0B',  
        padding: '40px 20px'  
      }}>  
        <div style={{  
          maxWidth: '1200px',  
          margin: '0 auto'  
        }}>  
          {/* Header */}  
          <div style={{  
            display: 'flex',  
            justifyContent: 'space-between',  
            alignItems: 'center',  
            marginBottom: '32px'  
          }}>  
            <div>  
              <h1 style={{  
                fontSize: '32px',  
                fontWeight: 'bold',  
                color: '#F5F5F5',  
                marginBottom: '8px'  
              }}>  
                🎥 Live Sessions Management  
              </h1>  
              <p style={{ color: '#B6B9BF', fontSize: '16px' }}>  
                Create and manage live Q&A sessions  
              </p>  
            </div>  
              
            <button  
              onClick={() => setShowCreateForm(!showCreateForm)}  
              style={{  
                padding: '12px 24px',  
                background: showCreateForm ? '#2A2A2A' : '#A4CB3E',  
                color: showCreateForm ? '#F5F5F5' : '#0B0B0B',  
                border: 'none',  
                borderRadius: '9999px',  
                fontSize: '16px',  
                fontWeight: '700',  
                cursor: 'pointer',  
                transition: 'all 0.2s'  
              }}  
              onMouseEnter={(e) => {  
                if (!showCreateForm) e.currentTarget.style.background = '#8FB82E';  
              }}  
              onMouseLeave={(e) => {  
                if (!showCreateForm) e.currentTarget.style.background = '#A4CB3E';  
              }}  
            >  
              {showCreateForm ? 'Cancel' : '+ New Session'}  
            </button>  
          </div>  
  
          {/* Create Form */}  
          {showCreateForm && (  
            <div style={{  
              background: '#0F0F0F',  
              borderRadius: '24px',  
              border: '1px solid #242424',  
              padding: '32px',  
              marginBottom: '32px'  
            }}>  
              <h2 style={{  
                fontSize: '24px',  
                fontWeight: 'bold',  
                color: '#F5F5F5',  
                marginBottom: '24px'  
              }}>  
                Create New Live Session  
              </h2>  
  
              <form onSubmit={handleCreateSession}>  
                {/* Title */}  
                <div style={{ marginBottom: '20px' }}>  
                  <label style={{  
                    display: 'block',  
                    fontSize: '14px',  
                    fontWeight: '600',  
                    marginBottom: '8px',  
                    color: '#F5F5F5'  
                  }}>  
                    Session Title *  
                  </label>  
                  <input  
                    type="text"  
                    value={title}  
                    onChange={(e) => setTitle(e.target.value)}  
                    placeholder="e.g., Live Q&A — Winter Reset"  
                    required  
                    style={{  
                      width: '100%',  
                      background: '#0B0B0B',  
                      border: '1px solid #2A2A2A',  
                      borderRadius: '12px',  
                      padding: '12px 16px',  
                      color: '#F5F5F5',  
                      fontSize: '14px',  
                      outline: 'none',  
                      transition: 'all 0.2s'  
                    }}  
                    onFocus={(e) => e.currentTarget.style.borderColor = '#A4CB3E'}  
                    onBlur={(e) => e.currentTarget.style.borderColor = '#2A2A2A'}  
                  />  
                </div>  
  
                {/* Description */}  
                <div style={{ marginBottom: '20px' }}>  
                  <label style={{  
                    display: 'block',  
                    fontSize: '14px',  
                    fontWeight: '600',  
                    marginBottom: '8px',  
                    color: '#F5F5F5'  
                  }}>  
                    Description  
                  </label>  
                  <textarea  
                    value={description}  
                    onChange={(e) => setDescription(e.target.value)}  
                    placeholder="Describe what this session is about..."  
                    rows={4}  
                    style={{  
                      width: '100%',  
                      background: '#0B0B0B',  
                      border: '1px solid #2A2A2A',  
                      borderRadius: '12px',  
                      padding: '12px 16px',  
                      color: '#F5F5F5',  
                      fontSize: '14px',  
                      outline: 'none',  
                      resize: 'vertical',  
                      transition: 'all 0.2s'  
                    }}  
                    onFocus={(e) => e.currentTarget.style.borderColor = '#A4CB3E'}  
                    onBlur={(e) => e.currentTarget.style.borderColor = '#2A2A2A'}  
                  />  
                </div>  
  
                {/* Date and Time */}  
                <div style={{  
                  display: 'grid',  
                  gridTemplateColumns: '1fr 1fr',  
                  gap: '16px',  
                  marginBottom: '20px'  
                }}>  
                  <div>  
                    <label style={{  
                      display: 'block',  
                      fontSize: '14px',  
                      fontWeight: '600',  
                      marginBottom: '8px',  
                      color: '#F5F5F5'  
                    }}>  
                      Date *  
                    </label>  
                    <input  
                      type="date"  
                      value={date}  
                      onChange={(e) => setDate(e.target.value)}  
                      required  
                      style={{  
                        width: '100%',  
                        background: '#0B0B0B',  
                        border: '1px solid #2A2A2A',  
                        borderRadius: '12px',  
                        padding: '12px 16px',  
                        color: '#F5F5F5',  
                        fontSize: '14px',  
                        outline: 'none',  
                        transition: 'all 0.2s'  
                      }}  
                      onFocus={(e) => e.currentTarget.style.borderColor = '#A4CB3E'}  
                      onBlur={(e) => e.currentTarget.style.borderColor = '#2A2A2A'}  
                    />  
                  </div>  
  
                  <div>  
                    <label style={{  
                      display: 'block',  
                      fontSize: '14px',  
                      fontWeight: '600',  
                      marginBottom: '8px',  
                      color: '#F5F5F5'  
                    }}>  
                      Time *  
                    </label>  
                    <input  
                      type="time"  
                      value={time}  
                      onChange={(e) => setTime(e.target.value)}  
                      required  
                      style={{  
                        width: '100%',  
                        background: '#0B0B0B',  
                        border: '1px solid #2A2A2A',  
                        borderRadius: '12px',  
                        padding: '12px 16px',  
                        color: '#F5F5F5',  
                        fontSize: '14px',  
                        outline: 'none',  
                        transition: 'all 0.2s'  
                      }}  
                      onFocus={(e) => e.currentTarget.style.borderColor = '#A4CB3E'}  
                      onBlur={(e) => e.currentTarget.style.borderColor = '#2A2A2A'}  
                    />  
                  </div>  
                </div>  
  
                {/* YouTube Link */}  
                <div style={{ marginBottom: '24px' }}>  
                  <label style={{  
                    display: 'block',  
                    fontSize: '14px',  
                    fontWeight: '600',  
                    marginBottom: '8px',  
                    color: '#F5F5F5'  
                  }}>  
                    YouTube Live Link *  
                  </label>  
                  <input  
                    type="url"  
                    value={youtubeLink}  
                    onChange={(e) => setYoutubeLink(e.target.value)}  
                    placeholder="https://youtube.com/live/..."  
                    required  
                    style={{  
                      width: '100%',  
                      background: '#0B0B0B',  
                      border: '1px solid #2A2A2A',  
                      borderRadius: '12px',  
                      padding: '12px 16px',  
                      color: '#F5F5F5',  
                      fontSize: '14px',  
                      outline: 'none',  
                      transition: 'all 0.2s'  
                    }}  
                    onFocus={(e) => e.currentTarget.style.borderColor = '#A4CB3E'}  
                    onBlur={(e) => e.currentTarget.style.borderColor = '#2A2A2A'}  
                  />  
                </div>  
  
                {/* Submit Button */}  
                <button  
                  type="submit"  
                  disabled={submitting}  
                  style={{  
                    width: '100%',  
                    padding: '14px',  
                    background: submitting ? '#2A2A2A' : '#A4CB3E',  
                    color: submitting ? '#666666' : '#0B0B0B',  
                    border: 'none',  
                    borderRadius: '9999px',  
                    fontSize: '16px',  
                    fontWeight: '700',  
                    cursor: submitting ? 'not-allowed' : 'pointer',  
                    transition: 'all 0.2s'  
                  }}  
                    onMouseEnter={(e) => {  
                    if (!submitting) {  
                      e.currentTarget.style.background = '#8FB82E';  
                    }  
                  }}  
                  onMouseLeave={(e) => {  
                    if (!submitting) {  
                      e.currentTarget.style.background = '#A4CB3E';  
                    }  
                  }}  
                >  
                  {submitting ? 'Creating session...' : 'Create Session'}  
                </button>  
              </form>  
            </div>  
          )}  
        </div>  
      </div>  
  
      <style jsx>{`  
        @keyframes spin {  
          to { transform: rotate(360deg); }  
        }  
          
        input::placeholder,  
        textarea::placeholder {  
          color: #B6B9BF;  
          opacity: 0.7;  
        }  
      `}</style>  
    </ProtectedRoute>  
  );  
}