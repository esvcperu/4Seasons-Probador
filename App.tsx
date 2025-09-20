import React, { useState, useCallback } from 'react';
import type { UploadedFile } from './types';
import { generateVirtualTryOn } from './services/geminiService';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import Loader from './components/Loader';
import ResultsGrid from './components/ResultsGrid';
import ImageModal from './components/ImageModal';

type GarmentCount = 1 | 2;
type SingleGarmentType = 'top' | 'bottom';

const resultTitlesForDownload = ["cuerpo_completo_estudio", "primer_plano", "escenario_domestico", "ambiente_urbano_natural"];

const App: React.FC = () => {
  const [modelImage, setModelImage] = useState<UploadedFile | null>(null);
  const [topGarment, setTopGarment] = useState<UploadedFile | null>(null);
  const [bottomGarment, setBottomGarment] = useState<UploadedFile | null>(null);
  const [accessory, setAccessory] = useState<UploadedFile | null>(null);
  const [garmentCount, setGarmentCount] = useState<GarmentCount>(1);
  const [singleGarmentType, setSingleGarmentType] = useState<SingleGarmentType>('top');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openModal = (image: string) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
      setIsModalOpen(false);
      setSelectedImage(null);
  };

  const handleDownloadSelectedImage = () => {
      if (!selectedImage) return;
      const link = document.createElement('a');
      link.href = selectedImage;
      const index = generatedImages.findIndex(img => img === selectedImage);
      const name = resultTitlesForDownload[index] || `resultado_${index + 1}`;
      link.download = `4seasons_${name}_alta_resolucion.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };
  
  const handleReset = () => {
    setModelImage(null);
    setTopGarment(null);
    setBottomGarment(null);
    setAccessory(null);
    setGarmentCount(1);
    setSingleGarmentType('top');
    setIsLoading(false);
    setError(null);
    setGeneratedImages([]);
  };

  const isGenerationDisabled = (): boolean => {
    if (!modelImage) return true;
    if (garmentCount === 1) {
      if (singleGarmentType === 'top' && !topGarment) return true;
      if (singleGarmentType === 'bottom' && !bottomGarment) return true;
    }
    if (garmentCount === 2 && (!topGarment || !bottomGarment)) return true;
    return false;
  };

  const handleSubmit = async () => {
    if (isGenerationDisabled()) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);

    try {
      const images = await generateVirtualTryOn(
        modelImage!,
        garmentCount === 2 || (garmentCount === 1 && singleGarmentType === 'top') ? topGarment! : undefined,
        garmentCount === 2 || (garmentCount === 1 && singleGarmentType === 'bottom') ? bottomGarment! : undefined,
        accessory ? accessory : undefined
      );
      setGeneratedImages(images);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ocurrió un error inesperado.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderGarmentSelectors = () => {
    if (!modelImage) return null;

    return (
      <div className="w-full p-6 bg-light rounded-xl shadow-lg mt-8">
        <h3 className="text-xl font-bold text-secondary mb-4 border-b-2 border-primary pb-2">Paso 2: Elige tus prendas</h3>
        <div className="flex items-center space-x-8 mb-6">
          <span className="font-semibold text-secondary">¿Cuántas prendas quieres probarte?</span>
          <div className="flex items-center space-x-4">
            {(['Una prenda', 'Dos prendas'] as const).map((label, index) => {
                const countValue = (index + 1) as GarmentCount;
                return (
                    <label key={countValue} className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="radio"
                            name="garmentCount"
                            value={countValue}
                            checked={garmentCount === countValue}
                            onChange={() => setGarmentCount(countValue)}
                            className="form-radio h-5 w-5 text-primary focus:ring-primary"
                        />
                        <span className="text-gray-700">{label}</span>
                    </label>
                );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {garmentCount === 1 && (
            <>
              <div className="flex items-center space-x-4 mb-4 col-span-full">
                <span className="font-semibold text-secondary">Tipo de prenda:</span>
                  {(['Parte Superior', 'Parte Inferior'] as const).map((label, index) => {
                      const typeValue = (index === 0 ? 'top' : 'bottom') as SingleGarmentType;
                      return (
                          <label key={typeValue} className="flex items-center space-x-2 cursor-pointer">
                              <input
                                  type="radio"
                                  name="singleGarmentType"
                                  value={typeValue}
                                  checked={singleGarmentType === typeValue}
                                  onChange={() => setSingleGarmentType(typeValue)}
                                  className="form-radio h-5 w-5 text-primary focus:ring-primary"
                              />
                              <span className="text-gray-700">{label}</span>
                          </label>
                      );
                  })}
              </div>
              {singleGarmentType === 'top' ? (
                <ImageUploader id="top-garment" label="Prenda Superior" uploadedFile={topGarment} onFileSelect={setTopGarment} onRemove={() => setTopGarment(null)} />
              ) : (
                <ImageUploader id="bottom-garment" label="Prenda Inferior" uploadedFile={bottomGarment} onFileSelect={setBottomGarment} onRemove={() => setBottomGarment(null)} />
              )}
            </>
          )}

          {garmentCount === 2 && (
            <>
              <ImageUploader id="top-garment-2" label="Prenda Superior" uploadedFile={topGarment} onFileSelect={setTopGarment} onRemove={() => setTopGarment(null)} />
              <ImageUploader id="bottom-garment-2" label="Prenda Inferior" uploadedFile={bottomGarment} onFileSelect={setBottomGarment} onRemove={() => setBottomGarment(null)} />
            </>
          )}
        </div>
      </div>
    );
  };
  
   const renderAccessorySelector = () => {
    if (!modelImage || (garmentCount === 1 && !topGarment && !bottomGarment) || (garmentCount === 2 && (!topGarment || !bottomGarment))) return null;

    return (
      <div className="w-full p-6 bg-light rounded-xl shadow-lg mt-8">
        <h3 className="text-xl font-bold text-secondary mb-4 border-b-2 border-primary pb-2">Paso 3: Añade un accesorio (Opcional)</h3>
        <div className="max-w-md mx-auto">
            <ImageUploader id="accessory" label="Accesorio (cinturón, cartera, etc.)" uploadedFile={accessory} onFileSelect={setAccessory} onRemove={() => setAccessory(null)} />
        </div>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      {isLoading && <Loader />}
      {isModalOpen && selectedImage && (
        <ImageModal 
            image={selectedImage} 
            onClose={closeModal} 
            onDownload={handleDownloadSelectedImage} 
        />
       )}
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        {generatedImages.length > 0 ? (
          <>
            <ResultsGrid images={generatedImages} onImageClick={openModal} />
            <div className="text-center mt-8">
                <button
                onClick={handleReset}
                className="bg-secondary text-light font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
                >
                Crear Otro Atuendo
                </button>
            </div>
          </>
        ) : (
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <div className="w-full p-6 bg-light rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-secondary mb-4 border-b-2 border-primary pb-2">Paso 1: Sube la foto de tu modelo</h3>
                <div className="max-w-md mx-auto">
                    <ImageUploader id="model-image" label="Foto de Modelo (Mujer o Varón)" uploadedFile={modelImage} onFileSelect={setModelImage} onRemove={() => setModelImage(null)} />
                </div>
            </div>
            
            {renderGarmentSelectors()}
            {renderAccessorySelector()}

            {error && (
              <div className="w-full bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-8 rounded-lg" role="alert">
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            )}
            
            <div className="mt-12 text-center">
              <button
                onClick={handleSubmit}
                disabled={isGenerationDisabled()}
                className="bg-primary text-light text-xl font-bold py-4 px-10 rounded-lg shadow-xl hover:bg-teal-500 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
              >
                ✨ Generar Atuendo Mágico
              </button>
            </div>
          </div>
        )}
      </main>
      <footer className="text-center py-6 bg-secondary text-gray-400 text-sm mt-12">
        <p>&copy; {new Date().getFullYear()} 4Seasons. Todos los derechos reservados.</p>
        <p>Potenciado por IA de vanguardia.</p>
      </footer>
    </div>
  );
};

export default App;