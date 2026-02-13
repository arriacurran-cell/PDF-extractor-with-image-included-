import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FileUpload } from './components/FileUpload';
import { ConfigPanel } from './components/ConfigPanel';
import { LatexOutput } from './components/LatexOutput';
import { generateLatexFromPdf } from './services/geminiService';
import { fileToBase64 } from './utils/helpers';
import { AppState, CloudConfig, ProcessingStep, FileData } from './types';
import { Loader2, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [cloudConfig, setCloudConfig] = useState<CloudConfig>({
    provider: 'none',
    publicUrlPrefix: '',
    autoUpload: false
  });
  
  const [processingState, setProcessingState] = useState<ProcessingStep>(ProcessingStep.IDLE);
  const [latexOutput, setLatexOutput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [progressMsg, setProgressMsg] = useState<string>('');

  // We assume API Key is available in process.env per instructions
  // In a real app we might ask for it, but instructions say use process.env.API_KEY
  
  const handleFileSelect = (data: FileData) => {
    setFileData(data);
    setErrorMsg(null);
    setLatexOutput('');
    setProcessingState(ProcessingStep.IDLE);
  };

  const startConversion = async () => {
    if (!fileData) return;

    try {
      setProcessingState(ProcessingStep.READING_PDF);
      setProgressMsg("Reading PDF file...");
      
      const base64 = await fileToBase64(fileData.file);

      // Simulation of Image Extraction/Upload
      if (cloudConfig.provider !== 'none') {
        setProcessingState(ProcessingStep.EXTRACTING_IMAGES);
        setProgressMsg("Analyzing PDF for images and diagrams...");
        await new Promise(r => setTimeout(r, 1500)); // Simulate delay

        setProcessingState(ProcessingStep.UPLOADING_IMAGES);
        setProgressMsg(`Simulating upload to ${cloudConfig.provider === 'gdrive' ? 'Google Drive' : 'OneDrive'}...`);
        await new Promise(r => setTimeout(r, 1500)); // Simulate delay
      }

      setProcessingState(ProcessingStep.GENERATING_LATEX);
      setProgressMsg("Generating LaTeX with Gemini 3.0 Pro (This may take a moment)...");
      
      const latex = await generateLatexFromPdf(base64, cloudConfig, (msg) => setProgressMsg(msg));
      
      setLatexOutput(latex);
      setProcessingState(ProcessingStep.COMPLETED);

    } catch (err: any) {
      console.error(err);
      setProcessingState(ProcessingStep.FAILED);
      setErrorMsg(err.message || "An unexpected error occurred during conversion.");
    }
  };

  const isProcessing = processingState !== ProcessingStep.IDLE && processingState !== ProcessingStep.COMPLETED && processingState !== ProcessingStep.FAILED;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Turn PDFs into Perfect LaTeX</h2>
                <p className="text-lg text-slate-600">
                    Upload your papers, notes, or assignments. We'll extract text, formulas, and format images for your cloud storage.
                </p>
            </div>

            <ConfigPanel 
                config={cloudConfig} 
                setConfig={setCloudConfig} 
                disabled={isProcessing}
            />

            <FileUpload 
                onFileSelect={handleFileSelect} 
                disabled={isProcessing}
            />

            {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    <strong>Error:</strong> {errorMsg}
                </div>
            )}

            {fileData && !latexOutput && processingState !== ProcessingStep.FAILED && (
                <div className="mb-8 flex justify-center">
                    <button
                        onClick={startConversion}
                        disabled={isProcessing}
                        className={`
                            flex items-center gap-2 px-8 py-3 rounded-xl text-white font-semibold shadow-lg transition-all
                            ${isProcessing 
                                ? 'bg-slate-400 cursor-not-allowed' 
                                : 'bg-brand-600 hover:bg-brand-700 hover:shadow-brand-500/30 hover:-translate-y-0.5'
                            }
                        `}
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>{progressMsg}</span>
                            </>
                        ) : (
                            <>
                                <span>Convert to LaTeX</span>
                                <ArrowRight className="h-5 w-5" />
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>

        {latexOutput && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded uppercase tracking-wide">Success</span>
                    Generated LaTeX Code
                </h3>
                <LatexOutput content={latexOutput} />
            </div>
        )}

      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} Latexify.ai. Powered by Google Gemini 3.0 Pro.
        </div>
      </footer>
    </div>
  );
};

export default App;