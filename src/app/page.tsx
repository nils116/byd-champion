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
      const playerSpeed = isBYD ? 1.2 : 0.4;
      const opponentSpeed = isBYD ? 0.6 : 1.5;

      playerPos += playerSpeed;
      opponentPos += opponentSpeed;
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

  const NilsAvatar = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
    const sizeClass = size === "sm" ? "w-12 h-12" : size === "lg" ? "w-28 h-28" : "w-20 h-20";
    return (
      <svg viewBox="0 0 100 100" className={sizeClass}>
        <circle cx="50" cy="40" r="25" fill="#f5d0b0" />
        <path d="M25 35 Q30 10 50 8 Q70 10 75 35 Q75 25 65 20 Q50 15 35 20 Q25 25 25 35" fill="#1a1a2e" />
        <path d="M22 40 Q20 25 35 18 Q50 12 65 18 Q80 25 78 40" fill="#1a1a2e" />
        <circle cx="42" cy="42" r="3" fill="#1a1a2e" />
        <circle cx="58" cy="42" r="3" fill="#1a1a2e" />
        <path d="M42 52 Q50 58 58 52" stroke="#1a1a2e" strokeWidth="2" fill="none" />
        <rect x="30" y="65" width="40" height="30" rx="5" fill="#3b82f6" />
      </svg>
    );
  };

  const KimAvatar = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
    const sizeClass = size === "sm" ? "w-12 h-12" : size === "lg" ? "w-28 h-28" : "w-20 h-20";
    return (
      <svg viewBox="0 0 100 100" className={sizeClass}>
        <circle cx="50" cy="40" r="25" fill="#f5d0b0" />
        <path d="M22 45 Q20 20 35 15 Q50 8 65 15 Q80 20 78 45 Q80 35 75 30 Q70 40 65 35 Q50 30 35 35 Q30 40 25 30 Q20 35 22 45" fill="#8B4513" />
        <circle cx="35" cy="25" r="8" fill="#8B4513" />
        <circle cx="65" cy="25" r="8" fill="#8B4513" />
        <circle cx="42" cy="42" r="3" fill="#1a1a2e" />
        <circle cx="58" cy="42" r="3" fill="#1a1a2e" />
        <path d="M42 52 Q50 58 58 52" stroke="#1a1a2e" strokeWidth="2" fill="none" />
        <rect x="30" y="65" width="40" height="30" rx="5" fill="#ec4899" />
      </svg>
    );
  };

  const BYDCar = ({ className = "" }: { className?: string }) => (
    <svg viewBox="0 0 120 60" className={className}>
      <ellipse cx="60" cy="35" rx="55" ry="20" fill="#0066cc" />
      <path d="M10 35 Q30 15 60 15 Q90 15 110 35 L105 45 Q60 50 15 45 Z" fill="#0088ff" />
      <path d="M25 30 L45 22 L75 22 L95 30 L90 35 L30 35 Z" fill="#1a1a3e" />
      <circle cx="30" cy="45" r="10" fill="#1a1a2e" />
      <circle cx="30" cy="45" r="5" fill="#silver" />
      <circle cx="90" cy="45" r="10" fill="#1a1a2e" />
      <circle cx="90" cy="45" r="5" fill="#silver" />
      <rect x="52" y="28" width="16" height="8" rx="2" fill="#silver" />
      <text x="60" y="34" textAnchor="middle" fontSize="6" fill="#0066cc" fontWeight="bold">BYD</text>
      <ellipse cx="60" cy="50" rx="40" ry="5" fill="#00ffff" opacity="0.3" />
    </svg>
  );

  const AronaCar = ({ className = "" }: { className?: string }) => (
    <svg viewBox="0 0 120 60" className={className}>
      <rect x="10" y="25" width="100" height="25" rx="8" fill="#666" />
      <path d="M15 35 Q25 20 50 18 Q80 16 105 35 L100 42 Q60 45 20 42 Z" fill="#888" />
      <path d="M20 32 L40 24 L70 23 L90 32 L85 36 L25 36 Z" fill="#2a2a4e" />
      <circle cx="28" cy="48" r="9" fill="#1a1a2e" />
      <circle cx="28" cy="48" r="4" fill="#444" />
      <circle cx="92" cy="48" r="9" fill="#1a1a2e" />
      <circle cx="92" cy="48" r="4" fill="#444" />
      <text x="60" y="32" textAnchor="middle" fontSize="5" fill="#silver">SEAT</text>
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-white overflow-hidden">
      {/* MENU SCREEN */}
      {gameState === "menu" && (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl max-w-md w-full">
            <h1 className="text-5xl md:text-6xl font-black text-center mb-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              BYD
            </h1>
            <p className="text-center text-gray-400 text-sm tracking-widest uppercase mb-8">Champion</p>
            
            <div className="flex items-center justify-center gap-4 mb-8 py-4">
              <div className="w-20 h-12"><BYDCar className="w-full h-full" /></div>
              <span className="text-gray-500 font-bold">VS</span>
              <div className="w-20 h-12"><AronaCar className="w-full h-full" /></div>
            </div>

            <button
              onClick={() => setGameState("character")}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-lg font-bold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 active:scale-98 transition-all"
            >
              Start Race 🏁
            </button>
          </div>
        </div>
      )}

      {/* CHARACTER SELECTION */}
      {gameState === "character" && (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl max-w-md w-full">
            <h2 className="text-2xl font-bold mb-8 text-center">Choose Driver</h2>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => { setSelectedChar("nils"); setGameState("car-select"); }}
                className="flex-1 flex flex-col items-center p-6 bg-gradient-to-b from-white/10 to-transparent rounded-2xl border border-white/10 hover:border-cyan-400/50 hover:bg-white/5 active:scale-98 transition-all"
              >
                <NilsAvatar size="lg" />
                <span className="mt-4 text-lg font-semibold">Nils</span>
              </button>

              <button
                onClick={() => { setSelectedChar("kim"); setGameState("car-select"); }}
                className="flex-1 flex flex-col items-center p-6 bg-gradient-to-b from-white/10 to-transparent rounded-2xl border border-white/10 hover:border-pink-400/50 hover:bg-white/5 active:scale-98 transition-all"
              >
                <KimAvatar size="lg" />
                <span className="mt-4 text-lg font-semibold">Kim</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CAR SELECTION */}
      {gameState === "car-select" && (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl max-w-lg w-full">
            <div className="flex items-center justify-center gap-3 mb-6">
              {selectedChar === "nils" ? <NilsAvatar size="sm" /> : <KimAvatar size="sm" />}
              <span className="text-gray-400">picks their ride</span>
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => { setSelectedCar("byd"); startRace(); }}
                className="p-5 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-2xl border border-blue-400/30 hover:border-cyan-400 hover:bg-cyan-500/10 active:scale-98 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <BYDCar className="w-24 h-12 flex-shrink-0" />
                  <div className="text-left">
                    <span className="block text-lg font-bold text-cyan-300 group-hover:text-cyan-200">BYD Seal-U DM-i</span>
                    <span className="text-sm text-cyan-400/70">⚡ Electric beast</span>
                  </div>
                </div>
              </button>

              <button
                onClick={() => { setSelectedCar("arona"); startRace(); }}
                className="p-5 bg-gradient-to-r from-gray-700/20 to-gray-600/20 rounded-2xl border border-gray-500/30 hover:border-gray-400 hover:bg-gray-500/10 active:scale-98 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <AronaCar className="w-24 h-12 flex-shrink-0" />
                  <div className="text-left">
                    <span className="block text-lg font-bold text-gray-300 group-hover:text-gray-200">Seat Arona</span>
                    <span className="text-sm text-gray-500">🐌 Good memories...</span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RACE SCREEN */}
      {gameState === "race" && (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4 text-center">Race Time! 🏎️</h2>

            {countdown > 0 && (
              <div className="text-6xl font-black text-center text-cyan-400 mb-4 animate-pulse">
                {countdown}
              </div>
            )}

            <div className="relative h-48 bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
              <div className="absolute top-1/3 w-full h-px bg-gray-700" />
              <div className="absolute top-2/3 w-full h-px bg-gray-700" />
              
              <div className="absolute right-2 top-0 bottom-0 w-3">
                <div className="h-full" style={{background: "repeating-linear-gradient(0deg, #333, #333 8px, #fff 8px, #fff 16px)"}} />
              </div>

              <div
                className="absolute top-4 transition-all duration-100"
                style={{ left: `${Math.min(raceProgress.player, 82)}%` }}
              >
                <div className="flex flex-col items-center">
                  {selectedChar === "nils" ? <NilsAvatar size="sm" /> : <KimAvatar size="sm" />}
                  {selectedCar === "byd" ? (
                    <BYDCar className="w-16 h-8" />
                  ) : (
                    <AronaCar className="w-16 h-8" />
                  )}
                </div>
              </div>

              <div
                className="absolute bottom-4 transition-all duration-100"
                style={{ left: `${Math.min(raceProgress.opponent, 82)}%` }}
              >
                <div className="flex flex-col items-center opacity-60">
                  <span className="text-lg">🤖</span>
                  {selectedCar === "byd" ? (
                    <AronaCar className="w-16 h-8" />
                  ) : (
                    <BYDCar className="w-16 h-8" />
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 text-center text-sm text-gray-400">
              {raceFinished ? (
                <span className={selectedCar === "byd" ? "text-cyan-400 font-bold" : "text-gray-400"}>
                  {selectedCar === "byd" ? "🏆 BYD Power!" : "😅 Maybe next time..."}
                </span>
              ) : (
                countdown === 0 ? "Racing..." : "Get ready!"
              )}
            </div>
          </div>
        </div>
      )}

      {/* RESULT SCREEN */}
      {gameState === "result" && (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl max-w-md w-full text-center">
            {selectedCar === "byd" ? (
              <>
                <div className="text-6xl mb-4">🏆</div>
                <h2 className="text-3xl font-black mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Victory!
                </h2>
                <p className="text-cyan-300 mb-6">BYD Seal-U DM-i dominates! ⚡</p>
                <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl p-6 mb-6">
                  <p className="text-gray-300">
                    {selectedChar === "nils" ? "Nils" : "Kim"} chose wisely.
                  </p>
                  <p className="text-sm text-gray-400 mt-2">The future is electric.</p>
                </div>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">😅</div>
                <h2 className="text-3xl font-bold mb-2 text-gray-300">
                  Good Try!
                </h2>
                <p className="text-gray-400 mb-6">The Arona has heart... but not speed 🐌</p>
                <div className="bg-gray-700/30 rounded-2xl p-6 mb-6">
                  <p className="text-gray-300">
                    {selectedChar === "nils" ? "Nils" : "Kim"} learned something today.
                  </p>
                  <p className="text-sm text-gray-500 mt-2">Try the BYD next time! ⚡</p>
                </div>
              </>
            )}

            <button
              onClick={resetGame}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-lg font-bold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 active:scale-98 transition-all"
            >
              Race Again ↻
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
