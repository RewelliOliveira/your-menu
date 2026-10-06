import React, { useState, useEffect } from 'react';
import { getRestaurantProfileApi, RestaurantApiResponse } from '@/services/restaurant-profile-api';

export const Banner: React.FC = () => {
  const [data, setData] = useState({
    title: 'YourBurger Artesanal',
    logoUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=300&auto=format&fit=crop&q=80',
    backgroundUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80',
    estimatedTime: '30-45 min',
    isOpen: true,
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const restaurant: RestaurantApiResponse = await getRestaurantProfileApi();
        setData({
          title: restaurant.name || 'YourBurger Artesanal',
          logoUrl: restaurant.profilePicUrl || 'placeholder.svg',
          backgroundUrl: restaurant.bannerPicUrl || 'placeholder.svg',
          estimatedTime: `${restaurant.deliveryTimeMin}-${restaurant.deliveryTimeMax} min`,
          isOpen: restaurant.isOpen,
        });
      } catch (error) {
        console.error('Erro ao buscar perfil do restaurante:', error);
      }
    }

    fetchProfile();
  }, []);

  return (
    <div className="relative w-full h-60 bg-black text-white flex items-center justify-center">
      <img
        src={data.backgroundUrl}
        alt="background"
        className="absolute top-0 left-0 w-full h-full object-cover opacity-50"
      />

      <div className="relative z-10 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-2 border-2 border-white/80 shadow-md">
          <img src={data.logoUrl} alt={data.title} className="object-cover w-full h-full" />
        </div>

        <h2 className="text-xl font-bold">{data.title}</h2>

        <div className="flex gap-6 items-center text-sm mt-2">
          <div className="flex items-center gap-1 min-w-[90px]">
            <img
              src={data.isOpen ? '/aberto.svg' : '/fechado.svg'}
              alt={data.isOpen ? 'Aberto' : 'Fechado'}
              className="w-5 h-5"
            />
            <span className="inline-block min-w-[60px]">
              {data.isOpen ? 'Aberto' : 'Fechado'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <img src="/timer.svg" alt="Tempo estimado" className="w-5 h-5" />
            <span>{data.estimatedTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
