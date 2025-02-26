import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="max-w-7xl mx-auto px-6 text-center">

        <div className="mb-6">
          <p className="text-2xl font-bold">Academia X</p>
          <p className="text-sm text-gray-400">© 2024 Todos os direitos reservados - Por Alixandre de Oliveira</p>
        </div>

        <div className="flex justify-center space-x-4">
          <Link href="#" className="text-gray-400 hover:text-white transition">
            <Facebook className='size-5' />
          </Link>
          <Link href="#" className="text-gray-400 hover:text-white transition">
            <Instagram className='size-5' />
          </Link>
          <Link href="#" className="text-gray-400 hover:text-white transition">
            <Twitter className='size-5' />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
