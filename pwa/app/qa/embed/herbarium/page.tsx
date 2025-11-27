// pwa/app/qa/embed/herbarium/page.tsx  
'use client';  
  
import { useState, useEffect } from 'react';  
import { useForm } from 'react-hook-form';  
import { z } from 'zod';  
import { zodResolver } from '@hookform/resolvers/zod';  
import { listPlantPhotos, addPlantPhoto, addLikeToPhoto, removeLikeFromPhoto, addCommentToPhoto } from '@/src/lib/firestore';  
import UserProtectedRoute from '@/src/components/UserProtectedRoute';  
import imageCompression from 'browser-image-compression';  
import { auth } from '@/src/lib/firebase';  
  
const plantPhotoSchema = z.object({  
  plantName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),  
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),  
  imageBase64: z.string().min(1, 'La imagen es requerida')  
});  
  
type PlantPhotoFormValues = z.infer<typeof plantPhotoSchema>;  
  
function HerbariumPage() {  
  const [mounted, setMounted] = useState(false);  
  const [photos, setPhotos] = useState<any[]>([]);  
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState('');  
  const [showUploadForm, setShowUploadForm] = useState(false);  
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});  
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});  
    
  const { register, handleSubmit, formState, setValue, watch, reset } = useForm<PlantPhotoFormValues>({  
    resolver: zodResolver(plantPhotoSchema),  
    defaultValues: {  
      plantName: '',  
      description: '',  
      imageBase64: ''  
    }  
  });  
  
  const imageBase64 = watch('imageBase64');  
  
  useEffect(() => {  
    setMounted(true);  
  }, []);  
  
  useEffect(() => {  
    if (!mounted) return;  
    loadPhotos();  
  }, [mounted]);  
  
  async function loadPhotos() {  
    try {  
      const data = await listPlantPhotos(50);  
      setPhotos(data.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()));  
    } catch (error) {  
      console.error('Error loading photos:', error);  
    } finally {  
      setLoading(false);  
    }  
  }  
  
  async function handleImageUpload(file: File) {  
    try {  
      setError('Comprimiendo imagen...');  
        
      const options = {  
        maxSizeMB: 0.4,  
        maxWidthOrHeight: 600,  
        useWebWorker: true,  
        fileType: 'image/jpeg',  
        initialQuality: 0.7  
      };  
        
      const compressedFile = await imageCompression(file, options);  
        
      console.log(`Original: ${(file.size / 1024).toFixed(2)}KB`);  
      console.log(`Comprimido: ${(compressedFile.size / 1024).toFixed(2)}KB`);  
        
      const reader = new FileReader();  
      reader.onloadend = () => {  
        const base64String = reader.result as string;  
        const sizeInBytes = base64String.length;  
          
        if (sizeInBytes > 900000) {  
          setError('La imagen es demasiado grande después de la compresión. Intenta con una imagen más pequeña.');  
          return;  
        }  
          
        setValue('imageBase64', base64String);  
        setError('');  
      };  
      reader.readAsDataURL(compressedFile);  
        
    } catch (error) {  
      console.error('Error en compresión de imagen:', error);  
      setError('Error procesando la imagen. Por favor intenta con otra imagen.');  
    }  
  }  
  
  const onSubmit = handleSubmit(async (values) => {  
    try {  
      const user = auth.currentUser;  
      if (!user || user.isAnonymous) {  
        alert('Debes estar autenticado con email para subir fotos');  
        return;  
      }  
  
      // Obtener el nombre del usuario desde su email o displayName  
      const userName = user.displayName || user.email?.split('@')[0] || 'Usuario';  
  
      await addPlantPhoto({  
        plantName: values.plantName,  
        description: values.description,  
        imageBase64: values.imageBase64,  
        createdBy: user.uid,  
        userName: userName,  
        likes: [],  
        likesCount: 0,  
        comments: []  
      });  
  
      reset();  
      setShowUploadForm(false);  
      loadPhotos();  
    } catch (error) {  
      console.error('Error uploading photo:', error);  
      alert('Error al subir la foto');  
    }  
  });  
  
  async function handleLike(photoId: string) {  
    try {  
      const user = auth.currentUser;  
      if (!user) return;  
  
      const photo = photos.find(p => p.id === photoId);  
      if (!photo) return;  
  
      if (photo.likes?.includes(user.uid)) {  
        await removeLikeFromPhoto(photoId, user.uid);  
      } else {  
        await addLikeToPhoto(photoId, user.uid);  
      }  
        
      loadPhotos();  
    } catch (error) {  
      console.error('Error toggling like:', error);  
    }  
  }  
  
  async function handleComment(photoId: string) {  
    try {  
      const user = auth.currentUser;  
      if (!user) return;  
  
      const commentText = commentInputs[photoId];  
      if (!commentText?.trim()) return;  
  
      const userName = user.displayName || user.email?.split('@')[0] || 'Usuario';  
  
      await addCommentToPhoto(photoId, {  
        text: commentText.trim(),  
        createdBy: user.uid,  
        userName: userName  
      });  
  
      setCommentInputs({ ...commentInputs, [photoId]: '' });  
      loadPhotos();  
    } catch (error) {  
      console.error('Error adding comment:', error);  
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
          <p style={{ color: '#B6B9BF', fontSize: '18px' }}>Cargando...</p>  
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
      height: '100%',   
      overflowY: 'auto',   
      padding: '24px',  
      paddingBottom: '94px'  
    }}>  
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>  
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#F5F5F5', marginBottom: '8px' }}>  
          🌿 Herbario Comunitario  
        </h1>  
        <p style={{ color: '#B6B9BF', fontSize: '16px' }}>  
          Comparte tu planta del mes con la comunidad  
        </p>  
      </div>  
  
      {/* Botón flotante para subir */}  
      <button  
        onClick={() => setShowUploadForm(true)}  
        style={{  
          position: 'fixed',  
          bottom: '90px',  
          right: '20px',  
          width: '56px',  
          height: '56px',  
          borderRadius: '50%',  
          background: '#A4CB3E',  
          border: 'none',  
          color: '#0B0B0B',  
          fontSize: '24px',  
          cursor: 'pointer',  
          zIndex: 1000,  
          boxShadow: '0 4px 12px rgba(164, 203, 62, 0.3)'  
        }}  
      >  
        📷  
      </button>  
  
      {/* Grid de fotos estilo Instagram */}  
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
      ) : photos.length === 0 ? (  
        <div style={{  
          borderRadius: '16px',  
          padding: '24px',  
          textAlign: 'center',  
          border: '1px solid #242424',  
          background: '#0F0F0F'  
        }}>  
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌿</div>  
          <p style={{ marginBottom: '12px', fontSize: '18px', color: '#B6B9BF' }}>  
            No hay fotos aún.  
          </p>  
          <p style={{ fontSize: '14px', color: '#B6B9BF' }}>  
            Sé el primero en compartir tu planta.  
          </p>  
        </div>  
      ) : (  
        <div style={{   
          display: 'grid',   
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',   
          gap: '16px',  
          maxWidth: '1200px',  
          margin: '0 auto'  
        }}>  
          {photos.map((photo) => {  
            const user = auth.currentUser;  
            const isLiked = user && photo.likes?.includes(user.uid);  
              
            return (  
              <div key={photo.id} style={{  
                background: '#0F0F0F',  
                borderRadius: '12px',  
                border: '1px solid #242424',  
                overflow: 'hidden',  
                display: 'flex',  
                flexDirection: 'column',  
                height: '600px'  
              }}>  
                {/* Imagen grande */}  
                <div style={{  
                  height: '400px',  
                  backgroundImage: `url(${photo.imageBase64})`,  
                  backgroundSize: 'cover',  
                  backgroundPosition: 'center',  
                  position: 'relative'  
                }}>  
                  {/* Overlay con info del usuario */}  
                  <div style={{  
                    position: 'absolute',  
                    top: 0,  
                    left: 0,  
                    right: 0,  
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)',  
                    padding: '12px 16px',  
                    color: '#F5F5F5'  
                  }}>  
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>  
                      {photo.userName || 'Usuario'}  
                    </p>  
                  </div>  
                </div>  
  
                {/* Info y acciones */}  
                <div style={{   
                  padding: '16px',   
                  flex: 1,   
                  display: 'flex',   
                  flexDirection: 'column',  
                  justifyContent: 'space-between'  
                }}>  
                  <div>  
                    <h3 style={{ color: '#F5F5F5', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', margin: 0 }}>  
                      {photo.plantName}  
                    </h3>  
                    <p style={{ color: '#B6B9BF', fontSize: '14px', lineHeight: '1.5', margin: 0, marginBottom: '12px' }}>  
                      {photo.description}  
                    </p>  
                  </div>  
  
                  {/* Likes y comentarios */}  
                  <div style={{ borderTop: '1px solid #242424', paddingTop: '12px' }}>  
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>  
                      <button   
                        onClick={() => handleLike(photo.id)}  
                        style={{  
                          background: 'none',  
                          border: 'none',  
                          color: isLiked ? '#FF60A8' : '#B6B9BF',  
                          cursor: 'pointer',  
                          fontSize: '14px',  
                          padding: 0,  
                          fontWeight: isLiked ? '600' : 'normal'  
                        }}  
                      >  
                        {isLiked ? '❤️' : '🤍'} {photo.likesCount || 0}  
                      </button>  
                      <button   
                        onClick={() => setShowComments({ ...showComments, [photo.id]: !showComments[photo.id] })}  
                        style={{  
                          background: 'none',  
                          border: 'none',  
                          color: '#B6B9BF',  
                          cursor: 'pointer',  
                          fontSize: '14px',  
                          padding: 0  
                        }}  
                      >  
                        💬 {photo.comments?.length || 0}  
                      </button>  
                    </div>  
  
                    {/* Sección de comentarios */}  
                    {showComments[photo.id] && (  
                      <div style={{ marginTop: '12px' }}>  
                        {/* Lista de comentarios */}  
                        {photo.comments?.slice(-3).map((comment: any) => (  
                          <div key={comment.id} style={{ marginBottom: '8px' }}>  
                            <p style={{ margin: 0, fontSize: '12px', color: '#A4CB3E', fontWeight: '600' }}>  
                              {comment.userName || 'Usuario'}  
                            </p>  
                            <p style={{ margin: 0, fontSize: '13px', color: '#B6B9BF' }}>  
                              {comment.text}  
                            </p>  
                          </div>  
                        ))}  
  
                        {/* Input de comentario */}  
                        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>  
                          <input  
                            type="text"  
                            value={commentInputs[photo.id] || ''}  
                            onChange={(e) => setCommentInputs({ ...commentInputs, [photo.id]: e.target.value })}  
                            placeholder="Añade un comentario..."  
                            style={{  
                              flex: 1,  
                              background: '#0B0B0B',  
                              border: '1px solid #2A2A2A',  
                              borderRadius: '8px',  
                              padding: '8px 12px',  
                              color: '#F5F5F5',  
                              fontSize: '12px'  
                            }}  
                            onKeyPress={(e) => {  
                              if (e.key === 'Enter') {  
                                handleComment(photo.id);  
                              }  
                            }}  
                          />  
                          <button  
                            onClick={() => handleComment(photo.id)}  
                            style={{  
                              background: '#A4CB3E',  
                              border: 'none',  
                              borderRadius: '8px',  
                              padding: '8px 12px',  
                              color: '#0B0B0B',  
                              fontSize: '12px',  
                              fontWeight: '600',  
                              cursor: 'pointer'  
                            }}  
                          >  
                            Enviar  
                          </button>  
                        </div>  
                      </div>  
                    )}  
                  </div>  
                </div>  
              </div>  
            );  
          })}  
        </div>  
      )}  
  
      {/* Formulario de subida (modal/drawer) */}  
      {showUploadForm && (  
        <div style={{  
          position: 'fixed',  
          top: 0,  
          left: 0,  
          right: 0,  
          bottom: 0,  
          background: 'rgba(0, 0, 0, 0.5)',  
          zIndex: 2000,  
          display: 'flex',  
          alignItems: 'flex-end'  
        }}>  
          <div style={{  
            background: '#0F0F0F',  
            borderRadius: '24px 24px 0 0',  
            padding: '32px',  
            width: '100%',  
            maxHeight: '85vh',  
            overflowY: 'auto'  
          }}>  
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>  
              <h2 style={{ color: '#F5F5F5', fontSize: '20px', fontWeight: 'bold' }}>  
                Subir Foto de Planta  
              </h2>  
              <button  
                onClick={() => {  
                  setShowUploadForm(false);  
                  setError('');  
                }}  
                style={{ background: 'none', border: 'none', color: '#B6B9BF', fontSize: '24px', cursor: 'pointer' }}  
              >  
                ✕  
              </button>  
            </div>  
  
            {error && (  
              <div style={{  
                marginBottom: '16px',  
                padding: '12px',  
                background: 'rgba(255, 96, 168, 0.1)',  
                border: '1px solid #FF60A8',  
                borderRadius: '8px',  
                color: '#FF60A8',  
                fontSize: '14px'  
              }}>  
                {error}  
              </div>  
            )}  
  
            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>  
              <div>  
                <label style={{ color: '#F5F5F5', fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>  
                  Nombre de la Planta  
                </label>  
                <input  
                  {...register('plantName')}  
                  style={{  
                    width: '100%',  
                    background: '#0B0B0B',  
                    border: '1px solid #2A2A2A',  
                    borderRadius: '12px',  
                    padding: '12px 16px',  
                    color: '#F5F5F5',  
                    fontSize: '14px'  
                  }}  
                    placeholder="Ej: Monstera Deliciosa"  
                />  
              </div>  
  
              <div>  
                <label style={{ color: '#F5F5F5', fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>  
                  Descripción  
                </label>  
                <textarea  
                  {...register('description')}  
                  rows={3}  
                  style={{  
                    width: '100%',  
                    background: '#0B0B0B',  
                    border: '1px solid #2A2A2A',  
                    borderRadius: '12px',  
                    padding: '12px 16px',  
                    color: '#F5F5F5',  
                    fontSize: '14px',  
                    resize: 'vertical'  
                  }}  
                  placeholder="Cuéntanos sobre tu planta..."  
                />  
              </div>  
  
              <div>  
                <label style={{ color: '#F5F5F5', fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>  
                  Foto  
                </label>  
                <input  
                  type="file"  
                  accept="image/*"  
                  onChange={(e) => {  
                    const file = e.target.files?.[0];  
                    if (file) {  
                      handleImageUpload(file);  
                    }  
                  }}  
                  style={{  
                    width: '100%',  
                    background: '#0B0B0B',  
                    border: '1px solid #2A2A2A',  
                    borderRadius: '12px',  
                    padding: '12px 16px',  
                    color: '#F5F5F5',  
                    fontSize: '14px'  
                  }}  
                />  
                {imageBase64 && (  
                  <div style={{  
                    marginTop: '12px',  
                    height: '200px',  
                    backgroundImage: `url(${imageBase64})`,  
                    backgroundSize: 'cover',  
                    backgroundPosition: 'center',  
                    borderRadius: '12px',  
                    border: '1px solid #2A2A2A'  
                  }} />  
                )}  
              </div>  
  
              <button  
                type="submit"  
                disabled={formState.isSubmitting}  
                style={{  
                  width: '100%',  
                  padding: '14px 24px',  
                  background: formState.isSubmitting ? '#2A2A2A' : '#A4CB3E',  
                  color: formState.isSubmitting ? '#666666' : '#0B0B0B',  
                  border: 'none',  
                  borderRadius: '9999px',  
                  fontSize: '16px',  
                  fontWeight: '700',  
                  cursor: formState.isSubmitting ? 'not-allowed' : 'pointer'  
                }}  
              >  
                {formState.isSubmitting ? 'Subiendo...' : 'Subir Foto'}  
              </button>  
            </form>  
          </div>  
        </div>  
      )}  
    </div>  
  );  
}  
  
export default function ProtectedHerbariumPage() {  
  return (  
    <UserProtectedRoute>  
      <HerbariumPage />  
    </UserProtectedRoute>  
  );  
}