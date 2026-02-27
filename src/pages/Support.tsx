import React from 'react';
import { Mail, MessageSquare, HelpCircle } from 'lucide-react';

export default function Support() {
  return (
    <div className="bg-[#0f0f0f] min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-orbitron font-bold text-white mb-4">Centro de Soporte</h1>
          <p className="text-gray-400 text-lg">¿Necesitas ayuda? Estamos aquí para asistirte.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-[#141414] p-8 rounded-xl border border-gray-800 text-center hover:border-[#ff1e1e]/50 transition-colors">
            <div className="w-16 h-16 bg-[#ff1e1e]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <HelpCircle size={32} className="text-[#ff1e1e]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Preguntas Frecuentes</h3>
            <p className="text-gray-400 mb-6">Encuentra respuestas rápidas a los problemas más comunes.</p>
            <button className="text-[#ff1e1e] font-bold hover:underline">Ver FAQ</button>
          </div>

          <div className="bg-[#141414] p-8 rounded-xl border border-gray-800 text-center hover:border-[#ff1e1e]/50 transition-colors">
            <div className="w-16 h-16 bg-[#ff1e1e]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare size={32} className="text-[#ff1e1e]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Foro de la Comunidad</h3>
            <p className="text-gray-400 mb-6">Pide ayuda a otros usuarios y comparte tus soluciones.</p>
            <a href="/forum" className="text-[#ff1e1e] font-bold hover:underline">Ir al Foro</a>
          </div>

          <div className="bg-[#141414] p-8 rounded-xl border border-gray-800 text-center hover:border-[#ff1e1e]/50 transition-colors">
            <div className="w-16 h-16 bg-[#ff1e1e]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail size={32} className="text-[#ff1e1e]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Contacto Directo</h3>
            <p className="text-gray-400 mb-6">Envíanos un mensaje y te responderemos lo antes posible.</p>
            <a href="mailto:soporte@nexogames.com" className="text-[#ff1e1e] font-bold hover:underline">Enviar Email</a>
          </div>
        </div>

        <div className="bg-[#141414] rounded-xl border border-gray-800 p-8">
          <h2 className="text-2xl font-orbitron font-bold text-white mb-6">Enviar un Ticket</h2>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Nombre</label>
                <input type="text" className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff1e1e]" placeholder="Tu nombre" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                <input type="email" className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff1e1e]" placeholder="tu@email.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Asunto</label>
              <input type="text" className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff1e1e]" placeholder="¿En qué podemos ayudarte?" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Mensaje</label>
              <textarea rows={6} className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff1e1e]" placeholder="Describe tu problema con detalle..."></textarea>
            </div>
            <button type="submit" className="bg-[#ff1e1e] hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
              Enviar Mensaje
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
