import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ChevronRight } from 'lucide-react';

export default function NewsList() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        setNews(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#0f0f0f] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 border-b border-gray-800 pb-6">
          <h1 className="text-4xl font-orbitron font-bold text-white flex items-center gap-3">
            <span className="w-10 h-10 bg-[#ff1e1e] rounded flex items-center justify-center">
              <span className="text-white text-2xl">📰</span>
            </span>
            Noticias Gamer
          </h1>
          <p className="text-gray-400 mt-4 text-lg">Mantente al día con las últimas novedades del mundo de los videojuegos.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-[#ff1e1e] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((article) => (
              <Link key={article.id} to={`/news/${article.slug}`} className="group bg-[#141414] rounded-xl overflow-hidden border border-gray-800 hover:border-[#ff1e1e]/50 transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_-15px_rgba(255,30,30,0.3)] flex flex-col h-full">
                <div className="relative aspect-video overflow-hidden flex-shrink-0">
                  <img
                    src={article.image_url || `https://picsum.photos/seed/${article.slug}/600/400`}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3 bg-[#ff1e1e] text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
                    Noticia
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 mb-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Calendar size={14} className="text-[#ff1e1e]" /> {new Date(article.created_at).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><User size={14} className="text-[#ff1e1e]" /> {article.author_name}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#ff1e1e] transition-colors line-clamp-2">{article.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-grow">{article.content}</p>
                  <div className="mt-auto flex items-center text-[#ff1e1e] font-bold text-sm uppercase tracking-wider group-hover:translate-x-2 transition-transform">
                    Leer más <ChevronRight size={16} className="ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-[#141414] rounded-xl border border-gray-800 p-12 text-center">
            <h3 className="text-xl font-bold text-white mb-2">No hay noticias disponibles</h3>
            <p className="text-gray-400">Vuelve más tarde para enterarte de las últimas novedades.</p>
          </div>
        )}
      </div>
    </div>
  );
}
