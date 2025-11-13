// app/qa/embed/questions/page.tsx    
"use client";    
    
import { useEffect, useState } from "react";    
import QuestionForm from "@/src/components/QuestionForm";    
import { ensureAnonAuth } from "@/src/lib/firebase";    
import { listQuestions } from "@/src/lib/firestore";  
import Link from "next/link";  
    
export default function EmbedQuestionsPage() {    
  const [mounted, setMounted] = useState(false);  
  const [questions, setQuestions] = useState<any[]>([]);  
  const [loading, setLoading] = useState(true);  
    
  useEffect(() => {    
    setMounted(true);    
    ensureAnonAuth();  
    loadQuestions();  
  }, []);  
  
  async function loadQuestions() {  
    try {  
      const allQuestions = await listQuestions(50);  
      // Filtrar solo preguntas con respuestas  
      const answered = allQuestions.filter(q => q.answer && q.answer.text && q.public);  
      setQuestions(answered);  
    } catch (error) {  
      console.error("Error loading questions:", error);  
    } finally {  
      setLoading(false);  
    }  
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
    <div className="questions-scroll" style={{    
      width: '100vw',    
      minHeight: '100vh',    
      maxHeight: '100vh',  
      overflowY: 'auto',  
      background: '#0B0B0B',    
      padding: '20px'    
    }}>  
      <div style={{  
        maxWidth: '1200px',  
        margin: '0 auto',  
        display: 'grid',  
        gridTemplateColumns: '1fr 1fr',  
        gap: '24px'  
      }}>  
        {/* Columna izquierda: Formulario para nueva pregunta */}  
        <div style={{    
          background: '#0F0F0F',    
          borderRadius: '24px',    
          border: '1px solid #242424',    
          padding: '32px',  
          height: 'fit-content',  
          position: 'sticky',  
          top: '20px'  
        }}>    
          <h2 style={{    
            fontSize: '24px',    
            fontWeight: 'bold',    
            marginBottom: '16px',    
            color: '#F5F5F5'    
          }}>    
            💬 New question    
          </h2>    
          <p style={{    
            fontSize: '14px',    
            color: '#B6B9BF',    
            marginBottom: '24px'    
          }}>    
            The questions will be made public once they receive an answer.    
          </p>    
          <QuestionForm onCreated={(id) => {    
            window.parent.location.href = `/qa/${id}`;    
          }} />    
        </div>  
  
        {/* Columna derecha: Preguntas respondidas */}  
        <div style={{  
          display: 'flex',  
          flexDirection: 'column',  
          gap: '16px'  
        }}>  
          <h2 style={{  
            fontSize: '24px',  
            fontWeight: 'bold',  
            color: '#F5F5F5',  
            marginBottom: '8px'  
          }}>  
            ✅ Answered Questions  
          </h2>  
  
          {loading ? (  
            <div style={{  
              textAlign: 'center',  
              padding: '40px',  
              color: '#B6B9BF'  
            }}>  
              <div style={{  
                display: 'inline-block',  
                width: '32px',  
                height: '32px',  
                border: '3px solid #A4CB3E',  
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
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>  
              <p style={{ fontSize: '16px', color: '#B6B9BF' }}>  
                No answered questions yet  
              </p>  
            </div>  
          ) : (  
            <div style={{  
              display: 'flex',  
              flexDirection: 'column',  
              gap: '12px'  
            }}>  
              {questions.map(q => (  
                <a  
                  key={q.id}  
                  href={`/qa/${q.id}`}  
                  target="_parent"  
                  style={{  
                    textDecoration: 'none',  
                    borderRadius: '24px',  
                    padding: '24px',  
                    border: '1px solid #242424',  
                    background: '#0F0F0F',  
                    transition: 'all 0.2s',  
                    display: 'block'  
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
                  <div style={{  
                    fontWeight: 'bold',  
                    fontSize: '18px',  
                    color: '#F5F5F5',  
                    marginBottom: '8px'  
                  }}>  
                    {q.text}  
                  </div>  
                  {q.context && (  
                    <div style={{  
                      fontSize: '14px',  
                      color: '#B6B9BF',  
                      lineHeight: '1.5',  
                      marginBottom: '12px'  
                    }}>  
                      {q.context}  
                    </div>  
                  )}  
                  <div style={{  
                    display: 'flex',  
                    alignItems: 'center',  
                    gap: '8px',  
                    paddingTop: '12px',  
                    borderTop: '1px solid #1F1F1F'  
                  }}>  
                    <span style={{  
                      fontSize: '12px',  
                      color: '#A4CB3E',  
                      background: 'rgba(164, 203, 62, 0.1)',  
                      padding: '4px 12px',  
                      borderRadius: '9999px'  
                    }}>  
                      ✓ Answered  
                    </span>  
                  </div>  
                </a>  
              ))}  
            </div>  
          )}  
        </div>  
      </div>  
  
      <style jsx>{`  
        @keyframes spin {  
          to { transform: rotate(360deg); }  
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
      `}</style>  
    </div>    
  );    
}