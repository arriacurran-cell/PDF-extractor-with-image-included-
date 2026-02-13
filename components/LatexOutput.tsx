import React from 'react';
import { Copy, Download, Check, AlertTriangle } from 'lucide-react';
import { copyToClipboard, downloadLatex } from '../utils/helpers';

interface LatexOutputProps {
  content: string;
}

export const LatexOutput: React.FC<LatexOutputProps> = ({ content }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(content);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!content) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="ml-2 text-sm font-medium text-slate-600 font-mono">main.tex</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy Code'}
          </button>
          <button
            onClick={() => downloadLatex(content)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-brand-600 border border-transparent rounded-lg hover:bg-brand-700 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            Download .tex
          </button>
        </div>
      </div>
      <div className="flex-1 relative bg-[#0d1117]">
        <textarea
            readOnly
            value={content}
            className="w-full h-full p-4 bg-transparent text-slate-300 font-mono text-sm resize-none focus:outline-none"
            spellCheck={false}
        />
      </div>
      
      {/* Footer Info */}
      <div className="bg-slate-50 border-t border-slate-200 px-4 py-2 text-xs text-slate-500 flex items-center gap-2">
         <AlertTriangle className="h-3 w-3" />
         <span>Tip: Compile this using Overleaf or a local distribution like TeX Live. Ensure all image assets are accessible.</span>
      </div>
    </div>
  );
};