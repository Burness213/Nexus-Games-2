import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Edit, Camera, Save, X, Star, Gamepad2, Award, MessageSquare } from 'lucide-react';

export default function Profile() {
  const { username } = useParams();
  const { user, token, login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // Edit state
  const [editAvatar, setEditAvatar] = useState('');
  const [editBanner, setEditBanner] = useState('');
  const [editBio, setEditBio] = useState('');

  const isOwnProfile = user?.username === username;

  useEffect(() => {
    setLoading(true);
    fetch(`/api/users/profile/${username}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        setProfile(data);
        setEditAvatar(data.avatar || '');
        setEditBanner(data.banner || '');
        setEditBio(data.bio || '');
        setLoading(false);
      })
      .catch(() => {
        navigate('/');
      });
  }, [username, navigate]);

  const handleSave = async () => {
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ avatar: editAvatar, banner: editBanner, bio: editBio })
      });
      
      if (res.ok) {
        const updatedUser = await res.json();
        setProfile({ ...profile, ...updatedUser });
        login(token!, updatedUser); // Update context
        setIsEditing(false);
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

  const xpProgress = profile ? (profile.xp % 100) : 0;

  return (
    <div className="bg-[#0f0f0f] min-h-screen pb-20">
      {/* Banner */}
      <div className="relative h-64 md:h-80 w-full bg-[#141414] border-b border-gray-800">
        {(isEditing ? editBanner : profile.banner) ? (
          <img 
            src={isEditing ? editBanner : profile.banner} 
            alt="Profile Banner" 
            className="w-full h-full object-cover opacity-60"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-gray-900 to-[#141414]"></div>
        )}
        
        {isEditing && (
          <div className="absolute top-4 right-4 z-20 bg-black/80 p-3 rounded-lg border border-gray-700 w-full max-w-sm">
            <label className="block text-xs text-gray-400 mb-1">URL del Banner</label>
            <input 
              type="text" 
              value={editBanner}
              onChange={(e) => setEditBanner(e.target.value)}
              className="w-full bg-[#0f0f0f] border border-gray-700 rounded px-2 py-1 text-sm text-white focus:border-[#ff1e1e] focus:outline-none"
              placeholder="https://ejemplo.com/banner.jpg"
            />
          </div>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Profile Info Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-16 md:-mt-24 mb-12 relative z-10">
          <div className="relative group">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-[#141414] border-4 border-[#0f0f0f] overflow-hidden shadow-2xl">
              {(isEditing ? editAvatar : profile.avatar) ? (
                <img src={isEditing ? editAvatar : profile.avatar} alt={profile.username} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
                  <User size={64} />
                </div>
              )}
            </div>
            {isEditing && (
              <div className="absolute -bottom-2 -right-2 bg-[#ff1e1e] p-2 rounded-full border-4 border-[#0f0f0f] text-white">
                <Camera size={20} />
              </div>
            )}
          </div>

          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-white flex items-center gap-3">
                  {profile.username}
                  {profile.role === 'admin' && <span className="bg-red-900/50 text-[#ff1e1e] border border-[#ff1e1e] text-xs px-2 py-1 rounded uppercase tracking-wider">Admin</span>}
                  {profile.role === 'moderator' && <span className="bg-blue-900/50 text-blue-500 border border-blue-500 text-xs px-2 py-1 rounded uppercase tracking-wider">Mod</span>}
                </h1>
                <p className="text-gray-400 mt-1">Miembro desde {new Date(profile.created_at).toLocaleDateString()}</p>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <span className="block text-gray-400 text-xs font-bold uppercase tracking-wider">Nivel</span>
                  <span className="text-2xl font-orbitron font-bold text-[#ff1e1e]">{profile.level || 1}</span>
                </div>
                <div className="w-32">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">XP</span>
                    <span className="text-[#ff1e1e] font-bold">{profile.xp || 0}</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-[#ff1e1e] h-1.5 rounded-full" style={{ width: `${xpProgress}%` }}></div>
                  </div>
                </div>
              </div>

              {isOwnProfile && (
                <div>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded font-bold flex items-center gap-2 transition-colors">
                        <X size={18} /> Cancelar
                      </button>
                      <button onClick={handleSave} className="px-4 py-2 bg-[#ff1e1e] hover:bg-red-700 text-white rounded font-bold flex items-center gap-2 transition-colors">
                        <Save size={18} /> Guardar
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-[#141414] border border-gray-700 hover:bg-gray-800 text-white rounded font-bold flex items-center gap-2 transition-colors">
                      <Edit size={18} /> Editar Perfil
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="bg-[#141414] p-6 rounded-xl border border-gray-800 mb-8">
            <h3 className="text-lg font-bold text-white mb-4">Editar Información</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">URL del Avatar</label>
                <input 
                  type="text" 
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  className="w-full bg-[#0f0f0f] border border-gray-700 rounded px-3 py-2 text-white focus:border-[#ff1e1e] focus:outline-none"
                  placeholder="https://ejemplo.com/avatar.jpg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Biografía</label>
                <textarea 
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-[#0f0f0f] border border-gray-700 rounded px-3 py-2 text-white focus:border-[#ff1e1e] focus:outline-none min-h-[100px]"
                  placeholder="Cuéntanos sobre ti..."
                />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Bio & Badges */}
          <div className="space-y-8">
            <div className="bg-[#141414] p-6 rounded-xl border border-gray-800">
              <h3 className="text-xl font-orbitron font-bold text-white mb-4 border-b border-gray-800 pb-2">Sobre mí</h3>
              <p className="text-gray-300 whitespace-pre-line">
                {profile.bio || <span className="text-gray-600 italic">Este usuario aún no ha escrito una biografía.</span>}
              </p>
            </div>

            <div className="bg-[#141414] p-6 rounded-xl border border-gray-800">
              <h3 className="text-xl font-orbitron font-bold text-white mb-4 border-b border-gray-800 pb-2 flex items-center gap-2">
                <Award className="text-[#ff1e1e]" /> Insignias
              </h3>
              {profile.badges && profile.badges.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {profile.badges.map((badge: any) => (
                    <div key={badge.id} className="flex flex-col items-center text-center group relative">
                      <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-2xl mb-2 border border-gray-700 group-hover:border-[#ff1e1e] transition-colors">
                        {badge.icon}
                      </div>
                      <span className="text-xs font-bold text-gray-300">{badge.name}</span>
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 bg-black text-white text-xs p-2 rounded z-10 border border-gray-700">
                        {badge.description}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 italic">Aún no tiene insignias.</p>
              )}
            </div>
          </div>

          {/* Right Column: Favorites & Activity */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#141414] p-6 rounded-xl border border-gray-800">
              <h3 className="text-xl font-orbitron font-bold text-white mb-6 border-b border-gray-800 pb-2 flex items-center gap-2">
                <Star className="text-yellow-500" /> Juegos Favoritos
              </h3>
              
              {profile.favorites && profile.favorites.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profile.favorites.map((game: any) => (
                    <div key={game.id} onClick={() => navigate(`/games/${game.slug}`)} className="flex items-center gap-4 bg-[#0f0f0f] p-3 rounded-lg border border-gray-800 hover:border-[#ff1e1e]/50 cursor-pointer transition-colors group">
                      <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                        <img src={game.cover_url || `https://picsum.photos/seed/${game.slug}/100/100`} alt={game.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white group-hover:text-[#ff1e1e] transition-colors line-clamp-1">{game.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Gamepad2 size={48} className="mx-auto text-gray-700 mb-4" />
                  <p className="text-gray-500">No hay juegos favoritos aún.</p>
                </div>
              )}
            </div>

            {/* Recent Activity (Comments) */}
            <div className="bg-[#141414] p-6 rounded-xl border border-gray-800">
              <h3 className="text-xl font-orbitron font-bold text-white mb-6 border-b border-gray-800 pb-2 flex items-center gap-2">
                <MessageSquare className="text-[#ff1e1e]" /> Actividad Reciente
              </h3>
              {profile.recentComments && profile.recentComments.length > 0 ? (
                <div className="space-y-4">
                  {profile.recentComments.map((comment: any) => (
                    <div key={comment.id} className="bg-[#0f0f0f] p-4 rounded-lg border border-gray-800">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm text-gray-400">
                          Comentó en {comment.game_title ? (
                            <span onClick={() => navigate(`/games/${comment.game_slug}`)} className="text-[#ff1e1e] hover:underline font-bold cursor-pointer">{comment.game_title}</span>
                          ) : (
                            <span onClick={() => navigate(`/news/${comment.news_slug}`)} className="text-[#ff1e1e] hover:underline font-bold cursor-pointer">{comment.news_title}</span>
                          )}
                        </span>
                        <span className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-300 text-sm italic">"{comment.content}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic text-center py-8">No hay actividad reciente.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
