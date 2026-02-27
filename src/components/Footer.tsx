import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Gamepad2 } from 'lucide-react';
import { useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext';

export default function Footer() {
  const { settings } = useContext(SettingsContext);

  return (
    <footer className="bg-[#0a0a0a] border-t border-[#ff1e1e]/20 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <Gamepad2 className="text-[#ff1e1e]" size={32} />
              <span className="font-orbitron font-bold text-2xl tracking-wider text-white">
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
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {settings?.site_description || 'Tu portal definitivo para noticias, reseñas y comunidad gamer. Únete a la revolución del gaming con Nexo Games.'}
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#ff1e1e] transition-colors"><Facebook size={20} /></a>
              {settings?.twitter_link && <a href={settings.twitter_link} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#ff1e1e] transition-colors"><Twitter size={20} /></a>}
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#ff1e1e] transition-colors"><Instagram size={20} /></a>
              {settings?.youtube_link && <a href={settings.youtube_link} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#ff1e1e] transition-colors"><Youtube size={20} /></a>}
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-orbitron font-semibold mb-6 uppercase tracking-wider text-sm">Explorar</h3>
            <ul className="space-y-3">
              {settings?.footer_explore ? (
                settings.footer_explore.map((link: any, idx: number) => (
                  <li key={idx}><Link to={link.url} className="text-gray-400 hover:text-[#ff1e1e] text-sm transition-colors">{link.title}</Link></li>
                ))
              ) : (
                <>
                  <li><Link to="/search" className="text-gray-400 hover:text-[#ff1e1e] text-sm transition-colors">Todos los Juegos</Link></li>
                  <li><Link to="/news" className="text-gray-400 hover:text-[#ff1e1e] text-sm transition-colors">Noticias</Link></li>
                  <li><Link to="/reviews" className="text-gray-400 hover:text-[#ff1e1e] text-sm transition-colors">Reseñas</Link></li>
                  <li><Link to="/upcoming" className="text-gray-400 hover:text-[#ff1e1e] text-sm transition-colors">Próximos Lanzamientos</Link></li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-orbitron font-semibold mb-6 uppercase tracking-wider text-sm">Comunidad</h3>
            <ul className="space-y-3">
              {settings?.footer_community ? (
                settings.footer_community.map((link: any, idx: number) => (
                  <li key={idx}><Link to={link.url} className="text-gray-400 hover:text-[#ff1e1e] text-sm transition-colors">{link.title}</Link></li>
                ))
              ) : (
                <>
                  <li><Link to="/guidelines" className="text-gray-400 hover:text-[#ff1e1e] text-sm transition-colors">Reglas de la Comunidad</Link></li>
                  <li><Link to="/discord" className="text-gray-400 hover:text-[#ff1e1e] text-sm transition-colors">Discord Oficial</Link></li>
                  <li><Link to="/support" className="text-gray-400 hover:text-[#ff1e1e] text-sm transition-colors">Soporte</Link></li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-orbitron font-semibold mb-6 uppercase tracking-wider text-sm">Legal</h3>
            <ul className="space-y-3">
              {settings?.footer_legal ? (
                settings.footer_legal.map((link: any, idx: number) => (
                  <li key={idx}><Link to={link.url} className="text-gray-400 hover:text-[#ff1e1e] text-sm transition-colors">{link.title}</Link></li>
                ))
              ) : (
                <>
                  <li><Link to="/privacy" className="text-gray-400 hover:text-[#ff1e1e] text-sm transition-colors">Política de Privacidad</Link></li>
                  <li><Link to="/terms" className="text-gray-400 hover:text-[#ff1e1e] text-sm transition-colors">Términos de Servicio</Link></li>
                  <li><Link to="/cookies" className="text-gray-400 hover:text-[#ff1e1e] text-sm transition-colors">Política de Cookies</Link></li>
                  <li><Link to="/contact" className="text-gray-400 hover:text-[#ff1e1e] text-sm transition-colors">Contacto</Link></li>
                </>
              )}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} {settings?.site_name || 'Nexo Games'}. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Diseñado con</span>
            <span className="text-[#ff1e1e]">♥</span>
            <span>para gamers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
