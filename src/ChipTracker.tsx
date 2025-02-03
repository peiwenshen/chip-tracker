import React, { useState } from 'react';
import { ChevronUp, ChevronDown, RotateCcw, Send, X } from 'lucide-react';

const ChipTracker = () => {
  const [players, setPlayers] = useState([
    { id: 1, name: 'Player 1', chips: 1000, isCurrentPlayer: true },
    { id: 2, name: 'Player 2', chips: 1000, isCurrentPlayer: false },
    { id: 3, name: 'Player 3', chips: 1000, isCurrentPlayer: false },
    { id: 4, name: 'Player 4', chips: 1000, isCurrentPlayer: false }
  ]);

  const [transferPresets] = useState([10, 50, 100]);
  const [accumulatedTransfer, setAccumulatedTransfer] = useState(0);
  const [selectedReceiver, setSelectedReceiver] = useState(null);

  const setCurrentPlayer = (playerId) => {
    setPlayers(players.map(player => ({
      ...player, 
      isCurrentPlayer: player.id === playerId
    })));
  };

  const currentPlayer = players.find(p => p.isCurrentPlayer);

  const addToTransfer = (amount) => {
    setAccumulatedTransfer(prev => prev + amount);
  };

  const transferChips = () => {
    if (!selectedReceiver || accumulatedTransfer === 0) return;

    setPlayers(players.map(player => {
      if (player.id === currentPlayer.id) {
        return { ...player, chips: player.chips - accumulatedTransfer };
      }
      if (player.id === selectedReceiver) {
        return { ...player, chips: player.chips + accumulatedTransfer };
      }
      return player;
    }));

    setAccumulatedTransfer(0);
    setSelectedReceiver(null);
  };

  const resetGame = () => {
    setPlayers(players.map((player, index) => ({ 
      ...player, 
      chips: 1000, 
      isCurrentPlayer: index === 0 
    })));
    setAccumulatedTransfer(0);
    setSelectedReceiver(null);
  };

  return (
    <div className="bg-white min-h-screen p-4 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Chip Tracker</h1>
        <button 
          onClick={resetGame} 
          className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition"
        >
          <RotateCcw size={20} className="text-gray-600" />
        </button>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <div className="flex justify-between mb-4">
          {players.map(player => (
            <button
              key={player.id}
              onClick={() => setCurrentPlayer(player.id)}
              className={`
                px-4 py-2 rounded-full transition
                ${player.isCurrentPlayer 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
              `}
            >
              {player.name}
            </button>
          ))}
        </div>

        <div className="flex justify-between">
          {transferPresets.map(amount => (
            <button
              key={amount}
              onClick={() => addToTransfer(amount)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition"
            >
              {amount}
            </button>
          ))}
        </div>
        {accumulatedTransfer > 0 && (
          <div className="mt-2 flex justify-between items-center">
            <span className="text-lg font-bold">Accumulated: {accumulatedTransfer}</span>
            <button 
              onClick={() => setAccumulatedTransfer(0)}
              className="bg-red-100 text-red-600 p-2 rounded-full"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {players.map(player => (
        <div 
          key={player.id} 
          className={`
            bg-white border rounded-lg p-4 mb-4 shadow-sm flex items-center justify-between
            ${player.isCurrentPlayer ? 'border-blue-500' : ''}
          `}
        >
          <div>
            <h2 className={`text-lg font-semibold ${player.isCurrentPlayer ? 'text-blue-600' : ''}`}>
              {player.name} {player.isCurrentPlayer ? '(Current)' : ''}
            </h2>
            <p className="text-2xl font-bold text-green-600">{player.chips} chips</p>
          </div>
          {!player.isCurrentPlayer && (
            <button 
              onClick={() => setSelectedReceiver(player.id)}
              className={`
                p-2 rounded-full transition
                ${selectedReceiver === player.id ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
              `}
            >
              <Send size={20} />
            </button>
          )}
        </div>
      ))}

      {selectedReceiver && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t shadow-lg">
          <button
            onClick={transferChips}
            disabled={currentPlayer.chips < accumulatedTransfer}
            className={`
              w-full p-3 rounded-lg transition
              ${currentPlayer.chips >= accumulatedTransfer && accumulatedTransfer > 0
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
            `}
          >
            Transfer {accumulatedTransfer} chips to {players.find(p => p.id === selectedReceiver).name}
          </button>
        </div>
      )}
    </div>
  );
};

export default ChipTracker;
