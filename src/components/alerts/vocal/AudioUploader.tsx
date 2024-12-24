import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useToast } from '../../../hooks/useToast';

interface AudioUploaderProps {
  onUpload: (url: string) => void;
}

export default function AudioUploader({ onUpload }: AudioUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { showToast } = useToast();

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!file.type.startsWith('audio/')) {
      showToast('error', 'Veuillez sélectionner un fichier audio');
      return false;
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      showToast('error', 'Le fichier audio ne doit pas dépasser 10MB');
      return false;
    }

    return true;
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) {
      event.target.value = '';
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `vocal-alerts/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('audio')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('audio')
        .getPublicUrl(filePath);

      onUpload(publicUrl);
      showToast('success', 'Audio téléchargé avec succès');
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading audio:', error);
      showToast('error', 'Erreur lors du téléchargement de l\'audio');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="audio/*"
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
        >
          <Upload className="h-5 w-5 mr-2" />
          Sélectionner un fichier
        </button>
      </div>

      {selectedFile && (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">
              {selectedFile.name}
            </span>
            <span className="text-xs text-gray-500">
              ({Math.round(selectedFile.size / 1024)} KB)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
            >
              {uploading ? 'Téléchargement...' : 'Télécharger'}
            </button>
            <button
              type="button"
              onClick={clearSelection}
              disabled={uploading}
              className="p-1 text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}