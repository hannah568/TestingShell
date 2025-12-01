
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameStatus, Difficulty } from '../types';
import { Cup } from './Cup';
import { Trophy, RefreshCcw, Settings, Play, Gamepad2, User, UserCheck, ChevronLeft, Gauge, Zap, Flame, Skull, TrendingUp, GripHorizontal, RotateCcw, Check, Pencil } from 'lucide-react';

// Utils
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// -- Visual Effects Components --

const EffectsStyles = () => (
  <style>{`
    @keyframes firework-expand {
      0% { transform: translate(0, 0) scale(0); opacity: 1; }
      50% { opacity: 1; }
      100% { transform: translate(var(--tx), var(--ty)) scale(1); opacity: 0; }
    }
    @keyframes bomb-flash {
      0% { background-color: rgba(255, 50, 50, 0.6); }
      100% { background-color: transparent; }
    }
    @keyframes fly-word {
      0% { transform: translate(-50%, -50%) scale(0.2) rotate(0deg); opacity: 0; }
      20% { opacity: 1; transform: translate(-50%, -50%) scale(1.5) rotate(var(--rot)); }
      100% { transform: translate(var(--endX), var(--endY)) scale(0.5) rotate(var(--endRot)); opacity: 0; }
    }
    @keyframes debris-spin {
      0% { transform: translate(0,0) rotate(0deg); opacity: 1; }
      100% { transform: translate(var(--dx), var(--dy)) rotate(720deg); opacity: 0; }
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
      20%, 40%, 60%, 80% { transform: translateX(8px); }
    }
    @keyframes float-up {
      0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
      20% { transform: translate(-50%, -150%) scale(1.2); opacity: 1; }
      100% { transform: translate(-50%, -250%) scale(1); opacity: 0; }
    }
    
    .animate-firework-particle {
      animation: firework-expand 1.2s cubic-bezier(0, 0, 0.2, 1) forwards;
    }
    .animate-bomb-flash {
      animation: bomb-flash 0.6s ease-out forwards;
    }
    .animate-fly-word {
      animation: fly-word 1.2s cubic-bezier(0.1, 0.8, 0.2, 1) forwards;
    }
    .animate-debris {
        animation: debris-spin 0.8s ease-out forwards;
    }
    .animate-shake {
      animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    }
    .animate-float-up {
      animation: float-up 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }
  `}</style>
);

const FireworksDisplay = () => {
  const bursts = [
    { id: 1, left: '20%', top: '30%', color: 'bg-yellow-400' },
    { id: 2, left: '50%', top: '20%', color: 'bg-cyan-400' },
    { id: 3, left: '80%', top: '30%', color: 'bg-purple-400' },
    { id: 4, left: '35%', top: '50%', color: 'bg-pink-400' },
    { id: 5, left: '65%', top: '50%', color: 'bg-green-400' },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden rounded-3xl">
      {bursts.map((burst, bIdx) => (
        <div key={burst.id} className="absolute" style={{ left: burst.left, top: burst.top }}>
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30) * (Math.PI / 180);
            const dist = 80 + Math.random() * 60;
            const tx = Math.cos(angle) * dist + 'px';
            const ty = Math.sin(angle) * dist + 'px';
            return (
              <div
                key={i}
                className={`absolute w-2 h-2 rounded-full ${burst.color} animate-firework-particle shadow-[0_0_10px_currentColor]`}
                style={{
                    // @ts-ignore
                    '--tx': tx, '--ty': ty,
                    animationDelay: `${bIdx * 0.1}s`
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

const BombLossEffect = () => {
    const words = ["WRONG", "NOPE", "MISS", "OUCH", "OOPS"];
    
    return (
        <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center rounded-3xl overflow-hidden animate-bomb-flash">
             <div className="absolute text-9xl scale-150 animate-ping opacity-50">💥</div>
             {words.map((word, i) => {
                 const angle = (i / words.length) * 360;
                 const rad = angle * (Math.PI / 180);
                 const endX = Math.cos(rad) * 600 + 'px'; 
                 const endY = Math.sin(rad) * 600 + 'px';
                 const rot = Math.random() * 60 - 30 + 'deg';
                 const endRot = Math.random() * 720 - 360 + 'deg'; 
                 
                 return (
                     <div 
                        key={i}
                        className="absolute text-4xl md:text-6xl font-black text-white bg-red-600 px-4 py-2 uppercase tracking-tighter drop-shadow-2xl animate-fly-word border-4 border-white rounded-lg shadow-lg"
                        style={{
                            // @ts-ignore
                            '--endX': endX, '--endY': endY, '--rot': rot, '--endRot': endRot,
                            left: '50%', top: '50%',
                            animationDelay: `${i * 0.05}s`
                        }}
                     >
                         {word}
                     </div>
                 )
             })}
             {Array.from({ length: 25 }).map((_, i) => {
                 const dx = (Math.random() - 0.5) * 1000 + 'px';
                 const dy = (Math.random() - 0.5) * 1000 + 'px';
                 return (
                     <div
                        key={`debris-${i}`}
                        className="absolute w-3 h-3 bg-slate-900 animate-debris rounded-sm"
                        style={{
                            left: '50%', top: '50%',
                            // @ts-ignore
                            '--dx': dx, '--dy': dy
                        }}
                     />
                 )
             })}
        </div>
    )
}

const StreakCounter = ({ count }: { count: number }) => (
  <div className="flex flex-col items-center bg-slate-900/80 border border-orange-500/30 px-4 py-2 rounded-xl shadow-lg min-w-[90px] backdrop-blur-sm">
    <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400 mb-1">Streak</span>
    <div className="flex items-center gap-2">
      <Flame className={`w-6 h-6 transition-all duration-500 ${count > 1 ? 'text-orange-500 animate-pulse scale-110' : 'text-slate-600'}`} fill={count > 1 ? "currentColor" : "none"} />
      <span className={`text-3xl font-black leading-none ${count > 0 ? 'text-white' : 'text-slate-600'}`}>{count}</span>
    </div>
  </div>
);


export const GameArea: React.FC = () => {
  // -- State --
  const [setupStep, setSetupStep] = useState<'PLAYERS' | 'NAMES' | 'DIFFICULTY' | 'GAME'>('PLAYERS');
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  
  // Game Configuration
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [isDynamic, setIsDynamic] = useState<boolean>(false);
  const [playerCount, setPlayerCount] = useState<number>(1);
  const [playerNames, setPlayerNames] = useState<string[]>(['Player 1']);
  const [numCups, setNumCups] = useState<number>(3); 
  
  // Gameplay State
  const [activePlayer, setActivePlayer] = useState<number>(0); 
  const [scores, setScores] = useState<number[]>([0, 0, 0, 0]);
  const [winningCupId, setWinningCupId] = useState<number>(1);
  
  // Dynamic Arrays based on numCups
  const [cupSlots, setCupSlots] = useState<number[]>([0, 1, 2]); 
  const [revealedCups, setRevealedCups] = useState<boolean[]>([false, false, false]);
  const [cupDepths, setCupDepths] = useState<number[]>([0, 0, 0, 0, 0]); // Stores depth state for 3D shuffle effect
  
  // Animation Control
  const [moveDuration, setMoveDuration] = useState<number>(500);
  
  const [message, setMessage] = useState("Find the hidden ball!");
  const [guessId, setGuessId] = useState<number | null>(null);
  
  // Auto Play / Restart State
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [isRestarting, setIsRestarting] = useState<boolean>(false);

  // Floating Text Feedback State
  const [floatingTexts, setFloatingTexts] = useState<Array<{id: number, text: string, left: number, color: string}>>([]);

  // -- Refs --
  // Use a ref to track cup slots synchronously for animations to avoid closure staleness during restarts
  const cupSlotsRef = useRef(cupSlots);

  useEffect(() => {
    cupSlotsRef.current = cupSlots;
  }, [cupSlots]);

  // -- Config based on difficulty --
  const getDifficultySettings = useCallback((diff: Difficulty) => {
    switch (diff) {
      case Difficulty.EASY: return { swaps: 5, speed: 600, label: "Easy", icon: Gauge, color: "text-green-400", border: "border-green-500/50", bg: "hover:bg-green-500/10", ring: "ring-green-500/20" };
      case Difficulty.MEDIUM: return { swaps: 10, speed: 450, label: "Medium", icon: Zap, color: "text-yellow-400", border: "border-yellow-500/50", bg: "hover:bg-yellow-500/10", ring: "ring-yellow-500/20" };
      case Difficulty.HARD: return { swaps: 15, speed: 320, label: "Hard", icon: Flame, color: "text-orange-400", border: "border-orange-500/50", bg: "hover:bg-orange-500/10", ring: "ring-orange-500/20" };
      case Difficulty.EXTREME: return { swaps: 25, speed: 220, label: "Extreme", icon: Skull, color: "text-red-500", border: "border-red-500/50", bg: "hover:bg-red-500/10", ring: "ring-red-500/20" };
    }
  }, []);

  const getCurrentDifficulty = useCallback(() => {
    if (!isDynamic) return difficulty;
    const currentScore = scores[activePlayer];
    if (currentScore < 2) return Difficulty.EASY;
    if (currentScore < 5) return Difficulty.MEDIUM;
    if (currentScore < 8) return Difficulty.HARD;
    return Difficulty.EXTREME;
  }, [difficulty, isDynamic, scores, activePlayer]);

  const resetRound = useCallback((nextPlayerIndex?: number) => {
    setMoveDuration(500); // Standard speed for resetting positions
    setRevealedCups(new Array(numCups).fill(false));
    setGuessId(null);
    setCupSlots(Array.from({length: numCups}, (_, i) => i));
    setCupDepths(new Array(numCups).fill(0)); // Reset depths to flat

    const newWinner = Math.floor(Math.random() * numCups);
    setWinningCupId(newWinner);
    
    const newRevealed = new Array(numCups).fill(false);
    newRevealed[newWinner] = true;
    setRevealedCups(newRevealed);
    
    setStatus(GameStatus.IDLE);
    
    if (typeof nextPlayerIndex === 'number') {
      setActivePlayer(nextPlayerIndex);
      setMessage(`${playerNames[nextPlayerIndex]}: Memorize position!`);
    } else {
      setMessage("Memorize the position...");
    }
  }, [numCups, playerNames]);

  // -- Actions --

  const handleSelectPlayers = (count: number) => {
    setPlayerCount(count);
    setPlayerNames(Array.from({length: count}, (_, i) => `Player ${i+1}`));
    setScores(new Array(count).fill(0));
    setActivePlayer(0);
    setSetupStep('NAMES');
  };

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleNamesSubmit = () => {
    setSetupStep('DIFFICULTY');
  };

  const handleSelectDifficulty = (diff: Difficulty | 'DYNAMIC') => {
    if (diff === 'DYNAMIC') {
      setIsDynamic(true);
      setDifficulty(Difficulty.EASY); 
    } else {
      setIsDynamic(false);
      setDifficulty(diff);
    }
  };

  const handleStartGame = () => {
    setSetupStep('GAME');
  };

  useEffect(() => {
    if (setupStep === 'GAME') {
      resetRound(0);
    }
  }, [setupStep, resetRound]);

  const addFloatingText = (text: string, left: number, color: string) => {
    const id = Date.now() + Math.random();
    setFloatingTexts(prev => [...prev, { id, text, left, color }]);
    setTimeout(() => {
        setFloatingTexts(prev => prev.filter(ft => ft.id !== id));
    }, 800);
  };

  const handleStartShuffle = useCallback(async () => {
    if (status === GameStatus.SHUFFLING) return;

    setRevealedCups(new Array(numCups).fill(false));
    setStatus(GameStatus.SHUFFLING);
    
    const currentDiff = getCurrentDifficulty();
    const { swaps, speed, label } = getDifficultySettings(currentDiff);

    const transitionDuration = Math.floor(speed * 0.9);
    setMoveDuration(transitionDuration);
    
    setMessage(playerCount > 1 
      ? `${playerNames[activePlayer]} (${label}): Shuffling...` 
      : `Shuffling (${label})...`);
    
    await sleep(500);

    // Safety: Ensure cupSlots matches numCups before starting loop
    if (cupSlotsRef.current.length !== numCups) {
         const resetSlots = Array.from({length: numCups}, (_, i) => i);
         setCupSlots(resetSlots);
         cupSlotsRef.current = resetSlots;
    }

    // Use ref to get the most up-to-date slots (important after restarts/resets)
    let currentSlots = [...cupSlotsRef.current];
    
    for (let i = 0; i < swaps; i++) {
      let slotA = 0, slotB = 0;
      
      // Fair shuffle: pick 2 distinct slots
      slotA = Math.floor(Math.random() * numCups);
      do {
          slotB = Math.floor(Math.random() * numCups);
      } while (slotB === slotA);

      const cupIndexA = currentSlots.findIndex(visualSlot => visualSlot === slotA);
      const cupIndexB = currentSlots.findIndex(visualSlot => visualSlot === slotB);

      // Safety check to prevent crashes if state is out of sync
      if (cupIndexA === -1 || cupIndexB === -1) {
         console.warn("Shuffle index error - skipping swap", { slotA, slotB, currentSlots });
         continue; 
      }

      // 3D DEPTH EFFECT
      // Randomly decide which cup passes "in front"
      const isFrontA = Math.random() > 0.5;
      
      const newDepths = new Array(numCups).fill(0);
      newDepths[cupIndexA] = isFrontA ? 1 : -1;
      newDepths[cupIndexB] = isFrontA ? -1 : 1;
      setCupDepths(newDepths);

      currentSlots[cupIndexA] = slotB;
      currentSlots[cupIndexB] = slotA;

      setCupSlots([...currentSlots]); 
      
      await sleep(speed);
    }

    // Reset depths after shuffling is done
    setCupDepths(new Array(numCups).fill(0));

    setStatus(GameStatus.GUESSING);
    setMessage(playerCount > 1 ? `${playerNames[activePlayer]}: Where is the ball?` : "Where is the ball?");
  }, [status, playerCount, activePlayer, getCurrentDifficulty, getDifficultySettings, numCups, playerNames]);

  // Effect for Auto-Replay (Correct Guess)
  useEffect(() => {
    if (isAutoPlaying) {
      let cancelled = false;
      const runAutoSequence = async () => {
        await sleep(1200); 
        if (cancelled) return;
        resetRound(); 
        await sleep(1000);
        if (cancelled) return;
        handleStartShuffle();
        setIsAutoPlaying(false);
      };
      runAutoSequence();
      return () => { cancelled = true; };
    }
  }, [isAutoPlaying, resetRound, handleStartShuffle]);

  // Effect for Auto-Restart (Game Over Retry)
  useEffect(() => {
    if (isRestarting) {
      let cancelled = false;
      const runRestartSequence = async () => {
        resetRound(0);
        await sleep(1000); // Allow time for reset animation
        if (cancelled) return;
        handleStartShuffle();
        setIsRestarting(false);
      };
      runRestartSequence();
      return () => { cancelled = true; };
    }
  }, [isRestarting, resetRound, handleStartShuffle]);


  const handleCupClick = (id: number) => {
    if (status !== GameStatus.GUESSING) return;

    // Calculate position for feedback text
    const visualSlot = cupSlots[id];
    const leftPos = 10 + (visualSlot * (80 / (numCups - 1)));

    setGuessId(id);
    const isWin = id === winningCupId;

    const newRevealed = [...revealedCups];
    newRevealed[id] = true;
    if (!isWin) {
      newRevealed[winningCupId] = true;
    }
    setRevealedCups(newRevealed);
    setStatus(GameStatus.REVEALED);

    if (isWin) {
      // Floating Text for Win
      addFloatingText(playerCount > 1 ? "+1 Point" : "+1 Streak", leftPos, "text-yellow-400");
      
      setScores(prev => {
        const newScores = [...prev];
        newScores[activePlayer] += 1;
        return newScores;
      });

      let winMsg = playerCount > 1 ? `${playerNames[activePlayer]} Wins! 🎉` : "Correct! 🎉";
      
      if (isDynamic) {
        const newScore = scores[activePlayer] + 1;
        if (newScore === 2) winMsg += " (Level Up: Medium!)";
        if (newScore === 5) winMsg += " (Level Up: Hard!)";
        if (newScore === 8) winMsg += " (Level Up: EXTREME!)";
        
        // Floating Text for Level Up
        if (newScore === 2 || newScore === 5 || newScore === 8) {
             setTimeout(() => addFloatingText("LEVEL UP!", 50, "text-cyan-400"), 200);
        }
      }
      setMessage(winMsg);
      setIsAutoPlaying(true);
    } else {
      // Floating Text for Miss
      addFloatingText("MISS", leftPos, "text-red-500");

      setIsAutoPlaying(false); 
      if (playerCount === 1) {
          setMessage(`Game Over!`);
      } else {
          setMessage("Missed it! Next Player.");
      }
    }
  };

  const handleNextTurn = () => {
    const nextPlayer = (activePlayer + 1) % playerCount;
    resetRound(nextPlayer);
  };

  const handleRestartGame = () => {
    setSetupStep('PLAYERS');
    setScores([0,0,0,0]);
    setPlayerCount(1);
    setPlayerNames(['Player 1']);
    setNumCups(3);
    setActivePlayer(0);
    setDifficulty(Difficulty.EASY);
    setIsDynamic(false);
    setStatus(GameStatus.IDLE);
    setIsAutoPlaying(false);
    setIsRestarting(false);
    setCupDepths([0,0,0,0,0]);
    setFloatingTexts([]);
  };

  const handleRetry = () => {
    setScores(scores.map(() => 0)); 
    setIsAutoPlaying(false);
    setIsRestarting(true);
  };

  const isRoundOver = status === GameStatus.REVEALED;
  const isWinner = isRoundOver && guessId === winningCupId;
  const isLoser = isRoundOver && guessId !== null && guessId !== winningCupId;

  // ... Setup Steps Rendering ...

  if (setupStep === 'PLAYERS') {
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[500px] animate-in slide-in-from-right-8 duration-500">
        <div className="bg-slate-800/80 p-8 md:p-12 rounded-3xl border border-white/10 backdrop-blur-md text-center shadow-2xl max-w-3xl w-full mx-4 relative">
          <div className="w-20 h-20 bg-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-cyan-400">
             <UserCheck size={40} />
          </div>
          <h2 className="text-3xl font-bold mb-3">How many players?</h2>
          <p className="text-slate-400 mb-8">Select the number of participants for this session.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(count => (
              <button
                key={count}
                onClick={() => handleSelectPlayers(count)}
                className="group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-700/50 border border-slate-600 hover:border-cyan-400 hover:bg-slate-700 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
              >
                <div className="mb-2">
                   {count === 1 && <User size={32} className="text-cyan-400" />}
                   {count === 2 && <div className="flex -space-x-3"><User size={28} className="text-cyan-400" /><User size={28} className="text-blue-400" /></div>}
                   {count === 3 && <div className="flex -space-x-4"><User size={28} className="text-cyan-400" /><User size={28} className="text-blue-400" /><User size={28} className="text-purple-400" /></div>}
                   {count === 4 && <div className="flex -space-x-5"><User size={28} className="text-cyan-400" /><User size={28} className="text-blue-400" /><User size={28} className="text-purple-400" /><User size={28} className="text-pink-400" /></div>}
                </div>
                <span className="font-bold text-lg">{count} Player{count > 1 ? 's' : ''}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (setupStep === 'NAMES') {
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[500px] animate-in slide-in-from-right-8 duration-500">
        <div className="bg-slate-800/80 p-8 md:p-12 rounded-3xl border border-white/10 backdrop-blur-md text-center shadow-2xl max-w-xl w-full mx-4 relative">
          <button onClick={() => setSetupStep('PLAYERS')} className="absolute top-6 left-6 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"><ChevronLeft size={24} /></button>
          <div className="w-20 h-20 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-400"><Pencil size={32} /></div>
          <h2 className="text-3xl font-bold mb-3">Enter Names</h2>
          <p className="text-slate-400 mb-8">Who is playing today?</p>
          <div className="flex flex-col gap-4 mb-8">
            {playerNames.map((name, i) => (
              <div key={i} className="flex items-center gap-4 bg-slate-900/50 p-2 pr-4 rounded-xl border border-white/5">
                 <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-slate-300 font-bold shrink-0">P{i+1}</div>
                 <input type="text" value={name} onChange={(e) => handleNameChange(i, e.target.value)} className="bg-transparent border-none outline-none text-white font-semibold w-full placeholder-slate-500 focus:ring-0" placeholder={`Enter name for Player ${i+1}`} maxLength={12} />
              </div>
            ))}
          </div>
          <button onClick={handleNamesSubmit} className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"><span>Next Step</span><ChevronLeft className="rotate-180" size={20} /></button>
        </div>
      </div>
    );
  }

  if (setupStep === 'DIFFICULTY') {
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[500px] animate-in slide-in-from-right-8 duration-500">
        <div className="bg-slate-800/80 p-8 md:p-12 rounded-3xl border border-white/10 backdrop-blur-md text-center shadow-2xl max-w-4xl w-full mx-4 relative">
          <button onClick={() => setSetupStep('NAMES')} className="absolute top-6 left-6 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"><ChevronLeft size={24} /></button>
          <div className="w-20 h-20 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-purple-400"><Settings size={40} /></div>
          <h2 className="text-3xl font-bold mb-3">Game Settings</h2>
          <p className="text-slate-400 mb-6">Customize your experience.</p>
          <div className="flex flex-col gap-6 w-full">
            <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                <h3 className="text-sm text-slate-400 uppercase font-bold tracking-wider mb-3 text-left">Number of Cups</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[3, 4, 5].map((n) => (
                    <button key={n} onClick={() => setNumCups(n)} className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all duration-200 ${numCups === n ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'bg-slate-700/30 border-transparent hover:bg-slate-700 text-slate-300'}`}><GripHorizontal size={20} /><span className="font-bold">{n} Cups</span></button>
                  ))}
                </div>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
              <h3 className="text-sm text-slate-400 uppercase font-bold tracking-wider mb-3 text-left">Difficulty Mode</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid grid-cols-2 gap-3">
                  {[Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD, Difficulty.EXTREME].map((diff) => {
                    const settings = getDifficultySettings(diff);
                    const Icon = settings.icon;
                    const isSelected = !isDynamic && difficulty === diff;
                    return (
                      <button key={diff} onClick={() => handleSelectDifficulty(diff)} className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 group relative overflow-hidden ${isSelected ? `${settings.bg} border-${settings.color.split('-')[1]}-500 ring-2 ${settings.ring} bg-slate-700` : 'border-slate-600/50 bg-slate-700/30 hover:border-slate-500'}`}>
                        <Icon className={`w-6 h-6 mb-1 ${isSelected ? settings.color : 'text-slate-400 group-hover:text-slate-200'}`} />
                        <span className={`text-sm font-semibold ${isSelected ? settings.color : 'text-slate-400 group-hover:text-slate-200'}`}>{settings.label}</span>
                        {isSelected && (<div className={`absolute top-2 right-2 w-4 h-4 rounded-full ${settings.bg.replace('hover:', '')} flex items-center justify-center`}><Check size={10} className={settings.color} /></div>)}
                      </button>
                    );
                  })}
                </div>
                <button onClick={() => handleSelectDifficulty('DYNAMIC')} className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 relative overflow-hidden group ${isDynamic ? 'border-cyan-500 ring-2 ring-cyan-500/20 bg-gradient-to-br from-slate-700/80 to-cyan-900/40' : 'border-cyan-500/30 bg-gradient-to-br from-slate-700/50 to-cyan-900/20 hover:border-cyan-400'}`}>
                  <TrendingUp className={`w-8 h-8 mb-2 ${isDynamic ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-400'}`} />
                  <h3 className={`text-lg font-bold leading-tight ${isDynamic ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>Adaptive Mode</h3>
                  <p className="text-xs text-slate-300 text-center mt-1">Starts Easy, gets harder as you win.</p>
                  {isDynamic && (<div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center"><Check size={12} className="text-black" /></div>)}
                </button>
              </div>
            </div>
            <button onClick={handleStartGame} className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xl rounded-2xl shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"><Play fill="currentColor" />START GAME</button>
          </div>
        </div>
      </div>
    );
  }

  // GAME
  const currentDiffSettings = getDifficultySettings(getCurrentDifficulty());

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center animate-in fade-in duration-700">
      <EffectsStyles />
      
      <div className="w-full flex flex-col md:flex-row items-center justify-between bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-white/5 mb-8 gap-4 shadow-lg relative z-10">
        {playerCount === 1 ? (
           <StreakCounter count={scores[0]} />
        ) : (
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center border border-slate-600 shrink-0"><Trophy className="text-yellow-400 w-6 h-6" /></div>
             <div className="flex-1">
               <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Scoreboard</div>
               <div className="flex flex-wrap gap-x-4 gap-y-1 text-lg font-bold max-w-[300px]">
                    {scores.map((s, i) => (
                      <span key={i} className={`${activePlayer === i ? 'text-cyan-400' : 'text-slate-500'} transition-colors truncate max-w-[150px]`}>{playerNames[i]}: {s}</span>
                    ))}
               </div>
             </div>
           </div>
        )}

        <div className={`bg-slate-900/50 px-6 py-2 rounded-full border text-center min-w-[200px] transition-colors duration-300 ${isLoser ? 'border-red-500/50 bg-red-900/20' : isWinner ? 'border-yellow-500/50 bg-yellow-900/20' : 'border-white/5'}`}>
          <span className={`font-medium ${status === GameStatus.GUESSING ? 'animate-pulse text-cyan-300' : isLoser ? 'text-red-400' : isWinner ? 'text-yellow-400' : 'text-slate-300'}`}>
            {message}
          </span>
        </div>

        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border bg-slate-900/50 ${currentDiffSettings.border}`}>
           <currentDiffSettings.icon className={`w-5 h-5 ${currentDiffSettings.color}`} />
           <div className="flex flex-col">
             <span className={`text-xs font-bold uppercase ${currentDiffSettings.color}`}>{currentDiffSettings.label}</span>
             <span className="text-[10px] text-slate-400 leading-none">{isDynamic ? 'Adaptive' : 'Fixed'} • {numCups} Cups</span>
           </div>
        </div>
      </div>

      <div className={`relative w-full h-[300px] md:h-[400px] bg-slate-800/30 rounded-3xl border-b-8 border-slate-700 shadow-inner flex justify-center perspective-800 overflow-hidden group ${isLoser ? 'animate-shake' : ''}`}>
         {isWinner && <FireworksDisplay />}
         {isLoser && <BombLossEffect />}
         <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black to-transparent pointer-events-none"></div>
         
         <div className="relative w-full max-w-3xl h-full flex items-end pb-12 preserve-3d mx-auto z-20">
            {cupSlots.map((slotIndex, i) => (
              <Cup
                key={i}
                id={i}
                slotIndex={slotIndex}
                hasBall={i === winningCupId}
                isLifted={revealedCups[i]}
                isCorrect={status === GameStatus.REVEALED && i === winningCupId}
                isWrong={status === GameStatus.REVEALED && i === guessId && i !== winningCupId}
                onClick={() => handleCupClick(i)}
                disabled={status !== GameStatus.GUESSING}
                totalSlots={numCups}
                transitionDuration={moveDuration}
                depth={cupDepths[i]} // Pass depth property
              />
            ))}
            
            {/* Floating Feedback Text Layer */}
            {floatingTexts.map(ft => (
              <div
                  key={ft.id}
                  className={`absolute top-1/2 -translate-x-1/2 pointer-events-none z-50 text-3xl md:text-5xl font-black drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] animate-float-up ${ft.color}`}
                  style={{ left: `${ft.left}%` }}
              >
                  {ft.text}
              </div>
            ))}
         </div>
      </div>

      <div className="mt-8 flex gap-4 min-h-[64px] z-20">
        {status === GameStatus.IDLE && !isAutoPlaying && !isRestarting && (
          <button onClick={handleStartShuffle} className="flex items-center gap-2 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95"><Play size={24} fill="currentColor" />START SHUFFLE</button>
        )}

        {status === GameStatus.REVEALED && !isAutoPlaying && !isRestarting && (
           playerCount > 1 ? (
            <button onClick={handleNextTurn} className="flex items-center gap-2 px-8 py-4 bg-purple-500 hover:bg-purple-400 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all hover:scale-105 active:scale-95 animate-bounce"><Gamepad2 size={24} />NEXT PLAYER</button>
           ) : (
             isLoser ? (
                <button onClick={handleRetry} className="flex items-center gap-2 px-8 py-4 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 transition-all hover:scale-105 active:scale-95 animate-pulse"><RotateCcw size={24} />RESTART</button>
             ) : (
                <button onClick={() => resetRound()} className="flex items-center gap-2 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95"><RefreshCcw size={24} />CONTINUE</button>
             )
           )
        )}
        
        {(isAutoPlaying || isRestarting) && (
          <div className="flex items-center gap-3 px-8 py-4 bg-cyan-950/60 text-cyan-300 rounded-xl border border-cyan-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.15)] animate-pulse">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
            <span className="font-bold tracking-widest text-sm uppercase">
                {isRestarting ? "Restarting Game..." : "Next Round Starting..."}
            </span>
          </div>
        )}

        {status !== GameStatus.SHUFFLING && !isAutoPlaying && !isRestarting && (
          <button onClick={handleRestartGame} className="flex items-center gap-2 px-4 py-4 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold rounded-xl transition-colors" title="Reset Game Settings"><Settings size={20} /></button>
        )}
      </div>

      {playerCount > 1 && status !== GameStatus.IDLE && (
         <div className="mt-4 px-4 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-sm z-10">
           Current Turn: <span className="text-white font-bold">{playerNames[activePlayer]}</span>
         </div>
      )}

    </div>
  );
};
