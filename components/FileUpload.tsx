import React, { useCallback, useState } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';
import { FileData } from '../types';

interface FileUploadProps {
  onFileSelect: (file: FileData) => void;
  disabled: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = (file: File) => {
    if (file && file.type === 'application/pdf') {
        const url = URL.createObjectURL(file);
        setSelectedFile(file);
        onFileSelect({ file, previewUrl: url });
    } else {
        alert("Please upload a valid PDF file.");
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [disabled, onFileSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    // Note: We're not clearing parent state here to keep it simple, but in prod we would
  };

  if (selectedFile) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-red-600" />
                </div>
                <div>
                    <h3 className="font-medium text-slate-900">{selectedFile.name}</h3>
                    <p className="text-sm text-slate-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
            </div>
            {!disabled && (
                <button 
                    onClick={clearFile}
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>
            )}
        </div>
    );
  }

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-xl p-12 mb-6 text-center transition-all duration-200 ease-in-out
        ${isDragging 
          ? 'border-brand-500 bg-brand-50' 
          : 'border-slate-300 hover:border-brand-400 hover:bg-slate-50 bg-white'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <input
        type="file"
        accept=".pdf"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        onChange={handleFileInput}
        disabled={disabled}
      />
      
      <div className="flex flex-col items-center justify-center pointer-events-none">
        <div className={`
          h-16 w-16 rounded-full flex items-center justify-center mb-4 transition-colors
          ${isDragging ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-500'}
        `}>
          <UploadCloud className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">
          Drop your PDF here
        </h3>
        <p className="text-slate-500 max-w-sm mx-auto">
          Drag & drop or click to upload. Supports scientific papers, datasheets, and notes.
        </p>
      </div>
    </div>
  );
};