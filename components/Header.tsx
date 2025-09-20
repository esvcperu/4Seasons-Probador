
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-secondary text-light p-8 text-center shadow-lg">
      <h1 className="text-4xl font-bold tracking-tight">Probador virtual de Ropa - 4Seasons</h1>
      <p className="text-lg mt-2 text-primary">
        Sube tu foto, describe tu nuevo atuendo y ¡mira cómo se produce la magia!
      </p>
    </header>
  );
};

export default Header;
