import React, { useEffect } from 'react';

interface ImageModalProps {
  image: string;
  onClose: () => void;
  onDownload: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ image, onClose, onDownload }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-modal-title"
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-light rounded-lg shadow-2xl p-4 relative max-w-4xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
            <h2 id="image-modal-title" className="text-xl font-bold text-secondary">Vista Previa</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-secondary transition-colors"
              aria-label="Cerrar modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
        </div>
        
        <div className="flex-grow overflow-auto flex items-center justify-center">
             <img src={image} alt="Vista ampliada del resultado" className="max-w-full max-h-full object-contain rounded-md" />
        </div>

        <div className="mt-6 text-center">
            <button
                onClick={onDownload}
                className="bg-primary text-light font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-teal-500 transition-all duration-300 transform hover:scale-105"
            >
                Descargar en Alta Resolución
            </button>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;