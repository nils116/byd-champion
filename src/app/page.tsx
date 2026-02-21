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
    const sizeClass = size === "sm" ? "w-10 h-10" : size === "lg" ? "w-24 h-24" : "w-16 h-16";
    return (
      <svg viewBox="0 0 100 100" className={sizeClass}>
        <circle cx="50" cy="40" r="25" fill="#f5d0b0" />
        <path d="M25 35 Q30 10 50 8 Q70 10 75 35 Q75 25 65 20 Q50 15 35 20 Q25 25 25 35" fill="#1a1a2e" />
        <path d="M22 40 Q20 25 35 18 Q50 12 65 18 Q80 25 78 40" fill="#1a1a2e" />
        <circle cx="42" cy="42" r="3" fill="#1a1a2e" />
        <circle cx="58" cy="42" r="3" fill="#1a1a2e" />
        <path d="M42 52 Q50 58 58 52" stroke="#1a1a2e" strokeWidth="2" fill="none" />
        <rect x="30" y="65" width="40" height="30" rx="5" fill="#007AFF" />
      </svg>
    );
  };

  const KimAvatar = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
    const sizeClass = size === "sm" ? "w-10 h-10" : size === "lg" ? "w-24 h-24" : "w-16 h-16";
    return (
      <svg viewBox="0 0 100 100" className={sizeClass}>
        <circle cx="50" cy="40" r="25" fill="#f5d0b0" />
        <path d="M22 45 Q20 20 35 15 Q50 8 65 15 Q80 20 78 45 Q80 35 75 30 Q70 40 65 35 Q50 30 35 35 Q30 40 25 30 Q20 35 22 45" fill="#8B4513" />
        <circle cx="35" cy="25" r="8" fill="#8B4513" />
        <circle cx="65" cy="25" r="8" fill="#8B4513" />
        <circle cx="42" cy="42" r="3" fill="#1a1a2e" />
        <circle cx="58" cy="42" r="3" fill="#1a1a2e" />
        <path d="M42 52 Q50 58 58 52" stroke="#1a1a2e" strokeWidth="2" fill="none" />
        <rect x="30" y="65" width="40" height="30" rx="5" fill="#FF2D55" />
      </svg>
    );
  };

  const BYDCar = ({ className = "" }: { className?: string }) => (
    <svg viewBox="0 0 120 60" className={className}>
      <ellipse cx="60" cy="35" rx="55" ry="20" fill="#007AFF" />
      <path d="M10 35 Q30 15 60 15 Q90 15 110 35 L105 45 Q60 50 15 45 Z" fill="#34C759" />
      <path d="M25 30 L45 22 L75 22 L95 30 L90 35 L30 35 Z" fill="#1C1C1E" />
      <circle cx="30" cy="45" r="10" fill="#1C1C1E" />
      <circle cx="30" cy="45" r="5" fill="#C7C7CC" />
      <circle cx="90" cy="45" r="10" fill="#1C1C1E" />
      <circle cx="90" cy="45" r="5" fill="#C7C7CC" />
      <rect x="52" y="28" width="16" height="8" rx="2" fill="#FFFFFF" />
      <text x="60" y="34" textAnchor="middle" fontSize="6" fill="#007AFF" fontWeight="bold">BYD</text>
    </svg>
  );

  const AronaCar = ({ className = "" }: { className?: string }) => (
    <svg viewBox="0 0 120 60" className={className}>
      <rect x="10" y="25" width="100" height="25" rx="8" fill="#8E8E93" />
      <path d="M15 35 Q25 20 50 18 Q80 16 105 35 L100 42 Q60 45 20 42 Z" fill="#AEAEB2" />
      <path d="M20 32 L40 24 L70 23 L90 32 L85 36 L25 36 Z" fill="#1C1C1E" />
      <circle cx="28" cy="48" r="9" fill="#1C1C1E" />
      <circle cx="28" cy="48" r="4" fill="#636366" />
      <circle cx="92" cy="48" r="9" fill="#1C1C1E" />
      <circle cx="92" cy="48" r="4" fill="#636366" />
      <text x="60" y="32" textAnchor="middle" fontSize="5" fill="#FFFFFF">SEAT</text>
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#F2F2F7] text-[#000000] font-sans">
      {/* MENU SCREEN */}
      {gameState === "menu" && (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm">
            <h1 className="text-[34px] font-semibold text-center mb-1">BYD</h1>
            <p className="text-center text-[#636366] text-[13px] tracking-wide uppercase mb-8">Champion</p>
            
            <div className="flex items-center justify-center gap-4 mb-8 py-4 bg-[#F2F2F7] rounded-xl">
              <div className="w-16 h-10"><BYDCar className="w-full h-full" /></div>
              <span className="text-[#8E8E93] font-semibold text-[15px]">VS</span>
              <div className="w-16 h-10"><AronaCar className="w-full h-full" /></div>
            </div>

            <button
              onClick={() => setGameState("character")}
              className="w-full h-11 bg-[#007AFF] text-white text-[17px] font-semibold rounded-xl active:opacity-80 transition-opacity"
            >
              Start Race
            </button>
          </div>
        </div>
      )}

      {/* CHARACTER SELECTION */}
      {gameState === "character" && (
        <div className="flex flex-col min-h-screen bg-[#F2F2F7]">
          <div className="bg-white px-4 pt-12 pb-4 border-b border-[#C6C6C8]">
            <h2 className="text-[17px] font-semibold text-center">Choose Driver</h2>
          </div>
          
          <div className="flex-1 flex flex-col gap-3 p-4">
            <button
              onClick={() => { setSelectedChar("nils"); setGameState("car-select"); }}
              className="flex items-center gap-4 p-4 bg-white rounded-xl active:bg-[#F2F2F7] transition-colors"
            >
              <NilsAvatar size="lg" />
              <div className="flex-1 text-left">
                <span className="text-[17px] font-semibold block">Nils</span>
                <span className="text-[15px] text-[#8E8E93]">Player 1</span>
              </div>
              <svg className="w-6 h-6 text-[#C7C7CC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => { setSelectedChar("kim"); setGameState("car-select"); }}
              className="flex items-center gap-4 p-4 bg-white rounded-xl active:bg-[#F2F2F7] transition-colors"
            >
              <KimAvatar size="lg" />
              <div className="flex-1 text-left">
                <span className="text-[17px] font-semibold block">Kim</span>
                <span className="text-[15px] text-[#8E8E93]">Player 2</span>
              </div>
              <svg className="w-6 h-6 text-[#C7C7CC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* CAR SELECTION */}
      {gameState === "car-select" && (
        <div className="flex flex-col min-h-screen bg-[#F2F2F7]">
          <div className="bg-white px-4 pt-12 pb-4 border-b border-[#C6C6C8]">
            <button 
              onClick={() => setGameState("character")}
              className="absolute left-4 top-12 text-[#007AFF] text-[17px]"
            >
              Back
            </button>
            <h2 className="text-[17px] font-semibold text-center">Choose Car</h2>
          </div>
          
          <div className="p-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              {selectedChar === "nils" ? <NilsAvatar size="sm" /> : <KimAvatar size="sm" />}
              <span className="text-[15px] text-[#8E8E93]">selects their ride</span>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => { setSelectedCar("byd"); startRace(); }}
                className="p-4 bg-white rounded-xl active:opacity-80 transition-opacity"
              >
                <div className="flex items-center gap-4">
                  <BYDCar className="w-20 h-10 flex-shrink-0" />
                  <div className="flex-1 text-left">
                    <span className="block text-[17px] font-semibold text-[#000000]">BYD Seal-U DM-i</span>
                    <span className="text-[13px] text-[#34C759]">Electric • Fast</span>
                  </div>
                </div>
              </button>

              <button
                onClick={() => { setSelectedCar("arona"); startRace(); }}
                className="p-4 bg-white rounded-xl active:opacity-80 transition-opacity"
              >
                <div className="flex items-center gap-4">
                  <AronaCar className="w-20 h-10 flex-shrink-0" />
                  <div className="flex-1 text-left">
                    <span className="block text-[17px] font-semibold text-[#000000]">Seat Arona</span>
                    <span className="text-[13px] text-[#8E8E93]">Gas • Reliable</span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RACE SCREEN */}
      {gameState === "race" && (
        <div className="flex flex-col min-h-screen bg-[#F2F2F7]">
          <div className="bg-white px-4 pt-12 pb-4 border-b border-[#C6C6C8]">
            <h2 className="text-[17px] font-semibold text-center">Race</h2>
          </div>

          <div className="p-4 flex-1 flex flex-col">
            {countdown > 0 && (
              <div className="text-[64px] font-semibold text-center text-[#007AFF] mb-4">
                {countdown}
              </div>
            )}

            <div className="bg-white rounded-2xl p-4 flex-1 relative overflow-hidden">
              {/* Track */}
              <div className="absolute inset-x-4 top-1/3 h-px bg-[#C6C6C8]" />
              <div className="absolute inset-x-4 top-2/3 h-px bg-[#C6C6C8]" />
              
              {/* Finish line */}
              <div className="absolute right-4 top-4 bottom-4 w-3">
                <div className="h-full" style={{background: "repeating-linear-gradient(0deg, #000, #000 6px, #fff 6px, #fff 12px)"}} />
              </div>

              {/* Player */}
              <div
                className="absolute top-6 transition-all duration-100"
                style={{ left: `${Math.min(raceProgress.player, 75)}%` }}
              >
                <div className="flex flex-col items-center">
                  {selectedChar === "nils" ? <NilsAvatar size="sm" /> : <KimAvatar size="sm" />}
                  {selectedCar === "byd" ? (
                    <BYDCar className="w-14 h-7" />
                  ) : (
                    <AronaCar className="w-14 h-7" />
                  )}
                </div>
              </div>

              {/* Opponent */}
              <div
                className="absolute bottom-6 transition-all duration-100"
                style={{ left: `${Math.min(raceProgress.opponent, 75)}%` }}
              >
                <div className="flex flex-col items-center opacity-50">
                  <span className="text-xl">🤖</span>
                  {selectedCar === "byd" ? (
                    <AronaCar className="w-14 h-7" />
                  ) : (
                    <BYDCar className="w-14 h-7" />
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-[13px] text-[#8E8E93]">
                {raceFinished 
                  ? (selectedCar === "byd" ? "BYD wins!" : "Better luck next time...")
                  : (countdown === 0 ? "Racing..." : "Get ready")
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* RESULT SCREEN */}
      {gameState === "result" && (
        <div className="flex flex-col min-h-screen bg-[#F2F2F7]">
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center">
              {selectedCar === "byd" ? (
                <>
                  <div className="text-5xl mb-4">🏆</div>
                  <h2 className="text-[28px] font-semibold mb-2">Victory!</h2>
                  <p className="text-[17px] text-[#34C759] mb-6">BYD Seal-U DM-i wins</p>
                  <div className="bg-[#F2F2F7] rounded-xl p-4 mb-6">
                    <p className="text-[15px] text-[#3C3C43]">
                      {selectedChar === "nils" ? "Nils" : "Kim"} chose wisely.
                    </p>
                    <p className="text-[13px] text-[#8E8E93] mt-1">The future is electric.</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-5xl mb-4">😅</div>
                  <h2 className="text-[28px] font-semibold mb-2 text-[#3C3C43]">Nice Try</h2>
                  <p className="text-[17px] text-[#8E8E93] mb-6">The Arona has heart</p>
                  <div className="bg-[#F2F2F7] rounded-xl p-4 mb-6">
                    <p className="text-[15px] text-[#3C3C43]">
                      {selectedChar === "nils" ? "Nils" : "Kim"} learned something today.
                    </p>
                    <p className="text-[13px] text-[#8E8E93] mt-1">Try the BYD next time.</p>
                  </div>
                </>
              )}

              <button
                onClick={resetGame}
                className="w-full h-11 bg-[#007AFF] text-white text-[17px] font-semibold rounded-xl active:opacity-80 transition-opacity"
              >
                Race Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
