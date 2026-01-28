
import React, { useState, useEffect, useCallback, createContext } from 'react';
import { Player, Session, FeedbackOption } from './types';
import { initialAvatars, storeAvatars, feedbackOptions } from './constants';
import { playAudio } from './services/audioService'; // Remove base64Logo from here
import { base64Logo } from './services/assets'; // Import base64Logo from new assets file
import Header from './components/Header';
import SideMenu from './components/SideMenu';
import FeedbackMessage from './components/FeedbackMessage';
import LoginScreen from './components/screens/LoginScreen';
import MapScreen from './components/screens/MapScreen';
import GameScreen from './components/screens/GameScreen';
import StoreScreen from './components/screens/StoreScreen';
import LeaderboardScreen from './components/screens/LeaderboardScreen';

interface PlayerContextType {
  currentPlayer: Player | null;
  setCurrentPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
  savePlayers: () => void;
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
}

interface SettingsContextType {
  isMuted: boolean;
  toggleMute: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  playFeedbackAudio: (group: 'correct' | 'wrong', msg: string) => void;
  showFeedback: (message: string, type: 'correct' | 'wrong') => void;
  hideFeedback: () => void;
  feedbackState: { message: string; type: 'correct' | 'wrong' | null };
}

export const PlayerContext = createContext<PlayerContextType | undefined>(undefined);
export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const App: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>(() => {
    const savedPlayers = localStorage.getItem('multiPlayers');
    return savedPlayers ? JSON.parse(savedPlayers) : [];
  });
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [activeScreen, setActiveScreen] = useState<'login' | 'map' | 'game' | 'store' | 'leaderboard'>('login');
  const [tableToPlay, setTableToPlay] = useState<number | null>(null); // New state to hold the selected table
  const [isMuted, setIsMuted] = useState<boolean>(() => localStorage.getItem('isMuted') === 'true');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => localStorage.getItem('darkMode') === 'true');
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [feedbackState, setFeedbackState] = useState<{ message: string; type: 'correct' | 'wrong' | null }>({
    message: '',
    type: null,
  });

  const [adminClicks, setAdminClicks] = useState(0);

  useEffect(() => {
    localStorage.setItem('multiPlayers', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem('isMuted', String(isMuted));
  }, [isMuted]);

  useEffect(() => {
    localStorage.setItem('darkMode', String(isDarkMode));
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  const savePlayers = useCallback(() => {
    localStorage.setItem('multiPlayers', JSON.stringify(players));
  }, [players]);

  const normalizeName = useCallback((name: string) => name.trim().toLowerCase(), []);

  const loadPlayer = useCallback((inputName: string): Player | undefined => {
    const normalized = normalizeName(inputName);
    return players.find(p => normalizeName(p.name) === normalized);
  }, [players, normalizeName]);

  const handleLogin = useCallback((inputName: string, selectedAvatar: string) => {
    let player = loadPlayer(inputName);
    let isNew = false;

    if (!player) {
      isNew = true;
      player = {
        name: inputName,
        avatar: selectedAvatar,
        unlocked: 1,
        coins: 0,
        lives: 3,
        history: [],
        highScore: 0,
        unlockedAvatars: initialAvatars.slice(0, 1), // Only the first avatar is initially unlocked
      };
      setPlayers(prev => [...prev, player as Player]);
    } else {
      // Update avatar for existing player if selected, otherwise keep existing
      if (player.avatar !== selectedAvatar) {
        player.avatar = selectedAvatar;
        setPlayers(prev => prev.map(p => p.name === player?.name ? player : p));
      }
    }
    setCurrentPlayer(player as Player);
    savePlayers(); // Save updated player data

    if (isNew) {
      playAudio('welcome.mp3', isMuted);
    } else {
      playAudio('welcomeback.mp3', isMuted);
    }
    setActiveScreen('map');
  }, [loadPlayer, players, savePlayers, isMuted]);

  const handleLogout = useCallback(() => {
    setCurrentPlayer(null);
    setActiveScreen('login');
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const toggleMenu = useCallback(() => {
    setSideMenuOpen(prev => !prev);
  }, []);

  const showStore = useCallback(() => {
    setActiveScreen('store');
    setSideMenuOpen(false);
  }, []);

  const showLeaderboard = useCallback(() => {
    setActiveScreen('leaderboard');
    setSideMenuOpen(false);
  }, []);

  const showMap = useCallback(() => {
    setActiveScreen('map');
    setTableToPlay(null); // Clear selected table when returning to map
  }, []);

  // New handler for starting a specific table
  const handleStartTable = useCallback((tableNum: number) => {
    setTableToPlay(tableNum);
    setActiveScreen('game');
  }, []);

  const playFeedbackAudio = useCallback((group: 'correct' | 'wrong', msg: string) => {
    const option = feedbackOptions[group].find(opt => opt.msg === msg);
    if (option) {
      playAudio(option.audio, isMuted);
    }
  }, [isMuted]);

  const showFeedback = useCallback((message: string, type: 'correct' | 'wrong') => {
    setFeedbackState({ message, type });
  }, []);

  const hideFeedback = useCallback(() => {
    setFeedbackState({ message: '', type: null });
  }, []);

  const adminTouch = useCallback(() => {
    setAdminClicks(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (adminClicks >= 3) {
      downloadCSV();
      setAdminClicks(0);
    }
    const timer = setTimeout(() => setAdminClicks(0), 2000);
    return () => clearTimeout(timer);
  }, [adminClicks]);

  const downloadCSV = useCallback(() => {
    if (!currentPlayer || currentPlayer.history.length === 0) {
      alert("No hay datos para generar el reporte CSV.");
      return;
    }

    let fallos: { [key: number]: number } = {};
    let totalTime = 0;
    let totalCorrect = 0;
    currentPlayer.history.forEach(h => {
      if (!h.acierto) fallos[h.tabla] = (fallos[h.tabla] || 0) + 1;
      totalTime += parseFloat(h.tiempo);
      if (h.acierto) totalCorrect++;
    });

    let sugerencias: string[] = [];
    if (Object.keys(fallos).length > 0) {
      let worstTable = Object.keys(fallos).reduce((a, b) => (fallos[Number(a)] > fallos[Number(b)] ? a : b));
      sugerencias.push(`Recomendamos reforzar la tabla del ${worstTable} (más errores detectados).`);
    }
    if (currentPlayer.history.length > 0) {
      sugerencias.push(`Promedio de tiempo por respuesta: ${(totalTime / currentPlayer.history.length).toFixed(2)} segundos.`);
      sugerencias.push(`Precisión general: ${((totalCorrect / currentPlayer.history.length) * 100).toFixed(1)}%`);
    }

    let csv = "Nombre,Fecha,Operacion,Tiempo(s),Resultado,Sugerencias\n";
    currentPlayer.history.forEach(h => {
      csv += `${currentPlayer.name},${h.fecha},${h.op},${h.tiempo},${h.acierto ? 'Correcto' : 'Error'},"${sugerencias.join('; ')}"\n`;
    });

    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Reporte_${currentPlayer.name}.csv`;
    a.click();
  }, [currentPlayer]);

  // Context values
  const playerContextValue = {
    currentPlayer,
    setCurrentPlayer,
    savePlayers,
    players,
    setPlayers,
  };

  const settingsContextValue = {
    isMuted,
    toggleMute,
    isDarkMode,
    toggleDarkMode,
    playFeedbackAudio,
    showFeedback,
    hideFeedback,
    feedbackState,
  };

  return (
    <PlayerContext.Provider value={playerContextValue}>
      <SettingsContext.Provider value={settingsContextValue}>
        {currentPlayer && (
          <Header
            player={currentPlayer}
            adminTouch={adminTouch}
            logoSrc={base64Logo}
          />
        )}
        <SideMenu
          isOpen={sideMenuOpen}
          toggleMenu={toggleMenu}
          showStore={showStore}
          showLeaderboard={showLeaderboard}
          logout={handleLogout}
          contactInfo={{
            privacy: 'Todos los datos se guardan solo en tu dispositivo (localStorage). No se comparten ni se envían a servidores.',
            contact: '+505 8380 6424\nschoolel.info@gmail.com',
          }}
        />

        <div className="w-full max-w-lg flex flex-col items-center p-4 sm:p-6 box-border animate-fadeIn">
          {activeScreen === 'login' && <LoginScreen onLogin={handleLogin} player={currentPlayer} />}
          {activeScreen === 'map' && currentPlayer && <MapScreen onStartTable={handleStartTable} />}
          {activeScreen === 'game' && currentPlayer && tableToPlay !== null && (
            <GameScreen onGameEnd={showMap} tableNumber={tableToPlay} />
          )}
          {activeScreen === 'store' && currentPlayer && <StoreScreen onBackToMap={showMap} />}
          {activeScreen === 'leaderboard' && <LeaderboardScreen onBackToMap={showMap} />}
        </div>

        <FeedbackMessage message={feedbackState.message} type={feedbackState.type} />

        <footer className="text-xs text-zinc-500 p-4 text-center leading-relaxed">
          DESARROLLADO POR ALLAN GARCÍA 2026 - MultiAventura PRO v2.0
          <br />
          Contacto: +505 8380 6424 | schoolel.info@gmail.com
        </footer>
      </SettingsContext.Provider>
    </PlayerContext.Provider>
  );
};

export default App;