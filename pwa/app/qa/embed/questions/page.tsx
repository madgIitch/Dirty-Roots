// app/qa/embed/questions/page.tsx  
"use client";  
  
import { useEffect, useState } from "react";  
import QuestionForm from "@/src/components/QuestionForm";  
import { ensureAnonAuth } from "@/src/lib/firebase";  
import { listQuestions } from "@/src/lib/firestore";  
  
export default function EmbedQuestionsPage() {  
  const [mounted, setMounted] = useState(false);  
  const [questions, setQuestions] = useState<any[]>([]);  
  const [loading, setLoading] = useState(true);  
  const [drawerOpen, setDrawerOpen] = useState(false);  
  
  useEffect(() => {  
    setMounted(true);  
  }, []);  
  
  useEffect(() => {  
    if (!mounted) return;  
  
    (async () => {  
      try {  
        await ensureAnonAuth();  
        await loadQuestions();  
      } catch (error) {  
        console.error("Error initializing:", error);  
      }  
    })();  
  }, [mounted]);  
  
  async function loadQuestions() {  
    try {  
      const allQuestions = await listQuestions(100);  
  
      // Ordenar: preguntas respondidas primero, luego sin responder  
      const sorted = allQuestions.sort((a, b) => {  
        const aHasAnswer = !!(a.answer && a.answer.text);  
        const bHasAnswer = !!(b.answer && b.answer.text);  
  
        if (aHasAnswer && !bHasAnswer) return -1;  
        if (!aHasAnswer && bHasAnswer) return 1;  
        return 0;  
      });  
  
      setQuestions(sorted);  
    } catch (error) {  
      console.error("Error loading questions:", error);  
    } finally {  
      setLoading(false);  
    }  
  }  
  
  function handleQuestionCreated(id: string) {  
    loadQuestions();  
    setDrawerOpen(false); // Cerrar drawer después de enviar  
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
    <div style={{  
      width: '100vw',  
      height: '100vh',  
      position: 'relative',  
      background: '#0B0B0B',  
      overflow: 'hidden'  
    }}>  
      {/* Lista de preguntas a pantalla completa */}  
      <div className="questions-scroll" style={{  
        width: '100%',  
        height: '100%',  
        overflowY: 'auto',  
        padding: '32px',  
        paddingBottom: '100px' // Espacio para el botón flotante  
      }}>  
        <h2 style={{  
          fontSize: '28px',  
          fontWeight: 'bold',  
          marginBottom: '24px',  
          color: '#F5F5F5'  
        }}>  
          💬 Community Questions  
        </h2>  
  
        {loading ? (  
          <div style={{  
            display: 'flex',  
            alignItems: 'center',  
            justifyContent: 'center',  
            padding: '40px'  
          }}>  
            <div style={{  
              display: 'inline-block',  
              width: '48px',  
              height: '48px',  
              border: '4px solid #A4CB3E',  
              borderTopColor: 'transparent',  
              borderRadius: '50%',  
              animation: 'spin 1s linear infinite'  
            }}></div>  
          </div>  
        ) : questions.length === 0 ? (  
          <div style={{  
            borderRadius: '24px',  
            padding: '40px',  
            textAlign: 'center',  
            border: '1px solid #242424',  
            background: '#0F0F0F'  
          }}>  
            <div style={{ fontSize: '56px', marginBottom: '24px' }}>💬</div>  
            <p style={{ marginBottom: '16px', fontSize: '20px', color: '#B6B9BF' }}>  
              No questions yet.  
            </p>  
            <p style={{ fontSize: '14px', color: '#B6B9BF' }}>  
              Be the first to ask a question using the button below.  
            </p>  
          </div>  
        ) : (  
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>  
            {questions.map(q => {  
              const hasAnswer = q.answer && q.answer.text;  
  
              return (  
                <div  
                  key={q.id}  
                  style={{  
                    borderRadius: '24px',  
                    padding: '24px',  
                    border: '1px solid #242424',  
                    background: '#0F0F0F',  
                    transition: 'all 0.2s'  
                  }}  
                  onMouseEnter={(e) => {  
                    e.currentTarget.style.background = '#111111';  
                    e.currentTarget.style.borderColor = 'rgba(164, 203, 62, 0.3)';  
                  }}  
                  onMouseLeave={(e) => {  
                    e.currentTarget.style.background = '#0F0F0F';  
                    e.currentTarget.style.borderColor = '#242424';  
                  }}  
                >  
                  <div style={{ marginBottom: '12px' }}>  
                    <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#F5F5F5', marginBottom: '8px' }}>  
                      {q.text}  
                    </div>  
                    {q.context && (  
                      <div style={{ fontSize: '14px', color: '#B6B9BF', lineHeight: '1.5' }}>  
                        {q.context}  
                      </div>  
                    )}  
                  </div>  
  
                  {hasAnswer && (  
                    <div style={{  
                      marginTop: '16px',  
                      paddingTop: '16px',  
                      borderTop: '1px solid #1F1F1F'  
                    }}>  
                      <div style={{  
                        fontSize: '12px',  
                        fontWeight: '600',  
                        color: '#A4CB3E',  
                        marginBottom: '8px'  
                      }}>  
                        Answer:  
                      </div>  
                      <div style={{  
                        fontSize: '14px',  
                        color: '#B6B9BF',  
                        lineHeight: '1.5',  
                        marginBottom: '8px'  
                      }}>  
                        {q.answer.text}  
                      </div>  
                      {q.answer.references && q.answer.references.length > 0 && (  
                        <div style={{ marginTop: '8px' }}>  
                          <div style={{ fontSize: '11px', color: '#757575', marginBottom: '4px' }}>  
                            References:  
                          </div>  
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>  
                            {q.answer.references.map((ref: string, i: number) => (  
                              <span  
                                key={i}  
                                style={{  
                                  fontSize: '11px',  
                                  color: '#A4CB3E',  
                                  background: 'rgba(164, 203, 62, 0.1)',  
                                  padding: '3px 8px',  
                                  borderRadius: '9999px'  
                                }}  
                              >  
                                {ref}  
                              </span>  
                            ))}  
                          </div>  
                        </div>  
                      )}  
                    </div>  
                  )}  
  
                  <div style={{  
                    display: 'flex',  
                    alignItems: 'center',  
                    gap: '8px',  
                    paddingTop: '12px',  
                    marginTop: '12px',  
                    borderTop: '1px solid #1F1F1F'  
                  }}>  
                    {hasAnswer ? (  
                      <span style={{  
                        fontSize: '12px',  
                        color: '#A4CB3E',  
                        background: 'rgba(164, 203, 62, 0.1)',  
                        padding: '4px 12px',  
                        borderRadius: '9999px'  
                      }}>  
                        ✓ Answered  
                      </span>  
                    ) : (  
                      <span style={{  
                        fontSize: '12px',  
                        color: '#FF60A8',  
                        background: 'rgba(255, 96, 168, 0.1)',  
                        padding: '4px 12px',  
                        borderRadius: '9999px'  
                      }}>  
                        Pending Answer  
                      </span>  
                    )}  
                  </div>  
                </div>  
              );  
            })}  
          </div>  
        )}  
      </div>  
  
      {/* Botón flotante para abrir formulario */}  
      <button  
        onClick={() => setDrawerOpen(!drawerOpen)}  
        style={{  
          position: 'fixed',  
          bottom: '24px',  
          right: '24px',  
          width: '56px',  
          height: '56px',  
          borderRadius: '50%',  
          background: '#A4CB3E',  
          border: 'none',  
          cursor: 'pointer',  
          display: 'flex',  
          alignItems: 'center',  
          justifyContent: 'center',  
          fontSize: '24px',  
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',  
          zIndex: 1000,  
          transition: 'transform 0.2s'  
        }}  
        onMouseEnter={(e) => {  
          e.currentTarget.style.transform = 'scale(1.1)';  
        }}  
        onMouseLeave={(e) => {  
          e.currentTarget.style.transform = 'scale(1)';  
        }}  
      >  
        {drawerOpen ? '✕' : '💬'}  
      </button>  
  
      {/* Overlay oscuro */}  
      {drawerOpen && (  
        <div  
          onClick={() => setDrawerOpen(false)}  
          style={{  
            position: 'fixed',  
            top: 0,  
            left: 0,  
            width: '100%',  
            height: '100%',  
            background: 'rgba(0, 0, 0, 0.5)',  
            zIndex: 1001,  
            animation: 'fadeIn 0.3s ease-out'  
          }}  
        />  
      )}  
  
      {/* Drawer con formulario */}  
      <div  
        className="drawer-scroll"  
        style={{  
          position: 'fixed',  
          bottom: 0,  
          left: 0,  
          width: '100%',  
          maxHeight: '80vh',  
          background: '#0F0F0F',  
          borderTopLeftRadius: '24px',  
          borderTopRightRadius: '24px',  
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.5)',  
          transform: drawerOpen ? 'translateY(0)' : 'translateY(100%)',  
          transition: 'transform 0.3s ease-out',  
          zIndex: 1002,  
          overflowY: 'auto',  
          padding: '24px'  
        }}  
      >  
        {/* Handle visual */}  
        <div style={{  
          width: '40px',  
          height: '4px',  
          background: '#2A2A2A',  
          borderRadius: '2px',  
          margin: '0 auto 20px',  
          cursor: 'pointer'  
        }} onClick={() => setDrawerOpen(false)} />  
  
        <h2 style={{  
          fontSize: '24px',  
          fontWeight: 'bold',  
          marginBottom: '16px',  
          color: '#F5F5F5',  
          margin: '0 0 16px 0'  
        }}>  
          💬 Ask a Question  
        </h2>  
        <p style={{  
          fontSize: '14px',  
          color: '#B6B9BF',  
          marginBottom: '24px'  
        }}>  
          Your question will appear in the list above. It will become public once it receives an answer.  
        </p>  
        <QuestionForm onCreated={handleQuestionCreated} />  
      </div>  
  
      <style jsx>{`  
        @keyframes spin {  
          to { transform: rotate(360deg); }  
        }  
  
        @keyframes fadeIn {  
          from { opacity: 0; }  
          to { opacity: 1; }  
        }  
  
        .questions-scroll::-webkit-scrollbar {  
          width: 8px;  
        }  
  
        .questions-scroll::-webkit-scrollbar-track {  
          background: #0F0F0F;  
          border-radius: 4px;  
        }  
  
        .questions-scroll::-webkit-scrollbar-thumb {  
          background: #2A2A2A;  
          border-radius: 4px;  
        }  
  
        .questions-scroll::-webkit-scrollbar-thumb:hover {  
          background: #A4CB3E;  
        }  
  
        .drawer-scroll::-webkit-scrollbar {  
          width: 8px;  
        }  
  
        .drawer-scroll::-webkit-scrollbar-track {  
          background: #0F0F0F;  
          border-radius: 4px;  
        }  
  
        .drawer-scroll::-webkit-scrollbar-thumb {  
          background: #2A2A2A;  
          border-radius: 4px;  
        }  
  
        .drawer-scroll::-webkit-scrollbar-thumb:hover {  
          background: #A4CB3E;  
        }  
      `}</style>  
    </div>  
  );  
}