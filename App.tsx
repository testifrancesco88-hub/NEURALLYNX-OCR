
import React, { useState, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Navbar from './components/Navbar';
import ResultCard from './components/ResultCard';
import { ExtractionResult } from './types';
import { extractTextFromImage } from './services/geminiService';

const App: React.FC = () => {
  const [results, setResults] = useState<ExtractionResult[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Sorgente non valida. Richiesto stream immagine.');
      return;
    }

    const id = uuidv4();
    const imageUrl = URL.createObjectURL(file);
    
    const newResult: ExtractionResult = {
      id,
      imageUrl,
      extractedText: '',
      fileName: file.name,
      status: 'processing',
      timestamp: Date.now()
    };

    setResults(prev => [newResult, ...prev]);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        try {
          const text = await extractTextFromImage(base64String, file.type);
          setResults(prev => prev.map(r => 
            r.id === id ? { ...r, status: 'completed', extractedText: text } : r
          ));
        } catch (err: any) {
          setResults(prev => prev.map(r => 
            r.id === id ? { ...r, status: 'error', errorMessage: err.message } : r
          ));
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setResults(prev => prev.map(r => 
        r.id === id ? { ...r, status: 'error', errorMessage: 'BUFFER_READ_FAILURE: Impossibile decodificare sorgente' } : r
      ));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(processFile);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files) {
      Array.from(files).forEach(processFile);
    }
  };

  const removeResult = (id: string) => {
    setResults(prev => prev.filter(r => r.id !== id));
  };

  const clearAll = () => {
    if (window.confirm('Eseguire PURGE completo del sistema?')) {
      setResults([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-100 selection:text-blue-900">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-950 text-blue-400 text-[10px] font-black rounded-full mb-8 tracking-[0.3em] uppercase border border-blue-900 shadow-[0_0_15px_rgba(30,58,138,0.5)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Neural Vision Interface v4.2
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter mb-8 uppercase italic">
            Visual <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-400 drop-shadow-sm">Decoding</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed tracking-tight">
            Attiva il sensore neurale per convertire immagini in flussi di dati testuali. Neuralynx mappa l'informazione visiva con algoritmi di estrazione a bassa latenza.
          </p>
        </div>

        {/* Upload Zone */}
        <div 
          className={`relative group bg-white border-2 border-dashed rounded-[3rem] p-16 transition-all duration-700 ${
            isDragging ? 'border-blue-500 bg-blue-50/20 scale-[1.03] shadow-[0_0_40px_rgba(37,99,235,0.15)]' : 'border-slate-200 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-50'
          }`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/0 via-transparent to-cyan-50/0 group-hover:from-blue-50/40 group-hover:to-cyan-50/40 transition-all rounded-[3rem] -z-10"></div>
          
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="hidden"
          />
          
          <div className="flex flex-col items-center text-center">
            <div className={`mb-10 p-8 rounded-[2.5rem] transition-all duration-1000 relative group-hover:scale-110 ${
              isDragging ? 'bg-blue-600 text-white shadow-blue-400 shadow-[0_0_30px_rgba(37,99,235,0.5)] rotate-[360deg]' : 'bg-slate-900 text-blue-400'
            }`}>
              {/* Icona Occhio Scanner */}
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 5v2M12 17v2M5 12H3M21 12h-2"/>
                <path d="m17 7-1.5 1.5M8.5 15.5 7 17M17 17l-1.5-1.5M8.5 8.5 7 7"/>
              </svg>
              {!isDragging && (
                <div className="absolute -inset-2 border-2 border-blue-500/20 rounded-[2.8rem] animate-[spin_10s_linear_infinite]"></div>
              )}
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-3 uppercase tracking-tighter italic">
              {isDragging ? 'Analisi Biometrica...' : 'Iniezione Sorgente'}
            </h3>
            <p className="text-slate-400 mb-10 max-w-sm font-bold text-xs tracking-[0.2em] uppercase">
              Carica immagini per avviare il processo di decodifica OCR.
            </p>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-14 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-slate-900 hover:shadow-blue-200 transition-all shadow-[0_10px_25px_rgba(37,99,235,0.3)] active:scale-95"
            >
              Initialize Scan
            </button>
          </div>
        </div>

        {/* Results List */}
        {results.length > 0 && (
          <div className="mt-24">
            <div className="flex justify-between items-end mb-12 border-b-2 border-slate-100 pb-8">
              <div>
                <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">Synthesis <span className="text-blue-600">Feed</span></h2>
                <div className="flex items-center gap-3 mt-2">
                   <div className="h-0.5 w-16 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.8)]"></div>
                   <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.4em]">Decoded Output Stream</p>
                </div>
              </div>
              <button 
                onClick={clearAll}
                className="text-[9px] font-black text-slate-400 hover:text-red-600 transition-all flex items-center gap-2 px-5 py-2.5 border-2 border-slate-100 hover:border-red-100 hover:bg-red-50 rounded-2xl tracking-[0.2em] uppercase"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                System Wipe
              </button>
            </div>

            <div className="grid gap-12">
              {results.map((result) => (
                <ResultCard 
                  key={result.id} 
                  result={result} 
                  onRemove={removeResult} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {results.length === 0 && (
          <div className="mt-32 py-12 flex flex-col items-center opacity-30 grayscale pointer-events-none">
             <div className="relative p-10 border-2 border-slate-200 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 8v4l3 3"/>
                </svg>
                <div className="absolute inset-0 border-2 border-dashed border-blue-400 rounded-full animate-[spin_30s_linear_infinite] opacity-50"></div>
                <div className="absolute inset-4 border border-blue-200 rounded-full animate-[spin_15s_linear_infinite_reverse] opacity-30"></div>
             </div>
             <p className="text-slate-500 font-black mt-10 tracking-[0.6em] uppercase text-[9px]">Neural Silence</p>
          </div>
        )}
      </main>

      {/* Floating Action (Mobile) */}
      <div className="md:hidden fixed bottom-10 right-10 z-40">
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center w-20 h-20 bg-blue-600 text-white rounded-[2rem] shadow-[0_15px_30px_rgba(37,99,235,0.4)] active:scale-90 transition-transform border-4 border-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        </button>
      </div>

      <footer className="bg-white border-t border-slate-100 py-24 mt-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-4 mb-10">
             <div className="bg-slate-900 p-2.5 rounded-2xl shadow-xl shadow-blue-50 border border-slate-800">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
             </div>
             <span className="font-black text-slate-900 uppercase tracking-tighter text-3xl italic">NEURALYNX <span className="text-blue-600 font-bold">AI</span></span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 mb-10 opacity-60">
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Quantum Extraction</span>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Neural Vision v4.0</span>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Decentralized Compute</span>
          </div>
          <p className="text-slate-300 text-[10px] font-black tracking-[0.2em] uppercase">
            &copy; {new Date().getFullYear()} NEURALYNX SYSTEMS // BUILT ON GEMINI FLASH NEURAL CORE
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
