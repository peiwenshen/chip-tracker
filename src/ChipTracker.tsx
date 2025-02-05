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

  // Generate players
  const generatePlayers = () => {
    return Array.from({ length: numPlayers }, (_, i) => ({
      id: i + 1,
      name: `玩家 ${i + 1}`,
      chips: initialChips,
      isCurrentPlayer: i === 0,
    }));
  };

  // Initialize players
  const [players, setPlayers] = useState(() => {
    const savedPlayers = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedPlayers) {
      try {
        const parsedPlayers = JSON.parse(savedPlayers);
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

  // Reset players when settings change
  useEffect(() => {
    if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
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
    <div className="w-full px-4 sm:px-6 md:px-8 mx-auto max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">籌碼記錄器</h1>
        <div className="flex gap-3">
          <button onClick={resetGame} className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200">
            <RotateCcw size={22} />
          </button>
          <button onClick={() => navigate("/settings")} className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200">
            <Settings size={22} />
          </button>
        </div>
      </div>

      {/* Player Selection */}
      <div className="bg-gray-50 p-1 rounded-lg mb-6">
        <div className="flex flex-wrap gap-2">
          {players.map(player => (
            <button
              key={player.id}
              onClick={() => setCurrentPlayer(player.id)}
              className={`px-5 py-3 text-sm sm:text-base rounded-lg transition flex-1 basis-1/4 ${
                player.isCurrentPlayer ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {player.name}
            </button>
          ))}
        </div>
      </div>

      {/* Chip Selection */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
          {chipUnits.map(amount => (
            <button
              key={amount}
              onClick={() => addToTransfer(amount)}
              className="px-4 py-2 text-sm sm:text-base bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              +{amount}
            </button>
          ))}
        </div>
      </div>

      {/* Accumulated Chips */}
      {accumulatedTransfer > 0 && (
        <div className="mt-4 flex justify-between items-center text-lg sm:text-xl font-bold">
          <span>累積轉移：{accumulatedTransfer} 籌碼</span>
          <button 
            onClick={() => setAccumulatedTransfer(0)}
            className="bg-red-100 text-red-600 p-3 rounded-lg"
          >
            <X size={36} />
          </button>
        </div>
      )}

      {/* Player Info */}
      {players.map(player => (
        <div key={player.id} className="bg-white border rounded-lg p-4 mb-4 shadow-md flex items-center justify-between">
          <div>
            <h2 className={`text-lg sm:text-xl font-semibold ${player.isCurrentPlayer ? 'text-blue-600' : ''}`}>
              {player.name} {player.isCurrentPlayer ? '(當前玩家)' : ''}
            </h2>
            <p className="text-xl sm:text-2xl font-bold text-green-600">{player.chips} 籌碼</p>
          </div>
          {!player.isCurrentPlayer && (
            <button 
              onClick={() => setSelectedReceiver(player.id)}
              className={`p-3 sm:p-4 rounded-lg transition ${
                selectedReceiver === player.id ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Send size={22} />
            </button>
          )}
        </div>
      ))}

      {/* Transfer Confirmation Button (Fixed) */}
      {selectedReceiver && accumulatedTransfer > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t shadow-md">
          <button
            onClick={transferChips}
            disabled={currentPlayer?.chips < accumulatedTransfer}
            className={`w-full p-4 text-lg sm:text-xl rounded-lg transition ${
              currentPlayer?.chips >= accumulatedTransfer && accumulatedTransfer > 0
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            確認轉移 {accumulatedTransfer} 籌碼給 {players.find(p => p.id === selectedReceiver)?.name}
          </button>
        </div>
      )}
    </div>
  );
};

export default ChipTracker;