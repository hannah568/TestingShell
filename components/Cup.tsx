import React from 'react';
import { CupProps } from '../types';

export const Cup: React.FC<CupProps> = ({
  id,
  slotIndex,
  hasBall,
  isLifted,
  isCorrect,
  isWrong,
  onClick,
  disabled,
  totalSlots,
  transitionDuration = 300,
  depth = 0,
}) => {
  // Dynamic positioning calculation
  const leftPosition = 10 + (slotIndex * (80 / (totalSlots - 1)));

  // Dynamic sizing based on cup count
  const getSizeClasses = () => {
    if (totalSlots >= 5) return "w-16 h-24 md:w-24 md:h-32";
    if (totalSlots === 4) return "w-20 h-28 md:w-28 md:h-36";
    return "w-24 h-32 md:w-32 md:h-40"; // Default 3 cups
  };

  // Dynamic Ball Sizing
  const getBallClasses = () => {
    if (totalSlots >= 5) return "w-6 h-6 md:w-8 md:h-8 bottom-1.5";
    return "bottom-2 w-8 h-8 md:w-10 md:h-10";
  };

  // 3D Depth Calculation
  const getDepthConfig = () => {
    switch (depth) {
        case 1: // Front (Closer)
            return { 
                scale: 1.25, 
                yOffset: 40, // More pronounced drop for 'front' pass
                zIndex: 40, 
                brightness: 1.15,
                shadowScale: 1.25,
                shadowOpacity: 0.8
            };
        case -1: // Back (Farther)
            return { 
                scale: 0.8, 
                yOffset: -30, // More pronounced rise for 'back' pass
                zIndex: 10, 
                brightness: 0.65,
                shadowScale: 0.6,
                shadowOpacity: 0.3
            };
        default: // Standard
            return { 
                scale: 1, 
                yOffset: 0, 
                zIndex: 30, 
                brightness: 1,
                shadowScale: 1,
                shadowOpacity: 0.6
            };
    }
  };

  const { scale, yOffset, zIndex, brightness, shadowScale, shadowOpacity } = getDepthConfig();

  // Logic to show ball: 
  // If the cup has the ball, we render it fully opaque. 
  // We rely on the Cup Body (zIndex 20) to physically cover the Ball (zIndex 15) when not lifted.
  const showBall = hasBall;

  return (
    <div
      className={`absolute bottom-10 ${getSizeClasses()} origin-bottom`}
      style={{
        // We combine the horizontal slide with 3D depth transforms
        // Using translate3d for hardware acceleration
        transform: `translateX(-50%) translate3d(0, ${yOffset}px, 0) scale(${scale})`,
        left: `${leftPosition}%`,
        zIndex: zIndex,
        // Smooth transitions for all movement properties
        transitionProperty: 'left, transform, filter',
        transitionDuration: `${transitionDuration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.45, 0, 0.55, 1)', // Slightly smoother ease-in-out
        filter: `brightness(${brightness}) drop-shadow(0 10px 15px rgba(0,0,0,${depth === 1 ? 0.5 : 0.2}))`
      }}
    >
      {/* Container for the ball and cup */}
      <div className="relative w-full h-full flex justify-center items-end">
        
        {/* Shadow on the floor - Scales with depth */}
        <div 
            className="absolute bottom-0 w-[80%] h-4 bg-black rounded-[100%] blur-md transition-all duration-300 ease-out" 
            style={{ 
                opacity: isLifted ? 0.2 : shadowOpacity,
                transform: `scale(${shadowScale})`,
                backgroundColor: 'rgba(0,0,0,0.6)'
            }} 
        />

        {/* The Ball - Positioned absolute at the bottom center */}
        <div 
            className={`absolute rounded-full bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.3),0_5px_10px_rgba(0,0,0,0.5)] transform transition-all duration-500 ${getBallClasses()} ${
              showBall ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
            }`}
            style={{ zIndex: 15 }} // Below the cup body
        />

        {/* The Cup Body */}
        <div
          onClick={!disabled ? onClick : undefined}
          className={`
            absolute bottom-0 w-full h-full flex flex-col items-center justify-end
            transition-transform duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)
            ${!disabled ? 'cursor-pointer hover:-translate-y-2 active:scale-95' : 'cursor-default'}
          `}
          style={{
            // Lifting animation (separate from shuffle movement)
            transform: isLifted ? 'translateY(-90px) rotate(-20deg)' : 'translateY(0px)',
            zIndex: 20
          }}
        >
          {/* Cup shape constructed with CSS */}
          <div className={`
             relative w-full h-full rounded-b-2xl rounded-t-sm
             bg-gradient-to-br from-red-500 via-red-700 to-red-950
             shadow-[inset_0_-4px_10px_rgba(0,0,0,0.5),inset_4px_0_6px_rgba(255,255,255,0.1)]
             overflow-hidden border-b-4 
             ${isCorrect ? 'border-green-500 ring-4 ring-green-400 shadow-[0_0_30px_rgba(74,222,128,0.5)]' : isWrong ? 'border-red-500 ring-4 ring-red-400' : 'border-red-950/50'}
          `}>
             {/* Glossy Sheen (Reflection) */}
             <div className="absolute top-0 -left-[20%] w-[140%] h-full bg-gradient-to-tr from-white/10 via-white/5 to-transparent skew-x-12 pointer-events-none z-10"></div>
             <div className="absolute top-2 right-2 w-[40%] h-[90%] bg-gradient-to-b from-white/10 to-transparent rounded-full blur-sm pointer-events-none z-10"></div>

             {/* White Rim */}
             <div className="absolute top-0 w-full h-4 bg-slate-200 border-b border-slate-400 z-20 shadow-sm bg-gradient-to-r from-slate-300 via-white to-slate-300"></div>

             {/* Grip Lines (Ridges) */}
             <div className="absolute top-[40%] left-0 w-full flex flex-col gap-3 opacity-30 pointer-events-none mix-blend-multiply">
                <div className="w-full h-[2px] bg-black shadow-[0_1px_0_rgba(255,255,255,0.2)]"></div>
                <div className="w-full h-[2px] bg-black shadow-[0_1px_0_rgba(255,255,255,0.2)]"></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};