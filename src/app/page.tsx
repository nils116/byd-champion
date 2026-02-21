"use client";

import { useState, useEffect, useCallback, useRef } from "react";

type GameState = "menu" | "character" | "car-select" | "race" | "result";
type Character = "nils" | "kim" | null;
type Car = "byd" | "arona" | null;

export default function Game() {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [selectedChar, setSelectedChar] = useState<Character>(null);
  const [selectedCar, setSelectedCar] = useState<Car>(null);
  const [raceProgress, setRaceProgress] = useState({ player: 0, opponent: 0 });
  const [countdown, setCountdown] = useState(3);
  const [raceFinished, setRaceFinished] = useState(false);
  const animationRef = useRef<number | null>(null);

  const startRace = useCallback(() => {
    setGameState("race");
    setCountdown(3);
    setRaceProgress({ player: 0, opponent: 0 });
    setRaceFinished(false);

    // Countdown
    let count = 3;
    const countInterval = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count === 0) {
        clearInterval(countInterval);
        startRaceAnimation();
      }
    }, 1000);
  }, []);

  const startRaceAnimation = useCallback(() => {
    const isBYD = selectedCar === "byd";
    let playerPos = 0;
    let opponentPos = 0;
    const finishLine = 85;

    const animate = () => {
      // BYD is faster, Arona is slow
      const playerSpeed = isBYD ? 1.2 : 0.4;
      const opponentSpeed = isBYD ? 0.6 : 1.5;

      playerPos += playerSpeed;
      opponentPos += opponentSpeed;

      // Add some randomness
      playerPos += Math.random() * 0.3;
      opponentPos += Math.random() * 0.3;

      setRaceProgress({ player: playerPos, opponent: opponentPos });

      if (playerPos >= finishLine || opponentPos >= finishLine) {
        setRaceFinished(true);
        setTimeout(() => setGameState("result"), 1000);
        return;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [selectedCar]);

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const resetGame = () => {
    setGameState("menu");
    setSelectedChar(null);
    setSelectedCar(null);
    setRaceProgress({ player: 0, opponent: 0 });
    setRaceFinished(false);
  };

  // Character SVG components
  const NilsAvatar = () => (
    <svg viewBox="0 0 100 100" className="w-24 h-24 md:w-32 md:h-32">
      {/* Face */}
      <circle cx="50" cy="40" r="25" fill="#f5d0b0" />
      {/* Slick dark hair */}
      <path d="M25 35 Q30 10 50 8 Q70 10 75 35 Q75 25 65 20 Q50 15 35 20 Q25 25 25 35" fill="#1a1a2e" />
      <path d="M22 40 Q20 25 35 18 Q50 12 65 18 Q80 25 78 40" fill="#1a1a2e" />
      {/* Eyes */}
      <circle cx="42" cy="42" r="3" fill="#1a1a2e" />
      <circle cx="58" cy="42" r="3" fill="#1a1a2e" />
      {/* Smile */}
      <path d="M42 52 Q50 58 58 52" stroke="#1a1a2e" strokeWidth="2" fill="none" />
      {/* Body */}
      <rect x="30" y="65" width="40" height="30" rx="5" fill="#3b82f6" />
    </svg>
  );

  const KimAvatar = () => (
    <svg viewBox="0 0 100 100" className="w-24 h-24 md:w-32 md:h-32">
      {/* Face */}
      <circle cx="50" cy="40" r="25" fill="#f5d0b0" />
      {/* Brown hair */}
      <path d="M22 45 Q20 20 35 15 Q50 8 65 15 Q80 20 78 45 Q80 35 75 30 Q70 40 65 35 Q50 30 35 35 Q30 40 25 30 Q20 35 22 45" fill="#8B4513" />
      <circle cx="35" cy="25" r="8" fill="#8B4513" />
      <circle cx="65" cy="25" r="8" fill="#8B4513" />
      {/* Eyes */}
      <circle cx="42" cy="42" r="3" fill="#1a1a2e" />
      <circle cx="58" cy="42" r="3" fill="#1a1a2e" />
      {/* Smile */}
      <path d="M42 52 Q50 58 58 52" stroke="#1a1a2e" strokeWidth="2" fill="none" />
      {/* Body */}
      <rect x="30" y="65" width="40" height="30" rx="5" fill="#ec4899" />
    </svg>
  );

  const BYDCar = ({ className = "" }: { className?: string }) => (
    <svg viewBox="0 0 120 60" className={className}>
      {/* BYD Seal U DM-i - sleek electric blue */}
      <ellipse cx="60" cy="35" rx="55" ry="20" fill="#0066cc" />
      <path d="M10 35 Q30 15 60 15 Q90 15 110 35 L105 45 Q60 50 15 45 Z" fill="#0088ff" />
      {/* Windows */}
      <path d="M25 30 L45 22 L75 22 L95 30 L90 35 L30 35 Z" fill="#1a1a3e" />
      {/* Wheels */}
      <circle cx="30" cy="45" r="10" fill="#1a1a2e" />
      <circle cx="30" cy="45" r="5" fill="#silver" />
      <circle cx="90" cy="45" r="10" fill="#1a1a2e" />
      <circle cx="90" cy="45" r="5" fill="#silver" />
      {/* BYD Logo */}
      <rect x="52" y="28" width="16" height="8" rx="2" fill="#silver" />
      <text x="60" y="34" textAnchor="middle" fontSize="6" fill="#0066cc" fontWeight="bold">BYD</text>
      {/* Electric glow */}
      <ellipse cx="60" cy="50" rx="40" ry="5" fill="#00ffff" opacity="0.3" />
    </svg>
  );

  const AronaCar = ({ className = "" }: { className?: string }) => (
    <svg viewBox="0 0 120 60" className={className}>
      {/* Seat Arona - compact, ordinary */}
      <rect x="10" y="25" width="100" height="25" rx="8" fill="#666" />
      <path d="M15 35 Q25 20 50 18 Q80 16 105 35 L100 42 Q60 45 20 42 Z" fill="#888" />
      {/* Windows */}
      <path d="M20 32 L40 24 L70 23 L90 32 L85 36 L25 36 Z" fill="#2a2a4e" />
      {/* Wheels */}
      <circle cx="28" cy="48" r="9" fill="#1a1a2e" />
      <circle cx="28" cy="48" r="4" fill="#444" />
      <circle cx="92" cy="48" r="9" fill="#1a1a2e" />
      <circle cx="92" cy="48" r="4" fill="#444" />
      {/* SEAT text */}
      <text x="60" y="32" textAnchor="middle" fontSize="5" fill="#silver">SEAT</text>
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden touch-none">
      {/* MENU SCREEN */}
      {gameState === "menu" && (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-fadeIn">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            BYD Champion
          </h1>
          <p className="text-lg text-purple-200 mb-8 text-center">
            The Ultimate Driving Showdown
          </p>
          
          <div className="flex gap-4 mb-8">
            <div className="w-16 h-10"><BYDCar className="w-full h-full" /></div>
            <span className="text-2xl">VS</span>
            <div className="w-16 h-10"><AronaCar className="w-full h-full" /></div>
          </div>

          <button
            onClick={() => setGameState("character")}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full text-xl font-bold shadow-lg active:scale-95 transition-transform"
          >
            Start Race 🏁
          </button>
        </div>
      )}

      {/* CHARACTER SELECTION */}
      {gameState === "character" && (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Choose Your Driver
          </h2>
          
          <div className="flex flex-col md:flex-row gap-6">
            <button
              onClick={() => { setSelectedChar("nils"); setGameState("car-select"); }}
              className="flex flex-col items-center p-6 bg-white/10 rounded-2xl border-2 border-transparent hover:border-cyan-400 active:scale-95 transition-all"
            >
              <NilsAvatar />
              <span className="mt-4 text-xl font-bold">Nils</span>
              <span className="text-sm text-gray-400">Slick dark hair</span>
            </button>

            <button
              onClick={() => { setSelectedChar("kim"); setGameState("car-select"); }}
              className="flex flex-col items-center p-6 bg-white/10 rounded-2xl border-2 border-transparent hover:border-pink-400 active:scale-95 transition-all"
            >
              <KimAvatar />
              <span className="mt-4 text-xl font-bold">Kim</span>
              <span className="text-sm text-gray-400">Female, brown hair</span>
            </button>
          </div>
        </div>
      )}

      {/* CAR SELECTION */}
      {gameState === "car-select" && (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
            Choose Your Ride
          </h2>
          
          <div className="mb-6">
            {selectedChar === "nils" ? <NilsAvatar /> : <KimAvatar />}
            <p className="text-center mt-2">Walk to your car...</p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl">
            <button
              onClick={() => { setSelectedCar("byd"); startRace(); }}
              className="flex-1 p-6 bg-gradient-to-b from-blue-900/50 to-blue-600/30 rounded-2xl border-2 border-blue-400 hover:border-cyan-400 active:scale-95 transition-all"
            >
              <BYDCar className="w-full h-24 mb-4" />
              <span className="text-xl font-bold text-cyan-400">BYD Seal-U DM-i</span>
              <span className="block text-sm text-cyan-200">⚡ Electric Power</span>
              <span className="block text-xs text-gray-400 mt-2">The New Beast</span>
            </button>

            <button
              onClick={() => { setSelectedCar("arona"); startRace(); }}
              className="flex-1 p-6 bg-gradient-to-b from-gray-800/50 to-gray-600/30 rounded-2xl border-2 border-gray-500 hover:border-gray-400 active:scale-95 transition-all"
            >
              <AronaCar className="w-full h-24 mb-4" />
              <span className="text-xl font-bold text-gray-300">Seat Arona</span>
              <span className="block text-sm text-gray-400">🐌 The Old Days</span>
              <span className="block text-xs text-gray-500 mt-2">Good memories... slow speed</span>
            </button>
          </div>
        </div>
      )}

      {/* RACE SCREEN */}
      {gameState === "race" && (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h2 className="text-2xl font-bold mb-4">Race Time! 🏎️💨</h2>

          {/* Countdown */}
          {countdown > 0 && (
            <div className="text-6xl font-bold text-cyan-400 animate-pulse mb-4">
              {countdown === 0 ? "GO!" : countdown}
            </div>
          )}

          {/* Race Track */}
          <div className="w-full max-w-md h-64 bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl border-4 border-gray-600 relative overflow-hidden">
            {/* Track lines */}
            <div className="absolute top-1/3 w-full h-0.5 bg-gray-600" />
            <div className="absolute top-2/3 w-full h-0.5 bg-gray-600" />

            {/* Finish line */}
            <div className="absolute right-2 top-0 bottom-0 w-4 bg-gradient-to-b from-transparent via-white/50 to-transparent">
              <div className="h-full w-full" style={{
                background: "repeating-linear-gradient(0deg, black, black 10px, white 10px, white 20px)"
              }} />
            </div>

            {/* Player car */}
            <div
              className="absolute top-8 transition-all duration-100"
              style={{ left: `${Math.min(raceProgress.player, 85)}%` }}
            >
              <div className="flex flex-col items-center">
                {selectedChar === "nils" ? <NilsAvatar /> : <KimAvatar />}
                {selectedCar === "byd" ? (
                  <BYDCar className="w-20 h-10" />
                ) : (
                  <AronaCar className="w-20 h-10" />
                )}
              </div>
            </div>

            {/* Opponent car */}
            <div
              className="absolute bottom-8 transition-all duration-100"
              style={{ left: `${Math.min(raceProgress.opponent, 85)}%` }}
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-2xl">🤖</div>
                {selectedCar === "byd" ? (
                  <AronaCar className="w-20 h-10 opacity-70" /
                ) : (
                  <BYDCar className="w-20 h-10 opacity-70" /
                )}
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="mt-4 text-center">
            {raceFinished ? (
              <p className="text-xl">{selectedCar === "byd" ? "🏆 BYD Power!" : "😅 Maybe next time..."}</p>
            ) : (
              <p className="text-sm text-gray-400">{countdown === 0 ? "Racing..." : "Get ready!"}</p>
            )}
          </div>
        </div>
      )}

      {/* RESULT SCREEN */}
      {gameState === "result" && (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
          {selectedCar === "byd" ? (
            <>
              <div className="text-8xl mb-4">🏆🎉</div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Congratulations!
              </h2>
              <p className="text-xl text-cyan-300 mb-4">
                BYD Seal-U DM-i Dominates! ⚡
              </p>
              <div className="bg-white/10 rounded-2xl p-6 max-w-md mb-8">
                <p className="text-lg mb-2">🚗💨 The electric beast prevails!</p>
                <p className="text-gray-300">
                  {(selectedChar === "nils" ? "Nils" : "Kim") + " made the right choice. "}
                  The future is electric!
                </p>
              </div>
              <div className="flex gap-2 text-4xl mb-8">
                <span>⚡</span>
                <span>🚗</span>
                <span>💨</span>
                <span>🏁</span>
              </div>
            </>
          ) : (
            <>
              <div className="text-8xl mb-4">😅🐌</div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-300">
                Nice Try!
              </h2>
              <p className="text-xl text-gray-400 mb-4">
                The Arona has character... but not speed 😄
              </p>
              <div className="bg-white/10 rounded-2xl p-6 max-w-md mb-8">
                <p className="text-lg mb-2">🚗💭 Good memories though!</p>
                <p className="text-gray-300">
                  {(selectedChar === "nils" ? "Nils" : "Kim") + " learned a valuable lesson: "}
                  BYD > Arona in every race! 
                </p>
              </div>
              <p className="text-cyan-400 text-lg">Try again with the BYD! ⚡</p>
            </>
          )}

          <button
            onClick={resetGame}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full text-xl font-bold shadow-lg active:scale-95 transition-transform"
          >
            Race Again 🔄
          </button>
        </div>
      )}
    </div>
  );
}
