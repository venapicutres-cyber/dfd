import React, { useState } from 'react';
import { importMockDataToSupabase } from '../lib/mockDataImporter';

interface DataImporterProps {
  onImportComplete: () => void;
}

const DataImporter: React.FC<DataImporterProps> = ({ onImportComplete }) => {
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleImport = async () => {
    setIsImporting(true);
    setImportStatus('idle');
    
    try {
      await importMockDataToSupabase();
      setImportStatus('success');
      setTimeout(() => {
        onImportComplete();
      }, 2000);
    } catch (error) {
      console.error('Import failed:', error);
      setImportStatus('error');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-bg p-4">
      <div className="text-center bg-brand-surface p-8 rounded-2xl shadow-lg border border-brand-border max-w-md">
        <h2 className="text-2xl font-bold text-brand-text-light mb-4">Import Sample Data</h2>
        <p className="text-brand-text-primary mb-6">
          Would you like to import sample data to get started? This will populate your database with example clients, projects, and other data.
        </p>
        
        {importStatus === 'success' && (
          <div className="mb-4 p-3 bg-green-500/20 text-green-400 rounded-lg">
            ✅ Data imported successfully! Redirecting...
          </div>
        )}
        
        {importStatus === 'error' && (
          <div className="mb-4 p-3 bg-red-500/20 text-red-400 rounded-lg">
            ❌ Import failed. Please check the console for details.
          </div>
        )}
        
        <div className="space-y-3">
          <button 
            onClick={handleImport}
            disabled={isImporting || importStatus === 'success'}
            className="w-full button-primary"
          >
            {isImporting ? 'Importing...' : 'Import Sample Data'}
          </button>
          
          <button 
            onClick={onImportComplete}
            className="w-full button-secondary"
          >
            Skip Import
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataImporter;