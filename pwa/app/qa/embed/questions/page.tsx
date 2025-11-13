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
    width: '100%',          
    height: '100%',  // Cambiar de '100vh' a '100%'  
    display: 'flex',          
    background: '#0B0B0B',    
    overflow: 'hidden'    
  }}>          
    <div style={{    
      width: '100%',    
      maxWidth: '1400px',    
      margin: '0 auto',    
      display: 'grid',    
      gridTemplateColumns: '1fr 400px',    
      gap: '32px',    
      padding: '32px',    
      height: '100%'    
    }}>  
        {/* Columna IZQUIERDA: Lista de preguntas */}  
        <div className="questions-scroll" style={{  
          height: '100%',  
          overflowY: 'auto',  
          paddingRight: '16px'  
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
                Be the first to ask a question using the form on the right.  
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
  
        {/* Columna DERECHA: Formulario */}  
        <div style={{  
          height: '100%',  
          display: 'flex',  
          flexDirection: 'column'  
        }}>  
          <div style={{  
            background: '#0F0F0F',  
            borderRadius: '24px',  
            border: '1px solid #242424',  
            padding: '32px',  
            height: 'fit-content',  
            position: 'sticky',  
            top: '0'  
          }}>  
            <h2 style={{  
              fontSize: '24px',  
              fontWeight: 'bold',  
              marginBottom: '16px',  
              color: '#F5F5F5'  
            }}>  
              💬 Ask a Question  
            </h2>  
            <p style={{  
              fontSize: '14px',  
              color: '#B6B9BF',  
              marginBottom: '24px'  
            }}>  
              Your question will appear in the list on the left. It will become public once it receives an answer.  
            </p>  
            <QuestionForm onCreated={handleQuestionCreated} />  
          </div>  
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