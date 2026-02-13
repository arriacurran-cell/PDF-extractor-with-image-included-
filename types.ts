export interface AppState {
  apiKey: string;
  hasKey: boolean;
  status: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
  errorMessage: string | null;
  latexOutput: string;
}

export interface CloudConfig {
  provider: 'onedrive' | 'gdrive' | 'none';
  publicUrlPrefix: string;
  autoUpload: boolean; // Simulation toggle
}

export enum ProcessingStep {
  IDLE = 'IDLE',
  READING_PDF = 'READING_PDF',
  EXTRACTING_IMAGES = 'EXTRACTING_IMAGES', // Simulated step
  UPLOADING_IMAGES = 'UPLOADING_IMAGES', // Simulated step
  GENERATING_LATEX = 'GENERATING_LATEX',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface FileData {
  file: File;
  previewUrl: string;
}