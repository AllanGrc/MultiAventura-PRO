
import React, { useContext } from 'react';
import { PlayerContext } from '../../App';

interface LeaderboardScreenProps {
  onBackToMap: () => void;
}

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ onBackToMap }) => {
  const playerContext = useContext(PlayerContext);
  const players = playerContext?.players || [];

  // Sort players by high score in descending order
  const sortedPlayers = [...players].sort((a, b) => b.highScore - a.highScore);

  return (
    <div className="flex flex-col items-center p-4 min-h-[calc(100vh-8rem)] animate-fadeIn">
      <h2 className="text-3xl font-bold text-zinc-800 dark:text-zinc-200 mb-6">
        🏆 Tabla de Posiciones
      </h2>
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-700 w-full max-w-md">
        {sortedPlayers.length === 0 ? (
          <p className="text-center text-zinc-600 dark:text-zinc-300">
            Aún no hay jugadores en la tabla. ¡Sé el primero!
          </p>
        ) : (
          <ul className="space-y-4">
            {sortedPlayers.map((player, index) => (
              <li
                key={player.name}
                className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-700 p-4 rounded-lg shadow-sm"
              >
                <div className="flex items-center">
                  <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mr-3">
                    {index + 1}.
                  </span>
                  <span className="text-3xl mr-3">{player.avatar}</span>
                  <span className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
                    {player.name}
                  </span>
                </div>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {player.highScore} puntos
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        onClick={onBackToMap}
        className="mt-8 bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline transform transition-all duration-200 hover:scale-105"
      >
        Volver al Mapa
      </button>
    </div>
  );
};

export default LeaderboardScreen;
