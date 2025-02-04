import React, { useState, useEffect } from "react";
import { RotateCcw, Send, X, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LOCAL_STORAGE_KEY = "chip-tracker-players";

const ChipTracker = () => {
  const navigate = useNavigate();

  // Load settings from localStorage
  const [numPlayers, setNumPlayers] = useState(() => parseInt(localStorage.getItem("numPlayers") || "4"));
  const [initialChips, setInitialChips] = useState(() => parseInt(localStorage.getItem("initialChips") || "1000"));
  const [chipUnits, setChipUnits] = useState(() => {
    const units = JSON.parse(localStorage.getItem("chipUnits") || "[10,20,50,100]");
    return units.sort((a: number, b: number) => a - b);
  });

  // Generate players based on settings
  const generatePlayers = () => {
    return Array.from({ length: numPlayers }, (_, i) => ({
      id: i + 1,
      name: `Player ${i + 1}`,
      chips: initialChips,
      isCurrentPlayer: i === 0,
    }));
  };

  // Initialize players state with saved data or generate new players
  const [players, setPlayers] = useState(() => {
    const savedPlayers = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedPlayers) {
      try {
        const parsedPlayers = JSON.parse(savedPlayers);
        // Validate that saved data matches current settings
        if (parsedPlayers.length === numPlayers) {
          return parsedPlayers;
        }
      } catch (error) {
        console.error("Error parsing saved players:", error);
      }
    }
    return generatePlayers();
  });

  const [accumulatedTransfer, setAccumulatedTransfer] = useState(0);
  const [selectedReceiver, setSelectedReceiver] = useState<number | null>(null);

  // Only update players when settings change AND there's no saved state
  useEffect(() => {
    const savedPlayers = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!savedPlayers) {
      setPlayers(generatePlayers());
    }
  }, [numPlayers, initialChips]);

  // Save players state
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(players));
  }, [players]);

  const setCurrentPlayer = (playerId: number) => {
    setPlayers(players.map(player => ({
      ...player,
      isCurrentPlayer: player.id === playerId
    })));
  };

  const currentPlayer = players.find(p => p.isCurrentPlayer);

  const addToTransfer = (amount: number) => {
    setAccumulatedTransfer(prev => prev + amount);
  };

  const transferChips = () => {
    if (!selectedReceiver || accumulatedTransfer === 0) return;

    setPlayers(players.map(player => {
      if (player.id === currentPlayer?.id) {
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
    const newPlayers = generatePlayers();
    setPlayers(newPlayers);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newPlayers));
    setAccumulatedTransfer(0);
    setSelectedReceiver(null);
  };

  return (
    <div className="bg-white min-h-screen p-4 mx-auto w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Chip Tracker</h1>
        <div className="flex gap-2">
          <button onClick={resetGame} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
            <RotateCcw size={24} />
          </button>
          <button onClick={() => navigate("/settings")} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
            <Settings size={24} />
          </button>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {players.map(player => (
            <button
              key={player.id}
              onClick={() => setCurrentPlayer(player.id)}
              className={`px-4 py-2 text-sm sm:text-base md:text-lg rounded-full transition ${
                player.isCurrentPlayer ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {player.name}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {chipUnits.map(amount => (
            <button
              key={amount}
              onClick={() => addToTransfer(amount)}
              className="px-6 py-3 text-sm sm:text-base md:text-lg bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition"
            >
              +{amount}
            </button>
          ))}
        </div>

        {accumulatedTransfer > 0 && (
          <div className="mt-4 flex justify-between items-center text-lg sm:text-xl md:text-2xl font-bold">
            <span>Accumulated Chips: {accumulatedTransfer}</span>
            <button 
              onClick={() => setAccumulatedTransfer(0)}
              className="bg-red-100 text-red-600 p-2 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
        )}
      </div>

      {players.map(player => (
        <div key={player.id} className="bg-white border rounded-lg p-4 mb-4 shadow-sm flex items-center justify-between">
          <div>
            <h2 className={`text-lg sm:text-xl md:text-2xl font-semibold ${player.isCurrentPlayer ? 'text-blue-600' : ''}`}>
              {player.name} {player.isCurrentPlayer ? '(Current)' : ''}
            </h2>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600">{player.chips} chips</p>
          </div>
          {!player.isCurrentPlayer && (
            <button 
              onClick={() => setSelectedReceiver(player.id)}
              className={`p-2 sm:p-3 md:p-4 rounded-full transition ${
                selectedReceiver === player.id ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Send size={24} />
            </button>
          )}
        </div>
      ))}

      {selectedReceiver && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t shadow-lg">
          <button
            onClick={transferChips}
            disabled={currentPlayer?.chips < accumulatedTransfer}
            className={`w-full p-4 text-lg sm:text-xl md:text-2xl rounded-lg transition ${
              currentPlayer?.chips >= accumulatedTransfer && accumulatedTransfer > 0
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Transfer {accumulatedTransfer} chips to {players.find(p => p.id === selectedReceiver)?.name}
          </button>
        </div>
      )}
    </div>
  );
};

export default ChipTracker;