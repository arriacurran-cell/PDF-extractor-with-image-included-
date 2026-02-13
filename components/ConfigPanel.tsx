import React from 'react';
import { CloudConfig } from '../types';
import { Settings, Cloud, Link, AlertCircle } from 'lucide-react';

interface ConfigPanelProps {
  config: CloudConfig;
  setConfig: (config: CloudConfig) => void;
  disabled: boolean;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, setConfig, disabled }) => {
  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setConfig({ ...config, provider: e.target.value as any });
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, publicUrlPrefix: e.target.value });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="h-5 w-5 text-brand-600" />
        <h2 className="text-lg font-semibold text-slate-800">Hosting Integration & Image Handling</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Cloud Storage Provider
          </label>
          <div className="relative">
            <select
              disabled={disabled}
              value={config.provider}
              onChange={handleProviderChange}
              className="w-full appearance-none bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-2.5 disabled:opacity-50"
            >
              <option value="none">No Cloud Upload (TikZ/Placeholders)</option>
              <option value="gdrive">Google Drive (Simulated)</option>
              <option value="onedrive">Microsoft OneDrive (Simulated)</option>
            </select>
            <Cloud className="absolute right-3 top-2.5 h-5 w-5 text-slate-400 pointer-events-none" />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Select a provider to enable automatic image referencing in the generated LaTeX.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Public URL Prefix (Optional)
          </label>
          <div className="relative">
             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Link className="w-4 h-4 text-slate-500" />
             </div>
            <input
              type="text"
              disabled={disabled || config.provider === 'none'}
              value={config.publicUrlPrefix}
              onChange={handleUrlChange}
              placeholder={config.provider === 'none' ? "Select a provider first" : "https://drive.google.com/uc?id=..."}
              className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block w-full pl-10 p-2.5 disabled:bg-slate-100 disabled:text-slate-400"
            />
          </div>
           <p className="mt-2 text-xs text-slate-500">
            The base URL where your images will be hosted. The AI will append filenames to this path.
          </p>
        </div>
      </div>

      {config.provider !== 'none' && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
                <strong>Note:</strong> Since this is a browser-only demo, the app will <em>simulate</em> the extraction and upload of images. 
                In a production environment, this would authenticate with your {config.provider === 'gdrive' ? 'Google' : 'Microsoft'} account 
                and upload extracted assets automatically. For now, we will instruct the AI to generate code <em>as if</em> the images were at the provided URL.
            </div>
        </div>
      )}
    </div>
  );
};