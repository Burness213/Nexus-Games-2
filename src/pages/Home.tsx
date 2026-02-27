import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star, Clock, Gamepad2, TrendingUp, ChevronLeft } from 'lucide-react';

export default function Home() {
  const [featuredGames, setFeaturedGames] = useState<any[]>([]);
  const [latestGames, setLatestGames] = useState<any[]>([]);
  const [updatedGames, setUpdatedGames] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetch('/api/games/featured')
      .then(res => res.json())
      .then(data => setFeaturedGames(Array.isArray(data) ? data : []))
      .catch(() => setFeaturedGames([]));
      
    fetch('/api/games?sort=recent')
      .then(res => res.json())
      .then(data => setLatestGames(Array.isArray(data) ? data.slice(0, 8) : []))
      .catch(() => setLatestGames([]));
      
    fetch('/api/games?sort=updated')
      .then(res => res.json())
      .then(data => setUpdatedGames(Array.isArray(data) ? data.slice(0, 4) : []))
      .catch(() => setUpdatedGames([]));
      
    fetch('/api/news')
      .then(res => res.json())
      .then(data => setNews(Array.isArray(data) ? data.slice(0, 4) : []))
      .catch(() => setNews([]));
  }, []);

  useEffect(() => {
    if (featuredGames.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredGames.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [featuredGames]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % featuredGames.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + featuredGames.length) % featuredGames.length);

  return (
    <div className="bg-[#0f0f0f] min-h-screen">
      {/* Hero Carousel */}
      <section className="relative h-[70vh] w-full overflow-hidden bg-black">
        {featuredGames.length > 0 ? (
          <>
            {featuredGames.map((game, index) => (
              <div
                key={game.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/50 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f] via-[#0f0f0f]/80 to-transparent z-10" />
                <img
                  src={game.banner_url || `https://picsum.photos/seed/${game.slug}/1920/1080`}
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 z-20 p-8 md:p-16 max-w-3xl">
                  <span className="inline-block px-3 py-1 bg-[#ff1e1e] text-white text-xs font-bold uppercase tracking-wider mb-4 rounded-sm">
                    Destacado
                  </span>
                  <h1 className="text-4xl md:text-6xl font-orbitron font-bold text-white mb-4 leading-tight">
                    {game.title}
                  </h1>
                  <p className="text-gray-300 text-lg mb-8 line-clamp-2 max-w-2xl">
                    {game.description}
                  </p>
                  <div className="flex gap-4">
                    <Link
                      to={`/games/${game.slug}`}
                      className="bg-[#ff1e1e] hover:bg-red-700 text-white px-8 py-3 rounded font-bold uppercase tracking-wider transition-all hover:scale-105 flex items-center gap-2"
                    >
                      Ver Ficha <ChevronRight size={20} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Carousel Controls */}
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-[#ff1e1e] text-white p-3 rounded-full backdrop-blur-sm transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-[#ff1e1e] text-white p-3 rounded-full backdrop-blur-sm transition-all"
            >
              <ChevronRight size={24} />
            </button>
            
            {/* Carousel Indicators */}
            <div className="absolute bottom-8 right-8 z-30 flex gap-2">
              {featuredGames.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-12 h-1.5 rounded-full transition-all ${
                    idx === currentSlide ? 'bg-[#ff1e1e]' : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="w-16 h-16 border-4 border-[#ff1e1e] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Latest Games Grid */}
        <section className="mb-20">
          <div className="flex justify-between items-end mb-8 border-b border-gray-800 pb-4">
            <div>
              <h2 className="text-3xl font-orbitron font-bold text-white flex items-center gap-3">
                <Gamepad2 className="text-[#ff1e1e]" size={32} />
                Últimos Lanzamientos
              </h2>
              <p className="text-gray-400 mt-2">Los juegos más recientes añadidos a la plataforma</p>
            </div>
            <Link to="/search?sort=recent" className="text-[#ff1e1e] hover:text-white flex items-center gap-1 font-medium transition-colors">
              Ver todos <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestGames.map((game) => (
              <Link key={game.id} to={`/games/${game.slug}`} className="group bg-[#141414] rounded-xl overflow-hidden border border-gray-800 hover:border-[#ff1e1e]/50 transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_-15px_rgba(255,30,30,0.3)]">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={game.cover_url || game.banner_url || `https://picsum.photos/seed/${game.slug}/400/600`}
                    alt={game.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-[#ff1e1e] flex items-center gap-1">
                    <Star size={12} className="fill-[#ff1e1e]" />
                    {game.avg_rating ? Number(game.avg_rating).toFixed(1) : 'S/N'}
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#141414] to-transparent"></div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{game.category_name || 'General'}</span>
                    <span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12}/> {new Date(game.release_date).getFullYear()}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#ff1e1e] transition-colors line-clamp-1">{game.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {game.language && (
                      <span className="text-[10px] px-2 py-1 bg-blue-900/40 text-blue-400 border border-blue-800/50 rounded-sm uppercase font-bold">{game.language.split(',')[0]}</span>
                    )}
                    {game.format && (
                      <span className="text-[10px] px-2 py-1 bg-purple-900/40 text-purple-400 border border-purple-800/50 rounded-sm uppercase font-bold">{game.format}</span>
                    )}
                    {game.platform?.split(',').slice(0, 2).map((p: string, i: number) => (
                      <span key={i} className="text-[10px] px-2 py-1 bg-gray-800 text-gray-300 rounded-sm uppercase">{p.trim()}</span>
                    ))}
                    {game.platform?.split(',').length > 2 && (
                      <span className="text-[10px] px-2 py-1 bg-gray-800 text-gray-300 rounded-sm">+{game.platform.split(',').length - 2}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Updated Games Grid */}
        <section className="mb-20">
          <div className="flex justify-between items-end mb-8 border-b border-gray-800 pb-4">
            <div>
              <h2 className="text-3xl font-orbitron font-bold text-white flex items-center gap-3">
                <span className="w-8 h-8 bg-[#1FA463] rounded flex items-center justify-center">
                  <span className="text-white text-xl">🔄</span>
                </span>
                Juegos Actualizados
              </h2>
              <p className="text-gray-400 mt-2">Los últimos juegos que han recibido actualizaciones o nuevos enlaces</p>
            </div>
            <Link to="/search?sort=updated" className="text-[#1FA463] hover:text-white flex items-center gap-1 font-medium transition-colors">
              Ver todos <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {updatedGames.map((game) => (
              <Link key={game.id} to={`/games/${game.slug}`} className="group bg-[#141414] rounded-xl overflow-hidden border border-gray-800 hover:border-[#1FA463]/50 transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_-15px_rgba(31,164,99,0.3)]">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={game.cover_url || game.banner_url || `https://picsum.photos/seed/${game.slug}/400/600`}
                    alt={game.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-[#1FA463] flex items-center gap-1">
                    <Star size={12} className="fill-[#1FA463]" />
                    {game.avg_rating ? Number(game.avg_rating).toFixed(1) : 'S/N'}
                  </div>
                  <div className="absolute top-3 left-3 bg-[#1FA463] text-white px-2 py-1 rounded text-xs font-bold uppercase tracking-wider shadow-lg">
                    Actualizado
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#141414] to-transparent"></div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{game.category_name || 'General'}</span>
                    <span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12}/> {new Date(game.updated_at || game.release_date).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#1FA463] transition-colors line-clamp-1">{game.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {game.version && (
                      <span className="text-[10px] px-2 py-1 bg-green-900/40 text-green-400 border border-green-800/50 rounded-sm uppercase font-bold">{game.version}</span>
                    )}
                    {game.language && (
                      <span className="text-[10px] px-2 py-1 bg-blue-900/40 text-blue-400 border border-blue-800/50 rounded-sm uppercase font-bold">{game.language.split(',')[0]}</span>
                    )}
                    {game.format && (
                      <span className="text-[10px] px-2 py-1 bg-purple-900/40 text-purple-400 border border-purple-800/50 rounded-sm uppercase font-bold">{game.format}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* News & Trending Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Latest News */}
          <section className="lg:col-span-2">
            <div className="flex justify-between items-end mb-8 border-b border-gray-800 pb-4">
              <h2 className="text-3xl font-orbitron font-bold text-white flex items-center gap-3">
                <span className="w-8 h-8 bg-[#ff1e1e] rounded flex items-center justify-center">
                  <span className="text-white text-xl">📰</span>
                </span>
                Últimas Noticias
              </h2>
              <Link to="/news" className="text-[#ff1e1e] hover:text-white flex items-center gap-1 font-medium transition-colors">
                Ver todas <ChevronRight size={16} />
              </Link>
            </div>

            <div className="space-y-6">
              {news.length > 0 ? news.map((article) => (
                <Link key={article.id} to={`/news/${article.slug}`} className="group flex flex-col sm:flex-row gap-6 bg-[#141414] rounded-xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all p-4">
                  <div className="w-full sm:w-48 h-32 flex-shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={article.image_url || `https://picsum.photos/seed/${article.slug}/400/300`}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2 text-xs text-gray-400">
                      <span className="text-[#ff1e1e] font-bold uppercase tracking-wider">Noticia</span>
                      <span>•</span>
                      <span>{new Date(article.created_at).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#ff1e1e] transition-colors line-clamp-2">{article.title}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2">{article.content.substring(0, 150)}...</p>
                  </div>
                </Link>
              )) : (
                <div className="text-gray-500 text-center py-12 bg-[#141414] rounded-xl border border-gray-800">
                  No hay noticias disponibles por el momento.
                </div>
              )}
            </div>
          </section>

          {/* Trending Sidebar */}
          <section>
            <div className="mb-8 border-b border-gray-800 pb-4">
              <h2 className="text-2xl font-orbitron font-bold text-white flex items-center gap-3">
                <TrendingUp className="text-[#ff1e1e]" size={28} />
                Trending
              </h2>
            </div>

            <div className="bg-[#141414] rounded-xl border border-gray-800 p-6">
              <div className="space-y-6">
                {latestGames.slice(0, 5).map((game, index) => (
                  <Link key={game.id} to={`/games/${game.slug}`} className="flex items-center gap-4 group">
                    <div className="w-8 text-2xl font-orbitron font-bold text-gray-700 group-hover:text-[#ff1e1e] transition-colors">
                      0{index + 1}
                    </div>
                    <div className="w-16 h-20 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={game.cover_url || game.banner_url || `https://picsum.photos/seed/${game.slug}/100/150`}
                        alt={game.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-200 group-hover:text-white transition-colors line-clamp-1">{game.title}</h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span>{game.category_name}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Star size={10} className="text-[#ff1e1e]" /> {game.avg_rating ? Number(game.avg_rating).toFixed(1) : '-'}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Newsletter Promo */}
            <div className="mt-8 bg-gradient-to-br from-[#1a0505] to-[#0f0f0f] rounded-xl border border-[#ff1e1e]/30 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff1e1e]/10 rounded-full blur-3xl"></div>
              <h3 className="text-xl font-orbitron font-bold text-white mb-2 relative z-10">Únete a Nexo Games</h3>
              <p className="text-gray-400 text-sm mb-6 relative z-10">Recibe las últimas noticias y ofertas exclusivas directamente en tu correo.</p>
              <form className="relative z-10" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Tu email..." 
                  className="w-full bg-black/50 border border-gray-700 rounded px-4 py-3 text-sm text-white mb-3 focus:outline-none focus:border-[#ff1e1e]"
                />
                <button className="w-full bg-[#ff1e1e] hover:bg-red-700 text-white font-bold py-3 rounded transition-colors uppercase tracking-wider text-sm">
                  Suscribirse
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
