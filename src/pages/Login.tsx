import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, Gamepad2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        login(data.token, data.user);
        navigate('/');
      } else {
        setError(data.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#ff1e1e]/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#ff1e1e]/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-md w-full space-y-8 bg-[#141414] p-10 rounded-2xl border border-gray-800 shadow-2xl relative z-10">
        <div>
          <div className="mx-auto flex justify-center items-center gap-2 mb-6">
            <Gamepad2 className="text-[#ff1e1e]" size={40} />
            <span className="font-orbitron font-bold text-3xl tracking-wider text-white">NEXO<span className="text-[#ff1e1e]">GAMES</span></span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-orbitron font-extrabold text-white">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            O{' '}
            <Link to="/register" className="font-medium text-[#ff1e1e] hover:text-red-400 transition-colors">
              crea una cuenta nueva
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-900/50 border border-[#ff1e1e] text-[#ff1e1e] px-4 py-3 rounded relative text-sm text-center" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <div className="rounded-md shadow-sm space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-gray-700 bg-[#0f0f0f] text-white placeholder-gray-500 focus:outline-none focus:ring-[#ff1e1e] focus:border-[#ff1e1e] focus:z-10 sm:text-sm transition-colors"
                placeholder="Correo electrónico"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-gray-700 bg-[#0f0f0f] text-white placeholder-gray-500 focus:outline-none focus:ring-[#ff1e1e] focus:border-[#ff1e1e] focus:z-10 sm:text-sm transition-colors"
                placeholder="Contraseña"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 bg-[#0f0f0f] border-gray-700 rounded text-[#ff1e1e] focus:ring-[#ff1e1e]"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                Recordarme
              </label>
            </div>

            <div className="text-sm">
              <Link to="/support" className="font-medium text-[#ff1e1e] hover:text-red-400 transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-[#ff1e1e] hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff1e1e] focus:ring-offset-[#0f0f0f] uppercase tracking-wider transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Iniciando...
                </span>
              ) : (
                'Entrar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
