
import React, { useRef } from 'react';
import type { UploadedFile } from '../types';

interface ImageUploaderProps {
  label: string;
  onFileSelect: (file: UploadedFile) => void;
  uploadedFile: UploadedFile | null;
  onRemove: () => void;
  id: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ label, onFileSelect, uploadedFile, onRemove, id }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect({
        file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation();
      onRemove();
      if(inputRef.current) {
          inputRef.current.value = "";
      }
  }

  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-secondary mb-2">{label}</label>
      {uploadedFile ? (
        <div className="relative group w-full h-48 border-2 border-primary rounded-lg overflow-hidden">
          <img src={uploadedFile.preview} alt="Vista previa" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleRemove}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Quitar
            </button>
          </div>
        </div>
      ) : (
        <label
          htmlFor={id}
          className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-secondary border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click para subir</span></p>
            <p className="text-xs text-gray-500">PNG, JPG (MAX. 5MB)</p>
          </div>
          <input id={id} ref={inputRef} type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg" />
        </label>
      )}
    </div>
  );
};

export default ImageUploader;
