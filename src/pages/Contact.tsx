import React from 'react';

export default function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-orbitron font-bold text-white mb-8">Contacto</h1>
      <div className="bg-[#141414] rounded-xl border border-gray-800 p-8 max-w-3xl mx-auto">
        <p className="text-gray-400 mb-8">¿Tienes alguna pregunta, sugerencia o problema? Completa el siguiente formulario y nos pondremos en contacto contigo lo antes posible.</p>
        
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Mensaje enviado. Nos pondremos en contacto pronto.'); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Nombre</label>
              <input type="text" required className="w-full bg-[#0f0f0f] border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-[#ff1e1e] focus:outline-none transition-colors" placeholder="Tu nombre" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Correo Electrónico</label>
              <input type="email" required className="w-full bg-[#0f0f0f] border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-[#ff1e1e] focus:outline-none transition-colors" placeholder="tu@email.com" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Asunto</label>
            <input type="text" required className="w-full bg-[#0f0f0f] border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-[#ff1e1e] focus:outline-none transition-colors" placeholder="¿En qué podemos ayudarte?" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Mensaje</label>
            <textarea required rows={6} className="w-full bg-[#0f0f0f] border border-gray-800 rounded-lg px-4 py-3 text-white focus:border-[#ff1e1e] focus:outline-none transition-colors" placeholder="Escribe tu mensaje aquí..."></textarea>
          </div>
          <button type="submit" className="bg-[#ff1e1e] hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors w-full md:w-auto">
            Enviar Mensaje
          </button>
        </form>
      </div>
    </div>
  );
}
