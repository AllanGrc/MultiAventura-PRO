
import React, { useState, FormEvent, useContext, useEffect } from 'react';
import { initialAvatars } from '../../constants';
import { PlayerContext, SettingsContext } from '../../App';
// Import Player type
import { Player } from '../../types';

interface LoginScreenProps {
  onLogin: (name: string, avatar: string) => void;
  player: PlayerContextType['currentPlayer'];
}

interface PlayerContextType {
  currentPlayer: Player | null;
  setCurrentPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
  savePlayers: () => void;
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, player }) => {
  const playerContext = useContext(PlayerContext);
  const settingsContext = useContext(SettingsContext);

  const [playerName, setPlayerName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(initialAvatars[0]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (playerContext?.currentPlayer) {
      setPlayerName(playerContext.currentPlayer.name);
      setSelectedAvatar(playerContext.currentPlayer.avatar);
    }
  }, [playerContext?.currentPlayer]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setErrorMessage('Por favor, ingresa tu nombre.');
      return;
    }
    setErrorMessage('');
    onLogin(playerName, selectedAvatar);
  };

  const loadExistingPlayer = (existingPlayerName: string) => {
    const existingPlayer = playerContext?.players.find(
      (p) => p.name.toLowerCase() === existingPlayerName.toLowerCase()
    );
    if (existingPlayer) {
      setPlayerName(existingPlayer.name);
      setSelectedAvatar(existingPlayer.avatar);
      setErrorMessage('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center animate-fadeIn p-4">
      <h2 className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-8 drop-shadow-lg">
        ¡Bienvenido a MultiAventura PRO!
      </h2>
      <p className="text-lg text-zinc-700 dark:text-zinc-300 mb-6">
        Aprende y diviértete con las tablas de multiplicar.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-700">
        <div className="mb-6">
          <label htmlFor="playerName" className="block text-zinc-600 dark:text-zinc-300 text-sm font-bold mb-2 text-left">
            Tu Nombre:
          </label>
          <input
            type="text"
            id="playerName"
            className="shadow appearance-none border rounded w-full py-3 px-4 text-zinc-700 dark:text-zinc-200 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 bg-zinc-50 dark:bg-zinc-700"
            placeholder="Escribe tu nombre aquí"
            value={playerName}
            onChange={(e) => {
              setPlayerName(e.target.value);
              setErrorMessage(''); // Clear error on input change
            }}
            aria-label="Nombre del jugador"
            maxLength={15}
          />
          {errorMessage && (
            <p className="text-red-500 text-xs italic mt-2 text-left">{errorMessage}</p>
          )}
        </div>

        {playerContext && playerContext.players.length > 0 && (
          <div className="mb-6">
            <label htmlFor="loadPlayer" className="block text-zinc-600 dark:text-zinc-300 text-sm font-bold mb-2 text-left">
              O selecciona un jugador existente:
            </label>
            <select
              id="loadPlayer"
              className="shadow border rounded w-full py-3 px-4 text-zinc-700 dark:text-zinc-200 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 bg-zinc-50 dark:bg-zinc-700 cursor-pointer"
              onChange={(e) => loadExistingPlayer(e.target.value)}
              value={playerContext.currentPlayer?.name || ''}
              aria-label="Seleccionar jugador existente"
            >
              <option value="">-- Nuevo jugador --</option>
              {playerContext.players.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mb-8">
          <label className="block text-zinc-600 dark:text-zinc-300 text-sm font-bold mb-2 text-left">
            Elige tu Avatar:
          </label>
          <div className="grid grid-cols-5 gap-2 justify-items-center">
            {initialAvatars.concat(
              playerContext?.currentPlayer?.unlockedAvatars || []
            ).map((avatarEmoji) => (
              <button
                type="button"
                key={avatarEmoji}
                className={`text-4xl p-2 rounded-lg transition-all duration-200 ${
                  selectedAvatar === avatarEmoji
                    ? 'bg-emerald-200 dark:bg-emerald-600 ring-4 ring-emerald-500 dark:ring-emerald-300 scale-110'
                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-700'
                }`}
                onClick={() => setSelectedAvatar(avatarEmoji)}
                aria-label={`Seleccionar avatar ${avatarEmoji}`}
              >
                {avatarEmoji}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline transform transition-all duration-200 hover:scale-105"
        >
          ¡A Jugar!
        </button>
      </form>
    </div>
  );
};

export default LoginScreen;