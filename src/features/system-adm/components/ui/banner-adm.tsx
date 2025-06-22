import React, { useState, useEffect } from 'react';
import { UploadLogo } from './upload-logo';

interface BannerAdmProps {
  profilePicFile: File | null;
  bannerPicFile: File | null;
  setProfilePicFile: React.Dispatch<React.SetStateAction<File | null>>;
  setBannerPicFile: React.Dispatch<React.SetStateAction<File | null>>;
}

export const BannerAdm: React.FC<BannerAdmProps> = ({
  profilePicFile,
  bannerPicFile,
  setProfilePicFile,
  setBannerPicFile,
}) => {
  const [data, setData] = useState({
    title: '',
    logoUrl: '',
    backgroundUrl: '',
    estimatedTime: '',
    isOpen: false,
  });

  useEffect(() => {
    setData({
      title: 'Restaurante',
      logoUrl: profilePicFile ? URL.createObjectURL(profilePicFile) : 'placeholder.svg',
      backgroundUrl: bannerPicFile ? URL.createObjectURL(bannerPicFile) : 'placeholder.svg',
      estimatedTime: '30-45 min',
      isOpen: true,
    });

    return () => {
      if (profilePicFile) URL.revokeObjectURL(data.logoUrl);
      if (bannerPicFile) URL.revokeObjectURL(data.backgroundUrl);
    };
  }, [profilePicFile, bannerPicFile]);

  return (
    <div className="relative w-full h-60 bg-black text-white flex items-center justify-center">
      <UploadLogo
        className="absolute top-0 left-0 w-full h-full object-cover opacity-50"
        imageUrl={data.backgroundUrl}
        setImageFile={setBannerPicFile}
      />

      <div className="relative z-10 flex flex-col items-center">
        <UploadLogo
          imageUrl={data.logoUrl}
          setImageFile={setProfilePicFile}
          className="w-24 h-24 rounded-full"
        />

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
