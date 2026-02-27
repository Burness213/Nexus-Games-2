import React from 'react';

export default function Privacy() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-orbitron font-bold text-white mb-8">Política de Privacidad</h1>
      <div className="bg-[#141414] rounded-xl border border-gray-800 p-8 space-y-6 text-gray-300">
        <p>En Nexo Games, nos tomamos muy en serio tu privacidad. Esta política describe cómo recopilamos, usamos y protegemos tu información personal.</p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">Recopilación de Datos</h2>
        <p>Recopilamos información básica como tu nombre de usuario y correo electrónico cuando te registras en nuestra plataforma.</p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">Uso de la Información</h2>
        <p>Utilizamos tu información para personalizar tu experiencia, enviarte notificaciones importantes y mejorar nuestros servicios.</p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">Protección de Datos</h2>
        <p>Implementamos medidas de seguridad estándar de la industria para proteger tu información contra el acceso no autorizado.</p>
      </div>
    </div>
  );
}
