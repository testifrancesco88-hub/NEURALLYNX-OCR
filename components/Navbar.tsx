
import React from 'react';

const Navbar: React.FC = () => {
  // Exclusively check process.env.API_KEY for configuration status as per hard requirements.
  const active = !!process.env.API_KEY && process.env.API_KEY !== "undefined";

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 to-cyan-300 opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 9a3 3 0 0 1 3 3" strokeWidth="1" strokeOpacity="0.5"/>
              </svg>
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tighter ml-1 uppercase">
              NEURA<span className="text-blue-600">LYNX</span>
            </span>
          </div>
          
          <div className="flex items-center gap-4">
             <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${active ? 'bg-slate-900 border-slate-800' : 'bg-red-50 border-red-100'}`}>
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${active ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]'}`}></div>
                <span className={`text-[9px] font-black uppercase tracking-widest ${active ? 'text-blue-400' : 'text-red-500'}`}>
                  {active ? 'Neural Link Active' : 'Config Required'}
                </span>
             </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
