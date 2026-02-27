import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, Star, Clock } from 'lucide-react';

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'recent';

  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    let url = `/api/games?`;
    if (query) url += `search=${encodeURIComponent(query)}&`;
    if (category) url += `category=${encodeURIComponent(category)}&`;
    if (sort) url += `sort=${encodeURIComponent(sort)}&`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setGames(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setGames([]);
        setLoading(false);
      });
  }, [query, category, sort]);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="bg-[#0f0f0f] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className="w-full md:w-64 flex-shrink-0 space-y-6">
            <div className="bg-[#141414] rounded-xl border border-gray-800 p-6">
              <h3 className="text-xl font-orbitron font-bold text-white mb-6 flex items-center gap-2 border-b border-gray-800 pb-4">
                <Filter className="text-[#ff1e1e]" size={20} /> Filtros
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">Categoría</label>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleFilterChange('category', '')}
                      className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${!category ? 'bg-[#ff1e1e]/10 text-[#ff1e1e] font-bold' : 'text-gray-300 hover:bg-gray-800'}`}
                    >
                      Todas
                    </button>
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => handleFilterChange('category', cat.slug)}
                        className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${category === cat.slug ? 'bg-[#ff1e1e]/10 text-[#ff1e1e] font-bold' : 'text-gray-300 hover:bg-gray-800'}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">Ordenar por</label>
                  <select
                    value={sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#ff1e1e]"
                  >
                    <option value="recent">Más recientes</option>
                    <option value="popular">Más populares</option>
                    <option value="rating">Mejor valorados</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-grow">
            <div className="mb-8">
              <h1 className="text-3xl font-orbitron font-bold text-white mb-2">
                {query ? `Resultados para "${query}"` : 'Explorar Juegos'}
              </h1>
              <p className="text-gray-400">
                Se encontraron {games.length} juegos
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-[#ff1e1e] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : games.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map((game) => (
                  <Link key={game.id} to={`/games/${game.slug}`} className="group bg-[#141414] rounded-xl overflow-hidden border border-gray-800 hover:border-[#ff1e1e]/50 transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_-15px_rgba(255,30,30,0.3)] flex flex-col h-full">
                    <div className="relative aspect-[3/4] overflow-hidden flex-shrink-0">
                      <img
                        src={game.cover_url || game.banner_url || `https://picsum.photos/seed/${game.slug}/400/600`}
                        alt={game.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-[#ff1e1e] flex items-center gap-1">
                        <Star size={12} className="fill-[#ff1e1e]" />
                        {game.avg_rating ? Number(game.avg_rating).toFixed(1) : 'S/N'}
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{game.category_name || 'General'}</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12}/> {new Date(game.release_date).getFullYear()}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#ff1e1e] transition-colors line-clamp-1">{game.title}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-grow">{game.description}</p>
                      <div className="flex flex-wrap gap-2 mt-auto">
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
            ) : (
              <div className="bg-[#141414] rounded-xl border border-gray-800 p-12 text-center">
                <Search className="mx-auto text-gray-600 mb-4" size={48} />
                <h3 className="text-xl font-bold text-white mb-2">No se encontraron resultados</h3>
                <p className="text-gray-400">Intenta con otros términos de búsqueda o filtros.</p>
                <button 
                  onClick={() => setSearchParams(new URLSearchParams())}
                  className="mt-6 bg-[#ff1e1e] hover:bg-red-700 text-white px-6 py-2 rounded font-bold transition-colors"
                >
                  Limpiar Filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
