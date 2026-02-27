import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, MessageSquare } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function NewsDetail() {
  const { slug } = useParams();
  const { user, token } = useContext(AuthContext);
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetch(`/api/news/${slug}`)
      .then(res => res.json())
      .then(data => {
        setArticle(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !comment.trim()) return;

    try {
      const res = await fetch('/api/users/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ news_id: article.id, content: comment })
      });
      
      if (res.ok) {
        const newComment = await res.json();
        setArticle({ ...article, comments: [newComment, ...article.comments] });
        setComment('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
      <div className="w-16 h-16 border-4 border-[#ff1e1e] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!article) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] text-white">
      <h2 className="text-2xl font-orbitron">Noticia no encontrada</h2>
    </div>
  );

  return (
    <div className="bg-[#0f0f0f] min-h-screen pb-20">
      {/* Hero Banner */}
      <div className="relative h-[40vh] md:h-[60vh] w-full">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/60 to-transparent z-10" />
        <img 
          src={article.image_url || `https://picsum.photos/seed/${article.slug}/1920/1080`} 
          alt={article.title} 
          className="w-full h-full object-cover"
        />
        
        <div className="absolute bottom-0 left-0 w-full z-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <span className="bg-[#ff1e1e] text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider mb-4 inline-block">
              Noticia
            </span>
            <h1 className="text-3xl md:text-5xl font-orbitron font-bold text-white mb-4 leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center gap-6 text-gray-300 text-sm">
              <span className="flex items-center gap-2"><User size={16} className="text-[#ff1e1e]" /> {article.author_name}</span>
              <span className="flex items-center gap-2"><Calendar size={16} className="text-[#ff1e1e]" /> {new Date(article.created_at).toLocaleDateString()}</span>
              <span className="flex items-center gap-2"><MessageSquare size={16} className="text-[#ff1e1e]" /> {article.comments?.length || 0} Comentarios</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div 
          className="prose prose-invert prose-lg max-w-none mb-16 text-gray-300 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Comments Section */}
        <section className="border-t border-gray-800 pt-12">
          <h2 className="text-2xl font-orbitron font-bold text-white mb-8 flex items-center gap-2">
            <MessageSquare className="text-[#ff1e1e]" /> Comentarios ({article.comments?.length || 0})
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
                    placeholder="¿Qué opinas sobre esta noticia?"
                    className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg p-4 text-white focus:outline-none focus:border-[#ff1e1e] focus:ring-1 focus:ring-[#ff1e1e] min-h-[100px] resize-y"
                  ></textarea>
                  <div className="flex justify-end mt-3">
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
              <p className="text-gray-400 mb-4">Debes iniciar sesión para dejar un comentario.</p>
              <Link to="/login" className="inline-block bg-[#ff1e1e] hover:bg-red-700 text-white px-6 py-2 rounded font-bold transition-colors">
                Iniciar Sesión
              </Link>
            </div>
          )}

          <div className="space-y-6">
            {article.comments?.length > 0 ? (
              article.comments.map((c: any) => (
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
              <p className="text-gray-500 italic text-center py-8">Sé el primero en comentar.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
