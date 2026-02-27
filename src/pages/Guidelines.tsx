import React from 'react';

export default function Guidelines() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-orbitron font-bold text-white mb-8">Reglas de la Comunidad</h1>
      <div className="bg-[#141414] rounded-xl border border-gray-800 p-8 space-y-6 text-gray-300">
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">1. Respeto Mutuo</h2>
          <p>Trata a todos los miembros de la comunidad con respeto. No se tolerará el acoso, los insultos ni el lenguaje ofensivo.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">2. No Spam</h2>
          <p>Evita publicar contenido repetitivo, publicidad no deseada o enlaces maliciosos.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">3. Contenido Apropiado</h2>
          <p>Asegúrate de que todo el contenido compartido (imágenes, enlaces, texto) sea apropiado para todas las edades y no infrinja derechos de autor.</p>
        </section>
      </div>
    </div>
  );
}
