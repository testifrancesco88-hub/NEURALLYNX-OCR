
import React, { useState } from 'react';
import { ExtractionResult } from '../types';

interface ResultCardProps {
  result: ExtractionResult;
  onRemove: (id: string) => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, onRemove }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.extractedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([result.extractedText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${result.fileName.split('.')[0]}_neural_extraction.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-50 transition-all group border-b-4 border-b-slate-200 hover:border-b-blue-500">
      <div className="md:flex h-full min-h-[350px]">
        {/* Sinistra: Anteprima Immagine */}
        <div className="md:w-1/3 bg-slate-50 relative group-hover:bg-blue-50/30 transition-colors flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r-2 border-slate-100">
          <img 
            src={result.imageUrl} 
            alt={result.fileName} 
            className="w-full h-full object-contain p-6 max-h-[350px] mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
          />
          <button 
            onClick={() => onRemove(result.id)}
            className="absolute top-4 left-4 p-2 bg-white/90 backdrop-blur-sm rounded-xl text-slate-400 hover:text-red-600 hover:bg-white transition-all opacity-0 group-hover:opacity-100 shadow-sm border border-slate-200"
            title="Scollega Sorgente"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
          
          {/* Overlay tech */}
          <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur px-3 py-1 rounded-lg border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Source Authenticated</span>
          </div>
        </div>

        {/* Destra: Output Testo */}
        <div className="md:w-2/3 flex flex-col h-full bg-white">
          <div className="p-6 border-b-2 border-slate-50 flex justify-between items-center bg-slate-50/30">
            <div className="flex flex-col">
              <span className="text-xs font-black text-slate-900 uppercase tracking-tighter truncate max-w-[220px]">{result.fileName}</span>
              <span className="text-[9px] text-blue-500 uppercase tracking-[0.3em] font-black mt-0.5">Synthesis Output</span>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleCopy}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${copied ? 'bg-green-500 text-white shadow-lg shadow-green-100' : 'bg-white border-2 border-slate-100 text-slate-500 hover:border-blue-400 hover:text-blue-600 shadow-sm'}`}
              >
                {copied ? (
                  <><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Synced</>
                ) : (
                  <><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg> Copy</>
                )}
              </button>
              <button 
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                Export
              </button>
            </div>
          </div>
          
          <div className="p-8 flex-1 overflow-y-auto max-h-[450px] relative">
            {result.status === 'processing' ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-6">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-2 border-2 border-slate-100 border-b-cyan-400 rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
                </div>
                <div className="flex flex-col items-center gap-2">
                   <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.5em] animate-pulse">Analisi Neurale in Corso</p>
                   <div className="h-0.5 w-32 bg-slate-100 overflow-hidden rounded-full">
                      <div className="h-full bg-blue-600 w-1/2 animate-[shimmer_1.5s_infinite] origin-left"></div>
                   </div>
                </div>
              </div>
            ) : result.status === 'error' ? (
              <div className="bg-red-50 border-2 border-red-100 text-red-700 p-6 rounded-[1.5rem] flex items-start gap-4 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                <div className="text-xs">
                  <p className="font-black uppercase tracking-widest mb-1">Critical Failure</p>
                  <p className="opacity-80 font-medium">{result.errorMessage || 'Unknown Protocol Error'}</p>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600/50 via-transparent to-blue-600/50 rounded-full"></div>
                <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed selection:bg-blue-600 selection:text-white pl-2">
                  {result.extractedText}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
