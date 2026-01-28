
import React, { useContext, useCallback } from 'react';
import { PlayerContext } from '../../App';

interface MapScreenProps {
  onStartTable: (table: number) => void;
}

const MapScreen: React.FC<MapScreenProps> = ({ onStartTable }) => {
  const playerContext = useContext(PlayerContext);
  const currentPlayer = playerContext?.currentPlayer;

  const handleStartGame = useCallback((table: number) => {
    if (currentPlayer && table <= currentPlayer.unlocked) {
      onStartTable(table); // Pass the selected table number
    } else {
      alert('¡Desbloquea las tablas anteriores primero!');
    }
  }, [currentPlayer, onStartTable]);

  if (!currentPlayer) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Cargando jugador o error de sesión...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-[calc(100vh-8rem)] animate-fadeIn">
      <h2 className="text-3xl font-bold text-zinc-800 dark:text-zinc-200 mb-6">
        Selecciona un Nivel
      </h2>
      <div className="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-5 max-w-lg w-full">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((tableNum) => (
          <button
            key={tableNum}
            onClick={() => handleStartGame(tableNum)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl shadow-lg transition-all duration-200 transform
              ${tableNum <= currentPlayer.unlocked
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer scale-105'
                : 'bg-zinc-300 dark:bg-zinc-700 text-zinc-500 cursor-not-allowed opacity-70'
              }`}
            disabled={tableNum > currentPlayer.unlocked}
            aria-label={`Tabla del ${tableNum} - ${tableNum <= currentPlayer.unlocked ? 'Desbloqueada' : 'Bloqueada'}`}
          >
            <span className="text-4xl font-extrabold">x{tableNum}</span>
            {tableNum > currentPlayer.unlocked && (
              <span className="text-xs mt-1">🔒 Bloqueado</span>
            )}
          </button>
        ))}
      </div>
      <p className="mt-8 text-lg text-zinc-700 dark:text-zinc-300">
        ¡Completa los niveles para desbloquear más desafíos!
      </p>
    </div>
  );
};

export default MapScreen;