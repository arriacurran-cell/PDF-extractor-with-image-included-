import React from 'react';
import { FileText, Github, Cpu } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="bg-brand-600 p-2 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Latexify.ai</h1>
              <p className="text-xs text-slate-500 hidden sm:block">PDF to LaTeX Converter</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              <Cpu className="h-4 w-4" />
              <span>Powered by Gemini 3.0 Pro</span>
            </div>
            <a 
              href="#" 
              className="text-slate-500 hover:text-slate-900 transition-colors"
              title="View on GitHub"
            >
              <Github className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};