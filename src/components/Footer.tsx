
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Music } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-600 py-8 text-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-end mb-6">
              <span className="text-white logo-robot text-xl font-bold">ROBOT</span>
              <span className="text-blue-300 logo-cleaner -ml-1">Cleaner</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quem somos?</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/sobre-nos" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link to="/loja" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Loja
                </Link>
              </li>
              <li>
                <Link to="/novidades" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Novidades
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Ajuda</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white text-sm transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link to="/termos" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Termos & política
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-300">Sukasaih, Kota Tangerang, Banten 15111</li>
              <li className="text-gray-300">Phone : 0976444677</li>
              <li className="text-gray-300">Mail : adminvantele@domain.com</li>
            </ul>
            
            <h3 className="text-lg font-semibold mt-6 mb-4">Redes</h3>
            <ul className="space-y-2">
              <li>
                <Link to="https://facebook.com" className="text-gray-300 hover:text-white text-sm flex items-center transition-colors">
                  <Facebook className="h-4 w-4 mr-2" />
                  Facebook
                </Link>
              </li>
              <li>
                <Link to="https://tiktok.com" className="text-gray-300 hover:text-white text-sm flex items-center transition-colors">
                  <Music className="h-4 w-4 mr-2" />
                  Tiktok
                </Link>
              </li>
              <li>
                <Link to="https://instagram.com" className="text-gray-300 hover:text-white text-sm flex items-center transition-colors">
                  <Instagram className="h-4 w-4 mr-2" />
                  Instagram
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
