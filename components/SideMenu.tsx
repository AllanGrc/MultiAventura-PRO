
import React from 'react';

interface SideMenuProps {
  isOpen: boolean;
  toggleMenu: () => void;
  showStore: () => void;
  showLeaderboard: () => void;
  logout: () => void;
  contactInfo: { privacy: string; contact: string };
}

const SideMenu: React.FC<SideMenuProps> = ({
  isOpen,
  toggleMenu,
  showStore,
  showLeaderboard,
  logout,
  contactInfo,
}) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300"
          onClick={toggleMenu}
        ></div>
      )}

      {/* Menu Container */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-zinc-800 dark:bg-zinc-900 text-white shadow-lg transform transition-transform duration-300 ease-in-out z-30
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-emerald-300">Menú</h2>
          <nav className="space-y-4">
            <button
              onClick={showStore}
              className="block w-full text-left text-lg py-2 px-4 rounded hover:bg-zinc-700 dark:hover:bg-zinc-800 transition-colors duration-200"
            >
              🛍️ Tienda de Avatares
            </button>
            <button
              onClick={showLeaderboard}
              className="block w-full text-left text-lg py-2 px-4 rounded hover:bg-zinc-700 dark:hover:bg-zinc-800 transition-colors duration-200"
            >
              🏆 Tabla de Posiciones
            </button>
            <button
              onClick={logout}
              className="block w-full text-left text-lg py-2 px-4 rounded hover:bg-red-700 transition-colors duration-200"
            >
              🚪 Cerrar Sesión
            </button>
          </nav>
          <div className="mt-8 pt-4 border-t border-zinc-700 text-sm text-zinc-400">
            <p className="mb-2"><strong>Privacidad:</strong> {contactInfo.privacy}</p>
            <p><strong>Contacto:</strong> {contactInfo.contact}</p>
          </div>
        </div>
        <button
          onClick={toggleMenu}
          className="absolute top-4 right-4 text-white text-2xl focus:outline-none"
          aria-label="Cerrar menú"
        >
          ✕
        </button>
      </div>

      {/* Hamburger icon for opening the menu */}
      {!isOpen && (
        <button
          onClick={toggleMenu}
          className="fixed top-4 left-4 bg-emerald-500 dark:bg-emerald-700 text-white p-2 rounded-full shadow-lg z-20 focus:outline-none"
          aria-label="Abrir menú"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      )}
    </>
  );
};

export default SideMenu;
