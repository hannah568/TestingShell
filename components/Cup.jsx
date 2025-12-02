
import React from 'react';

export const Cup = ({
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
                yOffset: 20, 
                zIndex: 40, 
                brightness: 1.15,
                shadowScale: 1.2,
                shadowOpacity: 0.8
            };
        case -1: // Back (Farther)
            return { 
                scale: 0.85, 
                yOffset: -20, 
                zIndex: 10, 
                brightness: 0.7,
                shadowScale: 0.7,
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
  const showBall = hasBall;

  return (
    <div
      className={`absolute top-1/2 ${getSizeClasses()}`}
      style={{
        // Combine centering transform (-50%, -50%) with shuffle offset and 3D scale
        transform: `translate(-50%, -50%) translate3d(0, ${yOffset}px, 0) scale(${scale})`,
        left: `${leftPosition}%`,
        zIndex: zIndex,
        transitionProperty: 'left, transform, filter',
        transitionDuration: `${transitionDuration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.45, 0, 0.55, 1)', 
        filter: `brightness(${brightness}) drop-shadow(0 15px 25px rgba(0,0,0,${depth === 1 ? 0.4 : 0.2}))`
      }}
    >
      {/* Container for the ball and cup */}
      <div className="relative w-full h-full flex justify-center items-end">
        
        {/* Shadow on the floor */}
        <div 
            className="absolute bottom-0 w-[80%] h-4 bg-black rounded-[100%] blur-md transition-all duration-300 ease-out" 
            style={{ 
                opacity: isLifted ? 0.2 : shadowOpacity,
                transform: `scale(${shadowScale})`,
                backgroundColor: 'rgba(0,0,0,0.5)'
            }} 
        />

        {/* The Ball */}
        <div 
            className={`absolute rounded-full bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.3),0_5px_10px_rgba(0,0,0,0.5)] transform transition-all duration-500 ${getBallClasses()} ${
              showBall ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
            }`}
            style={{ zIndex: 15 }} 
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
            transform: isLifted ? 'translateY(-90px) rotate(-20deg)' : 'translateY(0px)',
            zIndex: 20
          }}
        >
          {/* Cup shape */}
          <div className={`
             relative w-full h-full rounded-b-[2rem] rounded-t-sm
             bg-gradient-to-b from-red-500 via-red-600 to-red-900
             shadow-[inset_0_-8px_12px_rgba(0,0,0,0.4),inset_4px_0_8px_rgba(255,255,255,0.15)]
             overflow-hidden border-b-4 
             ${isCorrect ? 'border-green-500 ring-4 ring-green-400 shadow-[0_0_30px_rgba(74,222,128,0.6)]' : isWrong ? 'border-red-500 ring-4 ring-red-400' : 'border-red-950/40'}
          `}>
             
             {/* Base Glow (Subsurface scattering fake) */}
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-red-400/20 blur-xl pointer-events-none"></div>

             {/* Texture: Horizontal Ridges (Middle Section) */}
             {/* Uses repeating gradient to create distinct plastic ridges */}
             <div 
                className="absolute top-[30%] bottom-[20%] w-full opacity-10 pointer-events-none mix-blend-multiply"
                style={{ 
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 12px, #000 12px, #000 14px)' 
                }}
             ></div>
             
             {/* Texture Highlight overlay for ridges */}
             <div 
                className="absolute top-[30%] bottom-[20%] w-full opacity-20 pointer-events-none mix-blend-overlay"
                style={{ 
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 12px, #fff 12px, #fff 13px)' 
                }}
             ></div>

             {/* Main Vertical Sheen (Glossy Reflection) */}
             <div className="absolute top-0 left-[20%] w-[12%] h-full bg-gradient-to-r from-transparent via-white/50 to-transparent blur-[2px] skew-x-[-8deg] pointer-events-none z-10"></div>
             
             {/* Secondary Edge Reflection */}
             <div className="absolute top-0 right-[12%] w-[4%] h-[80%] bg-gradient-to-r from-transparent via-white/20 to-transparent blur-md skew-x-[-8deg] pointer-events-none z-10"></div>

             {/* Rolled White Rim */}
             <div className="absolute top-0 w-full h-5 bg-gradient-to-b from-slate-100 via-slate-200 to-slate-300 z-20 shadow-md border-b border-slate-400/30"></div>
             
             {/* Rim Top Highlight */}
             <div className="absolute top-0 left-0 w-full h-[1px] bg-white/90 z-30"></div>

          </div>
        </div>
      </div>
    </div>
  );
};
