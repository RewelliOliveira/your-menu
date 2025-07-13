import React, { useState, useEffect } from 'react';
import { ConfirmModal } from './confirm-modal';
import { toggleRestaurantOpenStatusApi } from '@/services/restaurant-status-api';
import { useAuth } from '@/contexts/auth-context';
import { getRestaurantProfileApi, RestaurantApiResponse } from '@/services/restaurant-profile-api';

export const Banner: React.FC = () => {
  const { token, restaurantId } = useAuth();

  const [data, setData] = useState({
    title: '',
    logoUrl: '',
    backgroundUrl: '',
    estimatedTime: '',
    isOpen: false,
  });

  const [showModal, setShowModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      if (!token) return;

      try {
        const restaurant: RestaurantApiResponse = await getRestaurantProfileApi(token);
        setData({
          title: restaurant.name || 'Restaurante',
          logoUrl: restaurant.profilePicUrl || 'placeholder.svg',
          backgroundUrl: restaurant.bannerPicUrl || 'placeholder.svg',
          estimatedTime: `${restaurant.deliveryTimeMin}-${restaurant.deliveryTimeMax} min`,
          isOpen: restaurant.isOpen,
        });
      } catch (error) {
        console.error('Erro ao buscar perfil do restaurante:', error);
        setData({
          title: 'Restaurante',
          logoUrl: 'placeholder.svg',
          backgroundUrl: 'placeholder.svg',
          estimatedTime: '30-45 min',
          isOpen: false,
        });
      }
    }

    fetchProfile();
  }, [token]);

  const handleToggleRequest = () => {
    setPendingStatus(!data.isOpen);
    setShowModal(true);
  };

  const confirmToggle = async () => {
    if (!token || !restaurantId) {
      alert('Token ou ID do restaurante ausente.');
      setShowModal(false);
      return;
    }

    try {
      await toggleRestaurantOpenStatusApi(restaurantId, pendingStatus, token);
      setData((prev) => ({ ...prev, isOpen: pendingStatus }));
    } catch (error) {
      alert('Erro ao atualizar o status do restaurante.');
      console.error(error);
    } finally {
      setShowModal(false);
    }
  };

  const cancelToggle = () => setShowModal(false);

  return (
    <>
      <div className="relative w-full h-60 bg-black text-white flex items-center justify-center">
        <img
          src={data.backgroundUrl}
          alt="background"
          className="absolute top-0 left-0 w-full h-full object-cover opacity-50"
        />

        <div className="absolute top-2 right-2 z-20 flex items-center gap-2">
          <button
            onClick={handleToggleRequest}
            className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ${
              data.isOpen ? 'bg-green-500' : 'bg-gray-400'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                data.isOpen ? 'translate-x-6' : ''
              }`}
            />
          </button>
          <span className="text-sm font-medium min-w-[130px]">
            Restaurante {data.isOpen ? 'aberto' : 'fechado'}
          </span>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-2">
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

      {showModal && (
        <ConfirmModal
          title={pendingStatus ? 'Abrir Restaurante' : 'Fechar Restaurante'}
          content={`Tem certeza que deseja ${pendingStatus ? 'abrir' : 'fechar'} o restaurante?`}
          buttonmsg="Sim"
          onConfirm={confirmToggle}
          onCancel={cancelToggle}
        />
      )}
    </>
  );
};
