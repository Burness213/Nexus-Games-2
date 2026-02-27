import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Users, Gamepad2, MessageSquare, Eye, Plus, Trash2, Edit, Award, Tag, Newspaper, ArrowLeft, Settings, Search } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export default function AdminDashboard() {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [games, setGames] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [showGameForm, setShowGameForm] = useState(false);
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [editingGame, setEditingGame] = useState<any>(null);
  const [editingNews, setEditingNews] = useState<any>(null);

  // Search states
  const [gameSearch, setGameSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [newsSearch, setNewsSearch] = useState('');
  const [commentSearch, setCommentSearch] = useState('');

  // Rich Text states
  const [gameDescription, setGameDescription] = useState('');
  const [gameInstructions, setGameInstructions] = useState('');
  const [newsContent, setNewsContent] = useState('');

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
      navigate('/');
      return;
    }

    fetch('/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => setStats(null));

    fetch('/api/games')
      .then(res => res.json())
      .then(data => setGames(Array.isArray(data) ? data : []))
      .catch(() => setGames([]));

    fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setUsersList(Array.isArray(data) ? data : []))
      .catch(() => setUsersList([]));

    fetch('/api/admin/categories', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));

    fetch('/api/admin/badges', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setBadges(Array.isArray(data) ? data : []))
      .catch(() => setBadges([]));

    fetch('/api/news')
      .then(res => res.json())
      .then(data => setNews(Array.isArray(data) ? data : []))
      .catch(() => setNews([]));

    fetch('/api/admin/settings', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setSiteSettings(data))
      .catch(() => setSiteSettings(null));

    fetch('/api/admin/comments', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setComments(Array.isArray(data) ? data : []))
      .catch(() => setComments([]));
  }, [user, navigate, token]);

  const handleDeleteGame = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este juego?')) return;
    
    try {
      await fetch(`/api/admin/games/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setGames(games.filter(g => g.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteNews = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta noticia?')) return;
    try {
      await fetch(`/api/admin/news/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setNews(news.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este comentario?')) return;
    try {
      await fetch(`/api/admin/comments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments(comments.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateGame = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const gameData = Object.fromEntries(formData.entries());
    
    // Append rich text data
    gameData.description = gameDescription;
    gameData.installation_instructions = gameInstructions;
    
    try {
      if (editingGame) {
        const res = await fetch(`/api/admin/games/${editingGame.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(gameData)
        });
        if (res.ok) {
          const updatedGame = await res.json();
          setGames(games.map(g => g.id === updatedGame.id ? updatedGame : g));
          setShowGameForm(false);
          setEditingGame(null);
        } else {
          const error = await res.json();
          alert(`Error: ${error.error || 'No se pudo actualizar el juego'}`);
        }
      } else {
        const res = await fetch('/api/admin/games', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(gameData)
        });
        if (res.ok) {
          const newGame = await res.json();
          setGames([newGame, ...games]);
          setShowGameForm(false);
        } else {
          const error = await res.json();
          alert(`Error: ${error.error || 'No se pudo crear el juego'}`);
        }
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión al servidor');
    }
  };

  const handleCreateNews = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newsData = Object.fromEntries(formData.entries());
    
    // Append rich text data
    newsData.content = newsContent;
    
    try {
      if (editingNews) {
        const res = await fetch(`/api/admin/news/${editingNews.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(newsData)
        });
        if (res.ok) {
          const updatedArticle = await res.json();
          setNews(news.map(n => n.id === updatedArticle.id ? updatedArticle : n));
          setShowNewsForm(false);
          setEditingNews(null);
        } else {
          const error = await res.json();
          alert(`Error: ${error.error || 'No se pudo actualizar la noticia'}`);
        }
      } else {
        const res = await fetch('/api/admin/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(newsData)
        });
        if (res.ok) {
          const newArticle = await res.json();
          setNews([newArticle, ...news]);
          setShowNewsForm(false);
        } else {
          const error = await res.json();
          alert(`Error: ${error.error || 'No se pudo crear la noticia'}`);
        }
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión al servidor');
    }
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        setUsersList(usersList.map(u => u.id === userId ? { ...u, role: newRole } : u));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setUsersList(usersList.filter(u => u.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, slug })
      });
      if (res.ok) {
        const newCat = await res.json();
        setCategories([...categories, newCat]);
        (e.target as HTMLFormElement).reset();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateBadge = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const badge = {
      name: formData.get('name'),
      icon: formData.get('icon'),
      description: formData.get('description')
    };
    
    try {
      const res = await fetch('/api/admin/badges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(badge)
      });
      if (res.ok) {
        const newBadge = await res.json();
        setBadges([...badges, newBadge]);
        (e.target as HTMLFormElement).reset();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignBadge = async (userId: number, badgeId: number) => {
    if (!badgeId) return;
    try {
      await fetch(`/api/admin/users/${userId}/badges`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ badge_id: badgeId })
      });
      alert('Insignia asignada correctamente');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const settings = Object.fromEntries(formData.entries());
    
    // Parse nav_links back to JSON
    try {
      ['nav_links', 'footer_explore', 'footer_community', 'footer_legal'].forEach(field => {
        if (settings[field]) {
          settings[field] = JSON.parse(settings[field] as string);
        }
      });
    } catch (err) {
      alert('Error: Los enlaces deben ser un JSON válido.');
      return;
    }

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        alert('Configuración guardada correctamente.');
        setSiteSettings(settings);
      }
    } catch (err) {
      console.error(err);
      alert('Error al guardar la configuración.');
    }
  };

  if (!stats) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
      <div className="w-16 h-16 border-4 border-[#ff1e1e] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="bg-[#0f0f0f] min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-[#141414] border-r border-gray-800 flex-shrink-0">
        <div className="p-6">
          <h2 className="text-xl font-orbitron font-bold text-white mb-6">Panel Admin</h2>
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${activeTab === 'dashboard' ? 'bg-[#ff1e1e] text-white font-bold' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            >
              <Eye size={20} /> Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('games')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${activeTab === 'games' ? 'bg-[#ff1e1e] text-white font-bold' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            >
              <Gamepad2 size={20} /> Juegos
            </button>
            <button 
              onClick={() => setActiveTab('news')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${activeTab === 'news' ? 'bg-[#ff1e1e] text-white font-bold' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            >
              <Newspaper size={20} /> Noticias
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${activeTab === 'users' ? 'bg-[#ff1e1e] text-white font-bold' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            >
              <Users size={20} /> Usuarios
            </button>
            <button 
              onClick={() => setActiveTab('comments')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${activeTab === 'comments' ? 'bg-[#ff1e1e] text-white font-bold' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            >
              <MessageSquare size={20} /> Comentarios
            </button>
            <button 
              onClick={() => setActiveTab('categories')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${activeTab === 'categories' ? 'bg-[#ff1e1e] text-white font-bold' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            >
              <Tag size={20} /> Categorías
            </button>
            <button 
              onClick={() => setActiveTab('badges')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${activeTab === 'badges' ? 'bg-[#ff1e1e] text-white font-bold' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            >
              <Award size={20} /> Insignias
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${activeTab === 'settings' ? 'bg-[#ff1e1e] text-white font-bold' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            >
              <Settings size={20} /> Configuración
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6 md:p-10 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <div>
            <h1 className="text-3xl font-orbitron font-bold text-white mb-8">Resumen General</h1>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-[#141414] p-6 rounded-xl border border-gray-800 flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-900/30 rounded-full flex items-center justify-center text-blue-500">
                  <Users size={32} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Usuarios</p>
                  <p className="text-3xl font-bold text-white">{stats.users}</p>
                </div>
              </div>
              
              <div className="bg-[#141414] p-6 rounded-xl border border-gray-800 flex items-center gap-4">
                <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center text-green-500">
                  <Gamepad2 size={32} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Juegos</p>
                  <p className="text-3xl font-bold text-white">{stats.games}</p>
                </div>
              </div>
              
              <div className="bg-[#141414] p-6 rounded-xl border border-gray-800 flex items-center gap-4">
                <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center text-purple-500">
                  <MessageSquare size={32} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Comentarios</p>
                  <p className="text-3xl font-bold text-white">{stats.comments}</p>
                </div>
              </div>
            </div>

            {/* Top Games */}
            <div className="bg-[#141414] rounded-xl border border-gray-800 p-6">
              <h3 className="text-xl font-orbitron font-bold text-white mb-6 border-b border-gray-800 pb-4">Juegos Más Visitados</h3>
              <div className="space-y-4">
                {stats.topGames.map((game: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-[#0f0f0f] rounded-lg border border-gray-800">
                    <span className="font-bold text-white">{game.title}</span>
                    <span className="flex items-center gap-2 text-gray-400">
                      <Eye size={16} /> {game.views} vistas
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'games' && (
          <div>
            {!showGameForm ? (
              <>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                  <h1 className="text-3xl font-orbitron font-bold text-white">Gestión de Juegos</h1>
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-grow md:flex-grow-0">
                      <input 
                        type="text" 
                        placeholder="Buscar juego..." 
                        value={gameSearch}
                        onChange={(e) => setGameSearch(e.target.value)}
                        className="w-full md:w-64 bg-[#141414] border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-white focus:border-[#ff1e1e] focus:outline-none"
                      />
                      <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
                    </div>
                    <button onClick={() => { 
                      setEditingGame(null); 
                      setGameDescription('');
                      setGameInstructions('');
                      setShowGameForm(true); 
                    }} className="bg-[#ff1e1e] hover:bg-red-700 text-white px-4 py-2 rounded font-bold transition-colors flex items-center gap-2 whitespace-nowrap">
                      <Plus size={20} /> Nuevo Juego
                    </button>
                  </div>
                </div>

                <div className="bg-[#141414] rounded-xl border border-gray-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#0f0f0f] border-b border-gray-800">
                          <th className="p-4 text-gray-400 font-medium text-sm uppercase tracking-wider">ID</th>
                          <th className="p-4 text-gray-400 font-medium text-sm uppercase tracking-wider">Título</th>
                          <th className="p-4 text-gray-400 font-medium text-sm uppercase tracking-wider">Categoría</th>
                          <th className="p-4 text-gray-400 font-medium text-sm uppercase tracking-wider">Vistas</th>
                          <th className="p-4 text-gray-400 font-medium text-sm uppercase tracking-wider text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {games.filter(g => g.title.toLowerCase().includes(gameSearch.toLowerCase())).map(game => (
                          <tr key={game.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                            <td className="p-4 text-gray-500">{game.id}</td>
                            <td className="p-4 font-bold text-white">{game.title}</td>
                            <td className="p-4 text-gray-400">{game.category_name}</td>
                            <td className="p-4 text-gray-400">{game.views}</td>
                            <td className="p-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => { 
                                    setEditingGame(game); 
                                    setGameDescription(game.description || '');
                                    setGameInstructions(game.installation_instructions || '');
                                    setShowGameForm(true); 
                                  }}
                                  className="p-2 text-blue-500 hover:bg-blue-500/10 rounded transition-colors"
                                >
                                  <Edit size={18} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteGame(game.id)}
                                  className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <button onClick={() => { setShowGameForm(false); setEditingGame(null); }} className="p-2 bg-[#141414] border border-gray-800 rounded hover:bg-gray-800 text-white transition-colors">
                    <ArrowLeft size={20} />
                  </button>
                  <h1 className="text-3xl font-orbitron font-bold text-white">{editingGame ? 'Editar Juego' : 'Añadir Nuevo Juego'}</h1>
                </div>
                
                <div className="bg-[#141414] rounded-xl border border-gray-800 p-6">
                  <form onSubmit={handleCreateGame} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Título del Juego</label>
                        <input name="title" defaultValue={editingGame?.title} required type="text" className="w-full bg-[#0f0f0f] border border-gray-700 rounded px-3 py-2 text-white focus:border-[#ff1e1e] focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Categoría</label>
                        <select name="category_id" defaultValue={editingGame?.category_id} required className="w-full bg-[#0f0f0f] border border-gray-700 rounded px-3 py-2 text-white focus:border-[#ff1e1e] focus:outline-none">
                          <option value="">Seleccionar...</option>
                          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Desarrollador</label>
                        <input name="developer" defaultValue={editingGame?.developer} type="text" className="w-full bg-[#0f0f0f] border border-gray-700 rounded px-3 py-2 text-white focus:border-[#ff1e1e] focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Plataformas</label>
                        <input name="platform" defaultValue={editingGame?.platform} type="text" placeholder="PC, PS5, Xbox..." className="w-full bg-[#0f0f0f] border border-gray-700 rounded px-3 py-2 text-white focus:border-[#ff1e1e] focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Fecha de Lanzamiento</label>
                        <input name="release_date" defaultValue={editingGame?.release_date} type="date" className="w-full bg-[#0f0f0f] border border-gray-700 rounded px-3 py-2 text-white focus:border-[#ff1e1e] focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">URL del Banner (Fondo Horizontal)</label>
                        <input name="banner_url" defaultValue={editingGame?.banner_url} type="url" className="w-full bg-[#0f0f0f] border border-gray-700 rounded px-3 py-2 text-white focus:border-[#ff1e1e] focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">URL de la Portada (Vertical)</label>
                        <input name="cover_url" defaultValue={editingGame?.cover_url} type="url" className="w-full bg-[#0f0f0f] border border-gray-700 rounded px-3 py-2 text-white focus:border-[#ff1e1e] focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">URL del Trailer (YouTube Embed)</label>
                        <input name="trailer_url" defaultValue={editingGame?.trailer_url} type="url" placeholder="Ej: https://www.youtube.com/embed/..." className="w-full bg-[#0f0f0f] border border-gray-700 rounded px-3 py-2 text-white focus:border-[#ff1e1e] focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">URL de Descarga (Mega)</label>
                        <input name="link_mega" defaultValue={editingGame?.link_mega} type="url" placeholder="https://mega.nz/..." className="w-full bg-[#0f0f0f] border border-gray-700 rounded px-3 py-2 text-white focus:border-[#ff1e1e] focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">URL de Descarga (Mediafire)</label>
                        <input name="link_mediafire" defaultValue={editingGame?.link_mediafire} type="url" placeholder="https://mediafire.com/..." className="w-full bg-[#0f0f0f] border border-gray-700 rounded px-3 py-2 text-white focus:border-[#ff1e1e] focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">URL de Descarga (Google Drive)</label>
                        <input name="link_drive" defaultValue={editingGame?.link_drive} type="url" placeholder="https://drive.google.com/..." className="w-full bg-[#0f0f0f] border border-gray-700 rounded px-3 py-2 text-white focus:border-[#ff1e1e] focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Tamaño del Archivo</label>
                        <input name="file_size" defaultValue={editingGame?.file_size} type="text" placeholder="Ej: 45 GB" className="w-full bg-[#0f0f0f] border border-gray-700 rounded px-3 py-2 text-white focus:border-[#ff1e1e] focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Versión</label>
                        <input name="version" defaultValue={editingGame?.version} type="text" placeholder="Ej: v1.0.4" className="w-full bg-[#0f0f0f] border border-gray-700 rounded px-3 py-2 text-white focus:border-[#ff1e1e] focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Idioma</label>
                        <input name="language" defaultValue={editingGame?.language} type="text" placeholder="Ej: Español, Inglés" className="w-full bg-[#0f0f0f] border border-gray-700 rounded px-3 py-2 text-white focus:border-[#ff1e1e] focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Formato</label>
                        <input name="format" defaultValue={editingGame?.format} type="text" placeholder="Ej: ISO, Portable, Setup" className="w-full bg-[#0f0f0f] border border-gray-700 rounded px-3 py-2 text-white focus:border-[#ff1e1e] focus:outline-none" />
                      </div>
                      <div className="flex items-center mt-6">
                        <input type="checkbox" name="is_featured" id="is_featured" defaultChecked={editingGame?.is_featured === 1} className="w-4 h-4 text-[#ff1e1e] bg-[#0f0f0f] border-gray-700 rounded focus:ring-[#ff1e1e]" />
                        <label htmlFor="is_featured" className="ml-2 text-sm text-gray-400">Juego Destacado</label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Descripción / Sinopsis</label>
                      <div className="bg-white text-black rounded">
                        <ReactQuill theme="snow" value={gameDescription} onChange={setGameDescription} className="h-48 mb-12" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Instrucciones de Instalación</label>
                      <div className="bg-white text-black rounded">
                        <ReactQuill theme="snow" value={gameInstructions} onChange={setGameInstructions} className="h-48 mb-12" />
                      </div>
                    </div>
                    
                    <button type="submit" className="bg-[#ff1e1e] hover:bg-red-700 text-white px-6 py-3 rounded font-bold transition-colors w-full md:w-auto">
                      {editingGame ? 'Actualizar Juego' : 'Guardar Juego'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'news' && (
          <div>
            {!showNewsForm ? (
              <>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                  <h1 className="text-3xl font-orbitron font-bold text-white">Gestión de Noticias</h1>
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-grow md:flex-grow-0">
                      <input 
                        type="text" 
                        placeholder="Buscar noticia..." 
                        value={newsSearch}
                        onChange={(e) => setNewsSearch(e.target.value)}
                        className="w-full md:w-64 bg-[#141414] border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-white focus:border-[#ff1e1e] focus:outline-none"
                      />
                      <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
                    </div>
                    <button onClick={() => { 
                      setEditingNews(null); 
                      setNewsContent('');
                      setShowNewsForm(true); 
                    }} className="bg-[#ff1e1e] hover:bg-red-700 text-white px-4 py-2 rounded font-bold transition-colors flex items-center gap-2 whitespace-nowrap">
                      <Plus size={20} /> Nueva Noticia
                    </button>
                  </div>
                </div>

                <div className="bg-[#141414] rounded-xl border border-gray-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#0f0f0f] border-b border-gray-800">
                          <th className="p-4 text-gray-400 font-medium text-sm uppercase tracking-wider">ID</th>
                          <th className="p-4 text-gray-400 font-medium text-sm uppercase tracking-wider">Título</th>
                          <th className="p-4 text-gray-400 font-medium text-sm uppercase tracking-wider">Fecha</th>
                          <th className="p-4 text-gray-400 font-medium text-sm uppercase tracking-wider text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {news.filter(n => n.title.toLowerCase().includes(newsSearch.toLowerCase())).map(n => (
                          <tr key={n.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                            <td className="p-4 text-gray-500">{n.id}</td>
                            <td className="p-4 font-bold text-white">{n.title}</td>
                            <td className="p-4 text-gray-400">{new Date(n.created_at).toLocaleDateString()}</td>
                            <td className="p-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => { 
                                    setEditingNews(n); 
                                    setNewsContent(n.content || '');
                                    setShowNewsForm(true); 
                                  }}
                                  className="p-2 text-blue-500 hover:bg-blue-500/10 rounded transition-colors"
                                >
                                  <Edit size={18} />
                                </button>
                                <button onClick={() => handleDeleteNews(n.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors">
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <button onClick={() => { setShowNewsForm(false); setEditingNews(null); }} className="p-2 bg-[#141414] border border-gray-800 rounded hover:bg-gray-800 text-white transition-colors">
                    <ArrowLeft size={20} />
                  </button>
                  <h1 className="text-3xl font-orbitron font-bold text-white">{editingNews ? 'Editar Noticia' : 'Redactar Noticia'}</h1>
                </div>
                
                <div className="bg-[#141414] rounded-xl border border-gray-800 p-6">
                  <form onSubmit={handleCreateNews} className="space-y-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Título</label>
                      <input name="title" defaultValue={editingNews?.title} required type="text" className="w-full bg-[#0f0f0f] border border-gray-700 rounded px-3 py-2 text-white focus:border-[#ff1e1e] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">URL de la Imagen</label>
                      <input name="image_url" defaultValue={editingNews?.image_url} type="url" className="w-full bg-[#0f0f0f] border border-gray-700 rounded px-3 py-2 text-white focus:border-[#ff1e1e] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Contenido</label>
                      <div className="bg-white text-black rounded">
                        <ReactQuill theme="snow" value={newsContent} onChange={setNewsContent} className="h-64 mb-12" />
                      </div>
                    </div>
                    
                    <button type="submit" className="bg-[#ff1e1e] hover:bg-red-700 text-white px-6 py-3 rounded font-bold transition-colors w-full md:w-auto">
                      {editingNews ? 'Actualizar Noticia' : 'Publicar Noticia'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <h1 className="text-3xl font-orbitron font-bold text-white">Gestión de Usuarios</h1>
              <div className="relative w-full md:w-64">
                <input 
                  type="text" 
                  placeholder="Buscar usuario..." 
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full bg-[#141414] border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-white focus:border-[#ff1e1e] focus:outline-none"
                />
                <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
              </div>
            </div>
            <div className="bg-[#141414] rounded-xl border border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#0f0f0f] border-b border-gray-800">
                      <th className="p-4 text-gray-400 font-medium text-sm uppercase tracking-wider">ID</th>
                      <th className="p-4 text-gray-400 font-medium text-sm uppercase tracking-wider">Usuario</th>
                      <th className="p-4 text-gray-400 font-medium text-sm uppercase tracking-wider">Email</th>
                      <th className="p-4 text-gray-400 font-medium text-sm uppercase tracking-wider">Rol</th>
                      <th className="p-4 text-gray-400 font-medium text-sm uppercase tracking-wider">Registro</th>
                      <th className="p-4 text-gray-400 font-medium text-sm uppercase tracking-wider text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.filter(u => u.username.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase())).map(u => (
                      <tr key={u.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                        <td className="p-4 text-gray-500">#{u.id}</td>
                        <td className="p-4 font-bold text-white">{u.username}</td>
                        <td className="p-4 text-gray-400">{u.email}</td>
                        <td className="p-4">
                          <select 
                            value={u.role} 
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            className="bg-[#0f0f0f] border border-gray-700 rounded px-2 py-1 text-white text-xs"
                          >
                            <option value="user">User</option>
                            <option value="moderator">Moderator</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="p-4 text-gray-400">{new Date(u.created_at).toLocaleDateString()}</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2 items-center">
                            <select 
                              onChange={(e) => handleAssignBadge(u.id, parseInt(e.target.value))}
                              className="bg-[#0f0f0f] border border-gray-700 rounded px-2 py-1 text-white text-xs"
                              defaultValue=""
                            >
                              <option value="" disabled>Dar Insignia</option>
                              {badges.map(b => (
                                <option key={b.id} value={b.id}>{b.icon} {b.name}</option>
                              ))}
                            </select>
                            <button onClick={() => handleDeleteUser(u.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'comments' && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <h1 className="text-3xl font-orbitron font-bold text-white">Moderación de Comentarios</h1>
              <div className="relative w-full md:w-64">
                <input 
                  type="text" 
                  placeholder="Buscar comentario..." 
                  value={commentSearch}
                  onChange={(e) => setCommentSearch(e.target.value)}
                  className="w-full bg-[#141414] border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-white focus:border-[#ff1e1e] focus:outline-none"
                />
                <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
              </div>
            </div>
            <div className="bg-[#141414] rounded-xl border border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#0f0f0f] border-b border-gray-800">
                      <th className="p-4 text-gray-400 font-medium text-sm uppercase tracking-wider">ID</th>
                      <th className="p-4 text-gray-400 font-medium text-sm uppercase tracking-wider">Usuario</th>
                      <th className="p-4 text-gray-400 font-medium text-sm uppercase tracking-wider">Juego</th>
                      <th className="p-4 text-gray-400 font-medium text-sm uppercase tracking-wider">Comentario</th>
                      <th className="p-4 text-gray-400 font-medium text-sm uppercase tracking-wider">Fecha</th>
                      <th className="p-4 text-gray-400 font-medium text-sm uppercase tracking-wider text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comments.filter(c => 
                      c.content.toLowerCase().includes(commentSearch.toLowerCase()) || 
                      c.author_name.toLowerCase().includes(commentSearch.toLowerCase()) ||
                      c.game_title.toLowerCase().includes(commentSearch.toLowerCase())
                    ).map(c => (
                      <tr key={c.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                        <td className="p-4 text-gray-500">#{c.id}</td>
                        <td className="p-4 font-bold text-white">{c.author_name}</td>
                        <td className="p-4 text-gray-400">{c.game_title}</td>
                        <td className="p-4 text-gray-300 max-w-xs truncate">{c.content}</td>
                        <td className="p-4 text-gray-400">{new Date(c.created_at).toLocaleDateString()}</td>
                        <td className="p-4 text-right">
                          <button onClick={() => handleDeleteComment(c.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div>
            <h1 className="text-3xl font-orbitron font-bold text-white mb-8">Gestión de Categorías</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-[#141414] rounded-xl border border-gray-800 p-6">
                <h2 className="text-xl font-orbitron font-bold text-white mb-6">Categorías Existentes</h2>
                <ul className="space-y-2">
                  {categories.map(cat => (
                    <li key={cat.id} className="flex justify-between items-center bg-[#0f0f0f] p-3 rounded border border-gray-800">
                      <span className="text-white font-bold">{cat.name}</span>
                      <span className="text-gray-500 text-sm">/{cat.slug}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-[#141414] rounded-xl border border-gray-800 p-6">
                <h2 className="text-xl font-orbitron font-bold text-white mb-6">Nueva Categoría</h2>
                <form onSubmit={handleCreateCategory} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Nombre</label>
                    <input name="name" required type="text" className="w-full bg-[#0f0f0f] border border-gray-700 rounded px-3 py-2 text-white focus:border-[#ff1e1e] focus:outline-none" placeholder="Ej: Programas" />
                  </div>
                  <button type="submit" className="w-full bg-[#ff1e1e] hover:bg-red-700 text-white font-bold py-2 rounded transition-colors">
                    Crear Categoría
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'badges' && (
          <div>
            <h1 className="text-3xl font-orbitron font-bold text-white mb-8">Gestión de Insignias</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-[#141414] rounded-xl border border-gray-800 p-6">
                <h2 className="text-xl font-orbitron font-bold text-white mb-6">Insignias Existentes</h2>
                <div className="grid grid-cols-2 gap-4">
                  {badges.map(badge => (
                    <div key={badge.id} className="bg-[#0f0f0f] p-4 rounded border border-gray-800 flex items-center gap-3">
                      <div className="text-3xl">{badge.icon}</div>
                      <div>
                        <h4 className="text-white font-bold text-sm">{badge.name}</h4>
                        <p className="text-gray-500 text-xs">{badge.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#141414] rounded-xl border border-gray-800 p-6">
                <h2 className="text-xl font-orbitron font-bold text-white mb-6">Nueva Insignia</h2>
                <form onSubmit={handleCreateBadge} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Nombre</label>
                    <input name="name" required type="text" className="w-full bg-[#0f0f0f] border border-gray-700 rounded px-3 py-2 text-white focus:border-[#ff1e1e] focus:outline-none" placeholder="Ej: Veterano" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Icono (Emoji o URL)</label>
                    <input name="icon" required type="text" className="w-full bg-[#0f0f0f] border border-gray-700 rounded px-3 py-2 text-white focus:border-[#ff1e1e] focus:outline-none" placeholder="Ej: 🛡️" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Descripción</label>
                    <input name="description" required type="text" className="w-full bg-[#0f0f0f] border border-gray-700 rounded px-3 py-2 text-white focus:border-[#ff1e1e] focus:outline-none" placeholder="Otorgada por..." />
                  </div>
                  <button type="submit" className="w-full bg-[#ff1e1e] hover:bg-red-700 text-white font-bold py-2 rounded transition-colors">
                    Crear Insignia
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'settings' && siteSettings && (
          <div>
            <h1 className="text-3xl font-orbitron font-bold text-white mb-8">Configuración del Sitio</h1>
            <div className="bg-[#141414] rounded-xl border border-gray-800 p-6">
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Nombre del Sitio</label>
                    <input name="site_name" defaultValue={siteSettings.site_name} required type="text" className="w-full bg-[#0f0f0f] border border-gray-700 rounded px-3 py-2 text-white focus:border-[#ff1e1e] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Descripción del Sitio</label>
                    <input name="site_description" defaultValue={siteSettings.site_description} required type="text" className="w-full bg-[#0f0f0f] border border-gray-700 rounded px-3 py-2 text-white focus:border-[#ff1e1e] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Enlace de Discord</label>
                    <input name="discord_link" defaultValue={siteSettings.discord_link} type="url" className="w-full bg-[#0f0f0f] border border-gray-700 rounded px-3 py-2 text-white focus:border-[#ff1e1e] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Enlace de Twitter</label>
                    <input name="twitter_link" defaultValue={siteSettings.twitter_link} type="url" className="w-full bg-[#0f0f0f] border border-gray-700 rounded px-3 py-2 text-white focus:border-[#ff1e1e] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Enlace de YouTube</label>
                    <input name="youtube_link" defaultValue={siteSettings.youtube_link} type="url" className="w-full bg-[#0f0f0f] border border-gray-700 rounded px-3 py-2 text-white focus:border-[#ff1e1e] focus:outline-none" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Enlaces de Navegación (Formato JSON)</label>
                  <textarea 
                    name="nav_links" 
                    defaultValue={JSON.stringify(siteSettings.nav_links, null, 2)} 
                    rows={6} 
                    className="w-full bg-[#0f0f0f] border border-gray-700 rounded px-3 py-2 text-white focus:border-[#ff1e1e] focus:outline-none font-mono text-sm"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Enlaces Footer: Explorar (Formato JSON)</label>
                  <textarea 
                    name="footer_explore" 
                    defaultValue={JSON.stringify(siteSettings.footer_explore || [], null, 2)} 
                    rows={6} 
                    className="w-full bg-[#0f0f0f] border border-gray-700 rounded px-3 py-2 text-white focus:border-[#ff1e1e] focus:outline-none font-mono text-sm"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Enlaces Footer: Comunidad (Formato JSON)</label>
                  <textarea 
                    name="footer_community" 
                    defaultValue={JSON.stringify(siteSettings.footer_community || [], null, 2)} 
                    rows={6} 
                    className="w-full bg-[#0f0f0f] border border-gray-700 rounded px-3 py-2 text-white focus:border-[#ff1e1e] focus:outline-none font-mono text-sm"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Enlaces Footer: Legal (Formato JSON)</label>
                  <textarea 
                    name="footer_legal" 
                    defaultValue={JSON.stringify(siteSettings.footer_legal || [], null, 2)} 
                    rows={6} 
                    className="w-full bg-[#0f0f0f] border border-gray-700 rounded px-3 py-2 text-white focus:border-[#ff1e1e] focus:outline-none font-mono text-sm"
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-2">Ejemplo: <code className="bg-gray-800 px-1 rounded">[{"{"}"title": "Inicio", "url": "/"{"}"}]</code></p>
                </div>
                
                <button type="submit" className="bg-[#ff1e1e] hover:bg-red-700 text-white px-6 py-3 rounded font-bold transition-colors w-full md:w-auto">
                  Guardar Configuración
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
