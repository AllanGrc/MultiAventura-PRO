
import React, { useContext } from 'react';
import { Player } from '../types';
import { SettingsContext } from '../App';
import { base64Logo } from '../services/assets'; // Updated import path

interface HeaderProps {
  player: Player;
  adminTouch: () => void;
  logoSrc: string;
}

const Header: React.FC<HeaderProps> = ({ player, adminTouch, logoSrc }) => {
  const settings = useContext(SettingsContext);
  if (!settings) return null; // Or render a fallback if context not available

  const { toggleMute, isMuted, toggleDarkMode, isDarkMode } = settings;

  return (
    <header className="w-full max-w-lg bg-emerald-500 dark:bg-emerald-700 p-4 text-white flex justify-between items-center rounded-b-xl shadow-md z-10 transition-colors duration-300">
      <div className="flex items-center">
        <img src={logoSrc} alt="MultiAventura PRO Logo" className="h-8 w-8 mr-2" onClick={adminTouch} />
        <h1 className="text-xl font-bold">MultiAventura PRO</h1>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-xl">{player.avatar} {player.name}</span>
        <div className="flex items-center space-x-2">
          <span role="img" aria-label="Monedas" className="text-lg">💰</span>
          <span className="font-semibold">{player.coins}</span>
          <span role="img" aria-label="Vidas" className="text-lg">❤️</span>
          <span className="font-semibold">{player.lives}</span>
        </div>
        <button onClick={toggleMute} className="text-xl focus:outline-none">
          {isMuted ? <span role="img" aria-label="Mute">🔇</span> : <span role="img" aria-label="Unmute">🔊</span>}
        </button>
        <button onClick={toggleDarkMode} className="text-xl focus:outline-none">
          {isDarkMode ? <span role="img" aria-label="Light Mode">☀️</span> : <span role="img" aria-label="Dark Mode">🌙</span>}
        </button>
      </div>
    </header>
  );
};

export default Header;