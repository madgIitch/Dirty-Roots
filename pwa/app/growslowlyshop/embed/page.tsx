// pwa/app/growslowlyshop/embed/page.tsx  
"use client";  
  
import { useEffect, useState } from "react";  
import { ensureAnonAuth } from "@/src/lib/firebase";  
import { listProducts } from "@/src/lib/firestore";  
  
export default function EmbedGrowSlowlyShopPage() {  
  const [mounted, setMounted] = useState(false);  
  const [products, setProducts] = useState<any[]>([]);  
  const [loading, setLoading] = useState(true);  
  
  // Primer useEffect: marcar como montado  
  useEffect(() => {  
    setMounted(true);  
  }, []);  
  
  // Segundo useEffect: cargar datos después de montar  
  useEffect(() => {  
    if (!mounted) return;  
  
    (async () => {  
      try {  
        await ensureAnonAuth();  
        await loadProducts();  
      } catch (error) {  
        console.error("Error initializing:", error);  
      }  
    })();  
  }, [mounted]);  
  
  async function loadProducts() {  
    try {  
      const allProducts = await listProducts(50);  
      setProducts(allProducts);  
    } catch (error) {  
      console.error("Error loading products:", error);  
    } finally {  
      setLoading(false);  
    }  
  }  
  
  if (!mounted || loading) {  
    return (  
      <div style={{  
        width: '100%',  
        height: '100%',  
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
          <p style={{ color: '#B6B9BF', fontSize: '18px' }}>Loading shop...</p>  
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
      height: '600px', // Altura fija para el iframe  
      background: '#0B0B0B',  
      padding: '32px',  
      boxSizing: 'border-box',  
      overflow: 'hidden'  
    }}>  
      {/* Header */}  
      <div style={{  
        marginBottom: '24px',  
        textAlign: 'center'  
      }}>  
        <h1 style={{  
          fontSize: '28px',  
          fontWeight: 'bold',  
          color: '#F5F5F5',  
          marginBottom: '8px'  
        }}>  
          🛍️ Things that grow slowly shop  
        </h1>  
        <p style={{  
          fontSize: '14px',  
          color: '#B6B9BF'  
        }}>  
          Exclusive items for mindful living  
        </p>  
      </div>  
  
      {/* Products Carousel */}  
      {products.length === 0 ? (  
        <div style={{  
          textAlign: 'center',  
          padding: '60px 20px',  
          background: '#0F0F0F',  
          borderRadius: '24px',  
          border: '1px solid #242424'  
        }}>  
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏪</div>  
          <p style={{  
            fontSize: '18px',  
            color: '#B6B9BF',  
            marginBottom: '8px'  
          }}>  
            No products available  
          </p>  
          <p style={{  
            fontSize: '14px',  
            color: '#757575'  
          }}>  
            Check back soon for new items  
          </p>  
        </div>  
      ) : (  
        <div   
          className="product-carousel-wrapper"  
          style={{  
            width: '100%',  
            maxWidth: '1200px',  
            height: 'calc(100% - 100px)', // Altura restante después del header  
            margin: '0 auto',  
            display: 'flex',  
            flexDirection: 'row',  
            overflowX: 'auto',  
            overflowY: 'hidden',  
            scrollSnapType: 'x mandatory',  
            WebkitOverflowScrolling: 'touch',  
            gap: '20px',  
            padding: '10px',  
            boxSizing: 'border-box'  
          }}  
        >  
          {products.map(product => (  
            <a  
              key={product.id}  
              href={product.link}  
              target="_blank"  
              rel="noopener noreferrer"  
              className="product-card"  
              style={{  
                textDecoration: 'none',  
                flex: '0 0 280px', // Ancho fijo para forzar scroll horizontal  
                minWidth: '280px',  
                maxWidth: '280px',  
                height: 'fit-content',  
                padding: '1px',  
                background: 'linear-gradient(180deg, #141414 0%, #0F0F0F 100%)',  
                overflow: 'hidden',  
                borderRadius: '18px',  
                outline: '1px rgba(255, 255, 255, 0.08) solid',  
                outlineOffset: '-1px',  
                flexDirection: 'column',  
                justifyContent: 'flex-start',  
                alignItems: 'flex-start',  
                display: 'flex',  
                cursor: 'pointer',  
                transition: 'transform 0.2s',  
                scrollSnapAlign: 'start'  
              }}  
              onMouseEnter={(e) => {  
                e.currentTarget.style.transform = 'translateY(-4px)';  
              }}  
              onMouseLeave={(e) => {  
                e.currentTarget.style.transform = 'translateY(0)';  
              }}  
            >  
              {/* Background Image */}  
              <div  
                className="Background"  
                style={{  
                  alignSelf: 'stretch',  
                  height: '280px',  
                  background: product.imageBase64  
                    ? `url(${product.imageBase64}) center/cover no-repeat`  
                    : '#0B0B0B',  
                  position: 'relative'  
                }}  
              >  
                {!product.imageBase64 && (  
                  <div style={{  
                    position: 'absolute',  
                    top: '50%',  
                    left: '50%',  
                    transform: 'translate(-50%, -50%)',  
                    fontSize: '48px',  
                    opacity: 0.3  
                  }}>  
                    📦  
                  </div>  
                )}  
              </div>  
  
              {/* Product Info Container */}  
              <div  
                style={{  
                  alignSelf: 'stretch',  
                  padding: '14px',  
                  flexDirection: 'column',  
                  justifyContent: 'flex-start',  
                  alignItems: 'flex-start',  
                  gap: '7.20px',  
                  display: 'flex'  
                }}  
              >  
                {/* Label and Price Row */}  
                <div  
                  style={{  
                    alignSelf: 'stretch',  
                    justifyContent: 'space-between',  
                    alignItems: 'center',  
                    display: 'inline-flex'  
                  }}  
                >  
                  {/* Label */}  
                  <div  
                    style={{  
                      flexDirection: 'column',  
                      justifyContent: 'flex-start',  
                      alignItems: 'flex-start',  
                      display: 'inline-flex'  
                    }}  
                  >  
                    <div  
                      style={{  
                        justifyContent: 'center',  
                        display: 'flex',  
                        flexDirection: 'column',  
                        color: '#B6B9BF',  
                        fontSize: '14.40px',  
                        fontFamily: 'Segoe UI, system-ui, sans-serif',  
                        fontWeight: 400,  
                        lineHeight: '20.88px',  
                        wordWrap: 'break-word'  
                      }}  
                    >  
                      {product.label}  
                    </div>  
                  </div>  
  
                  {/* Price */}  
                  <div  
                    style={{  
                      flexDirection: 'column',  
                      justifyContent: 'flex-start',  
                      alignItems: 'flex-start',  
                      display: 'inline-flex'  
                    }}  
                  >  
                    <div  
                      style={{  
                        justifyContent: 'center',  
                        display: 'flex',  
                        flexDirection: 'column',  
                        color: '#B6B9BF',  
                        fontSize: '14.40px',  
                        fontFamily: 'Segoe UI, system-ui, sans-serif',  
                        fontWeight: 400,  
                        lineHeight: '20.88px',  
                        wordWrap: 'break-word'  
                      }}  
                    >  
                      €{product.price.toFixed(2)}  
                    </div>  
                  </div>  
                </div>  
  
                {/* Product Name */}  
                <div  
                  style={{  
                    alignSelf: 'stretch',  
                    paddingBottom: '0.52px',  
                    flexDirection: 'column',  
                    justifyContent: 'flex-start',  
                    alignItems: 'flex-start',  
                    display: 'flex'  
                  }}  
                >  
                  <div  
                    style={{  
                      alignSelf: 'stretch',  
                      justifyContent: 'center',  
                      display: 'flex',  
                      flexDirection: 'column',  
                      color: '#F5F5F5',  
                      fontSize: '16.80px',  
                      fontFamily: 'Segoe UI, system-ui, sans-serif',  
                      fontWeight: 700,  
                      lineHeight: '24.36px',  
                      wordWrap: 'break-word'  
                    }}  
                  >  
                    {product.name}  
                  </div>  
                </div>  
              </div>  
            </a>  
          ))}  
        </div>  
      )}  
  
      <style jsx>{`  
        @keyframes spin {  
          to { transform: rotate(360deg); }  
        }  
  
        /* Ocultar scrollbar en todos los navegadores */  
        .product-carousel-wrapper::-webkit-scrollbar {  
          display: none;  
        }  
          
        .product-carousel-wrapper {  
          -ms-overflow-style: none;  /* IE y Edge */  
          scrollbar-width: none;  /* Firefox */  
        }  
  
        /* Ajustes específicos para móvil */  
        @media (max-width: 768px) {  
          .product-carousel-wrapper {  
            padding: 10px 16px !important;  
            gap: 16px !important;  
          }  
  
          .product-card {  
            flex: 0 0 calc(100% - 32px) !important;  
            min-width: 260px !important;  
            max-width: 300px !important;  
          }  
  
          .product-card .Background {  
            height: 240px !important;  
          }  
        }  
      `}</style>  
    </div>  
  );  
}