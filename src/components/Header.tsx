import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { SettingsContext } from '../context/SettingsContext';
import { Search, Menu, X, User, LogOut, Settings } from 'lucide-react';

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const { settings } = useContext(SettingsContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="bg-[#141414] border-b border-[#ff1e1e]/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-[#ff1e1e] rounded flex items-center justify-center font-bold text-white font-orbitron">
                {settings?.site_name ? settings.site_name.charAt(0).toUpperCase() : 'N'}
              </div>
              <span className="font-orbitron font-bold text-xl tracking-wider text-white">
                {settings?.site_name ? (
                  <>
                    {settings.site_name.substring(0, Math.ceil(settings.site_name.length / 2))}
                    <span className="text-[#ff1e1e]">{settings.site_name.substring(Math.ceil(settings.site_name.length / 2))}</span>
                  </>
                ) : (
                  <>NEXO<span className="text-[#ff1e1e]">GAMES</span></>
                )}
              </span>
            </Link>
            <nav className="hidden md:ml-8 md:flex md:space-x-8">
              {settings?.nav_links ? (
                settings.nav_links.map((link: any, idx: number) => (
                  <Link key={idx} to={link.url} className="text-gray-300 hover:text-[#ff1e1e] px-3 py-2 text-sm font-medium transition-colors">
                    {link.title}
                  </Link>
                ))
              ) : (
                <>
                  <Link to="/" className="text-gray-300 hover:text-[#ff1e1e] px-3 py-2 text-sm font-medium transition-colors">Inicio</Link>
                  <Link to="/search" className="text-gray-300 hover:text-[#ff1e1e] px-3 py-2 text-sm font-medium transition-colors">Juegos</Link>
                  <Link to="/search?category=programas" className="text-gray-300 hover:text-[#ff1e1e] px-3 py-2 text-sm font-medium transition-colors">Programas</Link>
                  <Link to="/news" className="text-gray-300 hover:text-[#ff1e1e] px-3 py-2 text-sm font-medium transition-colors">Noticias</Link>
                </>
              )}
            </nav>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Buscar juegos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#0f0f0f] text-sm text-gray-200 rounded-full pl-4 pr-10 py-2 border border-gray-800 focus:outline-none focus:border-[#ff1e1e] focus:ring-1 focus:ring-[#ff1e1e] transition-all w-64"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-gray-400 hover:text-[#ff1e1e]">
                <Search size={16} />
              </button>
            </form>

            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-300 hover:text-white">
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-700">
                    {user.avatar ? <img src={user.avatar} alt={user.username} /> : <User size={16} />}
                  </div>
                  <span className="text-sm font-medium">{user.username}</span>
                </button>
                <div className="absolute right-0 top-full pt-2 w-48 hidden group-hover:block">
                  <div className="bg-[#1a1a1a] rounded-md shadow-lg py-1 border border-gray-800">
                    <Link to={`/profile/${user.username}`} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-[#ff1e1e] flex items-center gap-2">
                      <User size={16} /> Mi Perfil
                    </Link>
                    {(user.role === 'admin' || user.role === 'moderator') && (
                      <Link to="/admin" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-[#ff1e1e] flex items-center gap-2">
                        <Settings size={16} /> Panel Admin
                      </Link>
                    )}
                    <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-[#ff1e1e] flex items-center gap-2">
                      <LogOut size={16} /> Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-300 hover:text-white text-sm font-medium">Login</Link>
                <Link to="/register" className="bg-[#ff1e1e] hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors">Registro</Link>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-400 hover:text-white">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#141414] border-t border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <form onSubmit={handleSearch} className="mb-4 px-3">
              <input
                type="text"
                placeholder="Buscar juegos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0f0f0f] text-sm text-gray-200 rounded pl-4 pr-10 py-2 border border-gray-800 focus:outline-none focus:border-[#ff1e1e]"
              />
            </form>
            {settings?.nav_links ? (
              settings.nav_links.map((link: any, idx: number) => (
                <Link key={idx} to={link.url} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800">
                  {link.title}
                </Link>
              ))
            ) : (
              <>
                <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800">Inicio</Link>
                <Link to="/search" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800">Juegos</Link>
                <Link to="/search?category=programas" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800">Programas</Link>
                <Link to="/news" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800">Noticias</Link>
              </>
            )}
            
            {user ? (
              <>
                <Link to={`/profile/${user.username}`} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800">Mi Perfil</Link>
                {(user.role === 'admin' || user.role === 'moderator') && (
                  <Link to="/admin" className="block px-3 py-2 rounded-md text-base font-medium text-[#ff1e1e] hover:bg-gray-800">Panel Admin</Link>
                )}
                <button onClick={logout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800">Cerrar Sesión</button>
              </>
            ) : (
              <div className="mt-4 flex flex-col gap-2 px-3">
                <Link to="/login" className="block text-center text-gray-300 hover:text-white py-2 border border-gray-700 rounded">Login</Link>
                <Link to="/register" className="block text-center bg-[#ff1e1e] text-white py-2 rounded">Registro</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
