
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 to-cyan-300 opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10">
                {/* Struttura Occhio */}
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                {/* Iride/Lente */}
                <circle cx="12" cy="12" r="3"/>
                {/* Raggio di Scansione */}
                <line x1="12" y1="12" x2="18" y2="6" strokeWidth="1" strokeOpacity="0.8"/>
                {/* Frammenti di Testo/Dati in uscita */}
                <path d="M19 8h2M18 10h3M19 12h2" strokeWidth="1" strokeOpacity="0.6"/>
                {/* Riflesso tech */}
                <path d="M12 9a3 3 0 0 1 3 3" strokeWidth="1" strokeOpacity="0.5"/>
              </svg>
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tighter ml-1 uppercase">
              NEURA<span className="text-blue-600">LYNX</span>
            </span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#" className="text-slate-500 hover:text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] transition-colors">Neural Core</a>
            <a href="#" className="text-slate-500 hover:text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] transition-colors">Network</a>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded-full border border-slate-800 shadow-inner">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Active Link</span>
             </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
