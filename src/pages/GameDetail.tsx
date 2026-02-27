import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Star, Calendar, Monitor, Tag, MessageSquare, Heart, Share2, ExternalLink, Download, Languages, Disc, Wrench, Cloud } from 'lucide-react';

export default function GameDetail() {
  const { slug } = useParams();
  const { user, token } = useContext(AuthContext);
  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetch(`/api/games/${slug}`)
      .then(res => res.json())
      .then(data => {
        setGame(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (user && game) {
      fetch('/api/users/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setIsFavorite(data.some(f => f.id === game.id));
        }
      });
    }
  }, [user, game, token]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !user) return;

    try {
      const res = await fetch('/api/users/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ game_id: game.id, content: comment })
      });
      
      if (res.ok) {
        const newComment = await res.json();
        setGame({ ...game, comments: [newComment, ...game.comments] });
        setComment('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRating = async (val: number) => {
    if (!user) return;
    try {
      await fetch('/api/users/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ game_id: game.id, rating: val })
      });
      setRating(val);
      // Refresh game data to get new average
      const res = await fetch(`/api/games/${slug}`);
      const data = await res.json();
      setGame(data);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFavorite = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/users/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ game_id: game.id })
      });
      const data = await res.json();
      setIsFavorite(data.isFavorite);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
      <div className="w-16 h-16 border-4 border-[#ff1e1e] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!game) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] text-white">
      <h2 className="text-2xl font-orbitron">Juego no encontrado</h2>
    </div>
  );

  return (
    <div className="bg-[#0f0f0f] min-h-screen pb-20">
      {/* Hero Banner */}
      <div className="relative h-[50vh] md:h-[70vh] w-full">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/60 to-transparent z-10" />
        <img 
          src={game.banner_url || `https://picsum.photos/seed/${game.slug}/1920/1080`} 
          alt={game.title} 
          className="w-full h-full object-cover"
        />
        
        <div className="absolute bottom-0 left-0 w-full z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 flex flex-col md:flex-row gap-8 items-end">
            <div className="w-32 h-40 md:w-48 md:h-64 bg-[#141414] rounded-lg border-2 border-gray-800 overflow-hidden flex-shrink-0 shadow-2xl">
              <img 
                src={game.cover_url || `https://picsum.photos/seed/${game.slug}-cover/400/600`} 
                alt={`${game.title} cover`} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-grow mb-4 md:mb-0">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-[#ff1e1e] text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">
                  {game.category_name}
                </span>
                <span className="flex items-center gap-1 text-yellow-500 font-bold bg-black/50 px-2 py-1 rounded">
                  <Star size={16} className="fill-yellow-500" />
                  {game.rating?.avg_rating ? Number(game.rating.avg_rating).toFixed(1) : 'S/N'}
                  <span className="text-gray-400 text-xs font-normal ml-1">({game.rating?.total_ratings || 0})</span>
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-orbitron font-bold text-white mb-2 leading-tight">
                {game.title}
              </h1>
              <p className="text-gray-400 text-lg flex items-center gap-2">
                {game.developer}
              </p>
            </div>
            
            <div className="flex gap-3 mb-4 md:mb-0 w-full md:w-auto">
              {user && (
                <button 
                  onClick={toggleFavorite}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded font-bold transition-colors ${
                    isFavorite 
                      ? 'bg-red-900/50 text-[#ff1e1e] border border-[#ff1e1e]' 
                      : 'bg-[#141414] text-white hover:bg-gray-800 border border-gray-700'
                  }`}
                >
                  <Heart size={20} className={isFavorite ? 'fill-[#ff1e1e]' : ''} />
                  {isFavorite ? 'Favorito' : 'Guardar'}
                </button>
              )}
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#141414] text-white hover:bg-gray-800 border border-gray-700 rounded font-bold transition-colors">
                <Share2 size={20} />
                Compartir
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* About */}
            <section>
              <h2 className="text-2xl font-orbitron font-bold text-white mb-6 flex items-center gap-2 border-b border-gray-800 pb-4">
                <Tag className="text-[#ff1e1e]" /> Acerca del Juego
              </h2>
              <div 
                className="text-gray-300 leading-relaxed text-lg prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: game.description }}
              />
            </section>

            {/* Installation Instructions */}
            {game.installation_instructions && (
              <section className="bg-[#1a0505] border border-[#ff1e1e]/30 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff1e1e]/10 rounded-full blur-3xl"></div>
                <h2 className="text-2xl font-orbitron font-bold text-[#ff1e1e] mb-4 flex items-center gap-2 relative z-10">
                  <Wrench /> Instrucciones de Instalación
                </h2>
                <div 
                  className="text-gray-300 leading-relaxed relative z-10 text-sm bg-black/50 p-4 rounded-lg border border-[#ff1e1e]/20 prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: game.installation_instructions }}
                />
              </section>
            )}

            {/* Trailer */}
            {game.trailer_url && (
              <section>
                <h2 className="text-2xl font-orbitron font-bold text-white mb-6 border-b border-gray-800 pb-4">Trailer Oficial</h2>
                <div className="aspect-video bg-black rounded-xl border border-gray-800 overflow-hidden relative">
                  <iframe 
                    src={game.trailer_url} 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              </section>
            )}

            {/* Comments */}
            <section>
              <h2 className="text-2xl font-orbitron font-bold text-white mb-6 flex items-center gap-2 border-b border-gray-800 pb-4">
                <MessageSquare className="text-[#ff1e1e]" /> Comentarios ({game.comments?.length || 0})
              </h2>
              
              {user ? (
                <form onSubmit={handleCommentSubmit} className="mb-10 bg-[#141414] p-6 rounded-xl border border-gray-800">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-800 overflow-hidden flex-shrink-0 border border-gray-700">
                      {user.avatar ? <img src={user.avatar} alt={user.username} /> : <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-500">{user.username.charAt(0).toUpperCase()}</div>}
                    </div>
                    <div className="flex-grow">
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="¿Qué te pareció este juego?"
                        className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg p-4 text-white focus:outline-none focus:border-[#ff1e1e] focus:ring-1 focus:ring-[#ff1e1e] min-h-[100px] resize-y"
                      ></textarea>
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400">Tu valoración:</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => handleRating(star)}
                                className="focus:outline-none"
                              >
                                <Star 
                                  size={20} 
                                  className={`${(hoverRating || rating) >= star ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'} transition-colors`} 
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <button 
                          type="submit"
                          disabled={!comment.trim()}
                          className="bg-[#ff1e1e] hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded font-bold transition-colors"
                        >
                          Comentar
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="bg-[#141414] p-6 rounded-xl border border-gray-800 mb-10 text-center">
                  <p className="text-gray-400 mb-4">Debes iniciar sesión para dejar un comentario o valorar el juego.</p>
                  <Link to="/login" className="inline-block bg-[#ff1e1e] hover:bg-red-700 text-white px-6 py-2 rounded font-bold transition-colors">
                    Iniciar Sesión
                  </Link>
                </div>
              )}

              <div className="space-y-6">
                {game.comments?.length > 0 ? (
                  game.comments.map((c: any) => (
                    <div key={c.id} className="flex gap-4 bg-[#141414] p-5 rounded-xl border border-gray-800">
                      <Link to={`/profile/${c.username}`} className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden flex-shrink-0 border border-gray-700 hover:border-[#ff1e1e] transition-colors">
                        {c.avatar ? <img src={c.avatar} alt={c.username} /> : <div className="w-full h-full flex items-center justify-center font-bold text-gray-500">{c.username.charAt(0).toUpperCase()}</div>}
                      </Link>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Link to={`/profile/${c.username}`} className="font-bold text-white hover:text-[#ff1e1e] transition-colors">{c.username}</Link>
                          <span className="text-xs text-gray-500">• {new Date(c.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-300">{c.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">Sé el primero en comentar.</p>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Info Card */}
            <div className="bg-[#141414] rounded-xl border border-gray-800 p-6">
              <h3 className="text-xl font-orbitron font-bold text-white mb-6 border-b border-gray-800 pb-4">Ficha Técnica</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Monitor className="text-gray-500 mt-1" size={18} />
                  <div>
                    <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Plataformas</span>
                    <div className="flex flex-wrap gap-2">
                      {game.platform?.split(',').map((p: string, i: number) => (
                        <span key={i} className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded">{p.trim()}</span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Calendar className="text-gray-500 mt-1" size={18} />
                  <div>
                    <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Lanzamiento</span>
                    <span className="text-white">{new Date(game.release_date).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Tag className="text-gray-500 mt-1" size={18} />
                  <div>
                    <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Desarrollador</span>
                    <span className="text-white">{game.developer}</span>
                  </div>
                </div>

                {game.language && (
                  <div className="flex items-start gap-3">
                    <Languages className="text-gray-500 mt-1" size={18} />
                    <div>
                      <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Idioma</span>
                      <span className="text-white">{game.language}</span>
                    </div>
                  </div>
                )}

                {game.format && (
                  <div className="flex items-start gap-3">
                    <Disc className="text-gray-500 mt-1" size={18} />
                    <div>
                      <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Formato</span>
                      <span className="text-white">{game.format}</span>
                    </div>
                  </div>
                )}
              </div>

              {game.store_url && (
                <a 
                  href={game.store_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-8 w-full bg-[#141414] border border-[#ff1e1e] hover:bg-[#ff1e1e]/10 text-[#ff1e1e] py-3 rounded font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  Ver en Tienda <ExternalLink size={18} />
                </a>
              )}

              {(game.download_url || game.link_mega || game.link_mediafire || game.link_drive) && (
                <div className="mt-4 border-t border-gray-800 pt-4">
                  <h4 className="text-white font-bold mb-3 flex items-center gap-2"><Download size={18} className="text-[#ff1e1e]" /> Enlaces de Descarga</h4>
                  <div className="space-y-2">
                    {game.link_mega && (
                      <a href={game.link_mega} target="_blank" rel="noopener noreferrer" className="w-full bg-[#D9252A] hover:bg-[#b31e22] text-white py-2 px-4 rounded font-bold flex items-center justify-between transition-colors">
                        <span className="flex items-center gap-2"><Cloud size={18} /> MEGA</span>
                        <ExternalLink size={16} />
                      </a>
                    )}
                    {game.link_mediafire && (
                      <a href={game.link_mediafire} target="_blank" rel="noopener noreferrer" className="w-full bg-[#0070F0] hover:bg-[#005bb5] text-white py-2 px-4 rounded font-bold flex items-center justify-between transition-colors">
                        <span className="flex items-center gap-2"><Cloud size={18} /> MediaFire</span>
                        <ExternalLink size={16} />
                      </a>
                    )}
                    {game.link_drive && (
                      <a href={game.link_drive} target="_blank" rel="noopener noreferrer" className="w-full bg-[#1FA463] hover:bg-[#17824e] text-white py-2 px-4 rounded font-bold flex items-center justify-between transition-colors">
                        <span className="flex items-center gap-2"><Cloud size={18} /> Google Drive</span>
                        <ExternalLink size={16} />
                      </a>
                    )}
                    {game.download_url && !game.link_mega && !game.link_mediafire && !game.link_drive && (
                      <a href={game.download_url} target="_blank" rel="noopener noreferrer" className="w-full bg-[#ff1e1e] hover:bg-red-700 text-white py-2 px-4 rounded font-bold flex items-center justify-between transition-colors">
                        <span className="flex items-center gap-2"><Download size={18} /> Descarga Directa</span>
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                  
                  <div className="flex justify-between mt-4 text-xs text-gray-400 bg-gray-900/50 p-2 rounded">
                    {game.file_size && <span><strong className="text-gray-300">Peso:</strong> {game.file_size}</span>}
                    {game.version && <span><strong className="text-gray-300">Versión:</strong> {game.version}</span>}
                  </div>
                </div>
              )}
            </div>

            {/* Requirements */}
            <div className="bg-[#141414] rounded-xl border border-gray-800 p-6">
              <h3 className="text-xl font-orbitron font-bold text-white mb-6 border-b border-gray-800 pb-4">Requisitos (PC)</h3>
              
              <div className="mb-6">
                <h4 className="text-[#ff1e1e] font-bold mb-2 text-sm uppercase tracking-wider">Mínimos</h4>
                <p className="text-gray-400 text-sm whitespace-pre-line">
                  {game.min_requirements || "SO: Windows 10 64-bit\nProcesador: Intel Core i5-8400 / AMD Ryzen 3 3300X\nMemoria: 8 GB de RAM\nGráficos: NVIDIA GeForce GTX 1060 3GB / AMD Radeon RX 580 4GB\nDirectX: Versión 12\nAlmacenamiento: 50 GB de espacio disponible"}
                </p>
              </div>
              
              <div>
                <h4 className="text-[#ff1e1e] font-bold mb-2 text-sm uppercase tracking-wider">Recomendados</h4>
                <p className="text-gray-400 text-sm whitespace-pre-line">
                  {game.rec_requirements || "SO: Windows 10/11 64-bit\nProcesador: Intel Core i7-8700K / AMD Ryzen 5 3600X\nMemoria: 16 GB de RAM\nGráficos: NVIDIA GeForce RTX 2080S / AMD Radeon RX 6700 XT\nDirectX: Versión 12\nAlmacenamiento: 50 GB de espacio disponible (SSD recomendado)"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
