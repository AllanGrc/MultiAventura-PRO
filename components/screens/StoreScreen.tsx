
import React, { useContext, useCallback, useState } from 'react';
import { PlayerContext, SettingsContext } from '../../App';
import { storeAvatars, initialAvatars } from '../../constants';

interface StoreScreenProps {
  onBackToMap: () => void;
}

const StoreScreen: React.FC<StoreScreenProps> = ({ onBackToMap }) => {
  const playerContext = useContext(PlayerContext);
  const settingsContext = useContext(SettingsContext);

  if (!playerContext || !settingsContext) return null;

  const { currentPlayer, setCurrentPlayer, savePlayers } = playerContext;
  const { showFeedback } = settingsContext;

  const [currentSelectedAvatar, setCurrentSelectedAvatar] = useState(currentPlayer?.avatar || initialAvatars[0]);

  const getOwnedAvatars = useCallback(() => {
    const owned = new Set(initialAvatars);
    if (currentPlayer?.unlockedAvatars) {
      currentPlayer.unlockedAvatars.forEach(avatar => owned.add(avatar));
    }
    return Array.from(owned);
  }, [currentPlayer]);

  const handlePurchase = useCallback((avatarItem: { emoji: string; name: string; cost: number }) => {
    if (!currentPlayer) return;

    const ownedAvatars = getOwnedAvatars();
    if (ownedAvatars.includes(avatarItem.emoji)) {
      showFeedback(`Ya tienes a ${avatarItem.name}.`, 'wrong');
      return;
    }

    if (currentPlayer.coins >= avatarItem.cost) {
      const updatedPlayer = {
        ...currentPlayer,
        coins: currentPlayer.coins - avatarItem.cost,
        unlockedAvatars: [...(currentPlayer.unlockedAvatars || []), avatarItem.emoji],
      };
      setCurrentPlayer(updatedPlayer);
      savePlayers();
      showFeedback(`¡Felicidades! Has comprado a ${avatarItem.name}.`, 'correct');
    } else {
      showFeedback(`Necesitas ${avatarItem.cost - currentPlayer.coins} monedas más para ${avatarItem.name}.`, 'wrong');
    }
  }, [currentPlayer, setCurrentPlayer, savePlayers, showFeedback, getOwnedAvatars]);

  const handleSelectAvatar = useCallback((avatarEmoji: string) => {
    if (!currentPlayer) return;

    const ownedAvatars = getOwnedAvatars();
    if (ownedAvatars.includes(avatarEmoji)) {
      const updatedPlayer = {
        ...currentPlayer,
        avatar: avatarEmoji,
      };
      setCurrentPlayer(updatedPlayer);
      savePlayers();
      setCurrentSelectedAvatar(avatarEmoji); // Update local state for visual feedback
      showFeedback(`Has cambiado tu avatar a ${avatarEmoji}.`, 'correct');
    } else {
      showFeedback(`Primero debes comprar este avatar.`, 'wrong');
    }
  }, [currentPlayer, setCurrentPlayer, savePlayers, showFeedback, getOwnedAvatars]);

  if (!currentPlayer) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Cargando tienda o error de sesión...</p>
      </div>
    );
  }

  const ownedAvatars = getOwnedAvatars();

  return (
    <div className="flex flex-col items-center p-4 min-h-[calc(100vh-8rem)] animate-fadeIn">
      <h2 className="text-3xl font-bold text-zinc-800 dark:text-zinc-200 mb-6">
        Tienda de Avatares
      </h2>
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-700 w-full max-w-md mb-6 text-center">
        <p className="text-xl font-semibold text-zinc-700 dark:text-zinc-300">
          Tus Monedas: <span className="text-emerald-600 dark:text-emerald-400">💰 {currentPlayer.coins}</span>
        </p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 w-full max-w-lg mb-8">
        {storeAvatars.map((avatarItem) => {
          const isOwned = ownedAvatars.includes(avatarItem.emoji);
          const isCurrent = currentSelectedAvatar === avatarItem.emoji;

          return (
            <div
              key={avatarItem.name}
              className={`flex flex-col items-center p-3 rounded-xl shadow-md transition-all duration-200
                ${isOwned ? 'bg-emerald-100 dark:bg-emerald-800' : 'bg-zinc-100 dark:bg-zinc-700'}
                ${isCurrent ? 'ring-4 ring-emerald-500 dark:ring-emerald-300' : ''}`
              }
            >
              <span className="text-5xl mb-2">{avatarItem.emoji}</span>
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 text-center truncate w-full px-1">
                {avatarItem.name}
              </p>
              {isOwned ? (
                <button
                  onClick={() => handleSelectAvatar(avatarItem.emoji)}
                  className={`mt-2 py-1 px-3 rounded-full text-xs font-bold transition-colors
                    ${isCurrent ? 'bg-emerald-600 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}
                  `}
                  disabled={isCurrent}
                >
                  {isCurrent ? 'Seleccionado' : 'Usar'}
                </button>
              ) : (
                <button
                  onClick={() => handlePurchase(avatarItem)}
                  className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded-full text-xs transition-colors"
                >
                  💰 {avatarItem.cost}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={onBackToMap}
        className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline transform transition-all duration-200 hover:scale-105"
      >
        Volver al Mapa
      </button>
    </div>
  );
};

export default StoreScreen;
