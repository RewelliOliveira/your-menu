import React, { useState, useEffect } from 'react';

export const Banner: React.FC = () => {
  // Estado para dados simulados
  const [data, setData] = useState({
    title: '',
    logoUrl: '',
    backgroundUrl: '',
    estimatedTime: '',
    isOpen: false,
  });

  // Simula requisição para API
  useEffect(() => {
    setData({
      title: 'Restaurante',
      logoUrl: 'placeholder.svg',
      backgroundUrl: 'placeholder.svg',
      estimatedTime: '30-45 min',
      isOpen: true,
    });
  }, []);

  return (
    <div className="relative w-full h-60 bg-black text-white flex items-center justify-center">
      <img
        src={data.backgroundUrl}
        alt="background"
        className="absolute top-0 left-0 w-full h-full object-cover opacity-50"
      />
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-2">
          <img src={data.logoUrl} alt={data.title} className="object-cover w-full h-full" />
        </div>

        <h2 className="text-xl font-bold">{data.title}</h2>

        <div className="flex gap-6 items-center text-sm mt-2">

          <div className="flex items-center gap-1">
            <img
              src="/story.svg"
              alt={data.isOpen ? 'Aberto' : 'Fechado'}
              className="w-5 h-5"
            />
            <span>{data.isOpen ? 'Aberto' : 'Fechado'}</span>
          </div>

          <div className="flex items-center gap-1">
            <img
              src="/timer.svg"
              alt="Tempo estimado"
              className="w-5 h-5"
            />
            <span>{data.estimatedTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
