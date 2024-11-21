import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-2">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="mb-4">
          <p className="text-lg font-semibold">Academia X</p>
          <p className="text-sm">© 2024 Todos os direitos reservados - Por Alixandre de Oliveira</p>
        </div>
        <div>
          <a href="#" className="text-gray-400 hover:text-white mx-2">Privacidade</a>
          <a href="#" className="text-gray-400 hover:text-white mx-2">Termos</a>
          <a href="#" className="text-gray-400 hover:text-white mx-2">Contato</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
