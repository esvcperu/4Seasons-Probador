import React from 'react';

interface ResultsGridProps {
  images: string[];
  onImageClick: (image: string) => void;
}

const resultTitles = [
    "1. Cuerpo Completo - Estudio",
    "2. Primer Plano",
    "3. Escenario Doméstico",
    "4. Ambiente Urbano/Natural",
];

const ResultsGrid: React.FC<ResultsGridProps> = ({ images, onImageClick }) => {
    
  return (
    <div className="w-full max-w-7xl mx-auto my-12 p-6 bg-light rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-secondary text-center mb-8">¡Aquí tienes tu nuevo look!</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {images.map((image, index) => (
            <button
                key={index}
                onClick={() => onImageClick(image)}
                className="group relative border-2 border-gray-200 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-50"
                aria-label={`Ver imagen ampliada de ${resultTitles[index]}`}
            >
                <img src={image} alt={`Resultado ${index + 1}: ${resultTitles[index]}`} className="w-full h-auto object-cover aspect-square" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 flex flex-col justify-end">
                    <h3 className="text-white text-lg font-bold">{resultTitles[index]}</h3>
                </div>
                 <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                </div>
            </button>
        ))}
        </div>
    </div>
  );
};

export default ResultsGrid;