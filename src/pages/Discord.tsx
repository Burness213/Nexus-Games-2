import React, { useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext';

export default function Discord() {
  const { settings } = useContext(SettingsContext);
  const discordLink = settings?.discord_link || 'https://discord.gg';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
      <h1 className="text-4xl font-orbitron font-bold text-white mb-8">Únete a nuestro Discord Oficial</h1>
      <div className="bg-[#141414] rounded-xl border border-gray-800 p-12 max-w-2xl mx-auto">
        <p className="text-gray-400 text-lg mb-8">Conecta con otros gamers, participa en eventos exclusivos y mantente al día con las últimas novedades de la comunidad.</p>
        <a 
          href={discordLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-4 px-8 rounded-lg transition-colors text-xl"
        >
          Unirse al Servidor
        </a>
      </div>
    </div>
  );
}
