import React from 'react';
import { GameArea } from './components/GameArea';

function App() {
  return (
    <div className="min-h-screen w-full bg-[#001f3f] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-[#001f3f] to-slate-950 flex flex-col relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <header className="w-full py-8 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-cyan-300 drop-shadow-sm">
          Shell Game Master
        </h1>
        <p className="mt-2 text-slate-400 text-sm md:text-base max-w-md mx-auto px-4">
          Keep your eye on the cup with the golden ball. Don't lose focus!
        </p>
      </header>

      <main className="flex-grow flex items-center justify-center p-4 relative z-10">
        <GameArea />
      </main>

      <footer className="w-full py-6 text-center text-slate-600 text-xs relative z-10">
        <p>&copy; {new Date().getFullYear()} Shell Game Master. Built with React & Tailwind.</p>
      </footer>
    </div>
  );
}

export default App;