
import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "Iniciando el motor de IA...",
  "Analizando la foto del modelo...",
  "Ajustando las prendas virtualmente...",
  "Renderizando la primera escena...",
  "Creando el ambiente doméstico...",
  "Paseando por la ciudad para la última foto...",
  "Aplicando toques finales fotorrealistas...",
  "Casi listo, ¡prepara para sorprenderte!",
];

const Loader: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 2500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="fixed inset-0 bg-secondary bg-opacity-90 flex flex-col items-center justify-center z-50">
      <div className="w-16 h-16 border-4 border-t-primary border-transparent rounded-full animate-spin"></div>
      <p className="text-light text-lg mt-6 font-semibold animate-pulse">{loadingMessages[messageIndex]}</p>
    </div>
  );
};

export default Loader;
