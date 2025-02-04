import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RotateCcw, Plus, Minus } from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();

  // Default settings
  const DEFAULT_PLAYERS = 4;
  const DEFAULT_INITIAL_CHIPS = 1000;
  const DEFAULT_CHIP_UNITS = [10, 20, 50];

  // All available chip choices
  const CHIP_OPTIONS = [5, 10, 20, 50, 100, 200, 500, 1000];

  // Load settings from localStorage or set defaults
  const [numPlayers, setNumPlayers] = useState(() => {
    return parseInt(localStorage.getItem("numPlayers") || `${DEFAULT_PLAYERS}`);
  });

  const [initialChips, setInitialChips] = useState(() => {
    return parseInt(localStorage.getItem("initialChips") || `${DEFAULT_INITIAL_CHIPS}`);
  });

  const [chipUnits, setChipUnits] = useState(() => {
    const savedUnits = JSON.parse(localStorage.getItem("chipUnits") || JSON.stringify(DEFAULT_CHIP_UNITS));
    return savedUnits.sort((a: number, b: number) => a - b);
  });

  // Save settings when changed
  useEffect(() => {
    localStorage.setItem("numPlayers", numPlayers.toString());
    localStorage.setItem("initialChips", initialChips.toString());
    localStorage.setItem("chipUnits", JSON.stringify(chipUnits));
  }, [numPlayers, initialChips, chipUnits]);

  // Reset settings to defaults
  const resetSettings = () => {
    setNumPlayers(DEFAULT_PLAYERS);
    setInitialChips(DEFAULT_INITIAL_CHIPS);
    setChipUnits(DEFAULT_CHIP_UNITS);
    localStorage.setItem("numPlayers", `${DEFAULT_PLAYERS}`);
    localStorage.setItem("initialChips", `${DEFAULT_INITIAL_CHIPS}`);
    localStorage.setItem("chipUnits", JSON.stringify(DEFAULT_CHIP_UNITS));
  };

  // Increase/Decrease Players
  const increasePlayers = () => {
    setNumPlayers((prev) => prev + 1);
  };

  const decreasePlayers = () => {
    setNumPlayers((prev) => Math.max(0, prev - 1)); // ✅ Allows minimum `0` players
  };

  // Increase/Decrease Initial Chips by 1000
  const increaseChips = () => {
    setInitialChips((prev) => prev + 1000);
  };

  const decreaseChips = () => {
    setInitialChips((prev) => Math.max(0, prev - 1000)); // ✅ Allows `0` chips
  };

  // Toggle chip selection
  const toggleChipUnit = (chip: number) => {
    setChipUnits((prevUnits) =>
      prevUnits.includes(chip)
        ? prevUnits.filter((c) => c !== chip) // Remove if already selected
        : [...prevUnits, chip] // Add if not selected
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Game Settings</h1>
          <button
            onClick={resetSettings}
            className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition"
          >
            <RotateCcw size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Number of Players */}
        <label className="block mb-3">
          <span className="font-medium text-gray-700">Number of Players:</span>
          <div className="flex items-center mt-1">
            <button
              className="bg-gray-200 px-3 py-2 rounded-l hover:bg-gray-300 transition"
              onClick={decreasePlayers}
            >
              <Minus size={20} />
            </button>
            <input
              type="text"
              className="block w-full text-center p-2 border-t border-b border-gray-300"
              value={numPlayers}
              readOnly
            />
            <button
              className="bg-gray-200 px-3 py-2 rounded-r hover:bg-gray-300 transition"
              onClick={increasePlayers}
            >
              <Plus size={20} />
            </button>
          </div>
        </label>

        {/* Initial Chips per Player (with +1000 button) */}
        <label className="block mb-3">
          <span className="font-medium text-gray-700">Initial Chips per Player:</span>
          <div className="flex items-center mt-1">
            <button
              className="bg-gray-200 px-3 py-2 rounded-l hover:bg-gray-300 transition"
              onClick={decreaseChips}
            >
              <Minus size={20} />
            </button>
            <input
              type="text"
              className="block w-full text-center p-2 border-t border-b border-gray-300"
              value={initialChips}
              readOnly
            />
            <button
              className="bg-gray-200 px-3 py-2 rounded-r hover:bg-gray-300 transition"
              onClick={increaseChips}
            >
              <Plus size={20} />
            </button>
          </div>
        </label>

        {/* Chip Denominations (Multi-Select) */}
        <label className="block mb-4">
          <span className="font-medium text-gray-700">Select Chip Denominations:</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {CHIP_OPTIONS.map((chip) => (
              <button
                key={chip}
                onClick={() => toggleChipUnit(chip)}
                className={`px-4 py-2 text-sm rounded-full transition border ${
                  chipUnits.includes(chip)
                    ? "bg-blue-500 text-white border-blue-500" // ✅ Selected: Blue
                    : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200" // Unselected: Gray
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </label>

        {/* Save & Start Button */}
        <button
          className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition"
          onClick={() => navigate("/")}
        >
          Save & Start Game
        </button>
      </div>
    </div>
  );
};

export default Settings;