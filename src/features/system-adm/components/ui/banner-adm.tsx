import React, { useState, useEffect } from 'react';
import { UploadLogo } from './upload-logo';

interface BannerAdmProps {
  profilePicFile: File | null;
  bannerPicFile: File | null;
  profilePicUrl: string | null;
  bannerPicUrl: string | null;
  setProfilePicFile: React.Dispatch<React.SetStateAction<File | null>>;
  setBannerPicFile: React.Dispatch<React.SetStateAction<File | null>>;
}

interface BannerData {
  title: string;
  logoUrl: string | null;
  backgroundUrl: string | null;
  estimatedTime: string;
  isOpen: boolean;
}

export const BannerAdm: React.FC<BannerAdmProps> = ({
  profilePicFile,
  bannerPicFile,
  profilePicUrl,
  bannerPicUrl,
  setProfilePicFile,
  setBannerPicFile,
}) => {
  const [data, setData] = useState<BannerData>({
    title: '',
    logoUrl: null,
    backgroundUrl: null,
    estimatedTime: '',
    isOpen: false,
  });

  useEffect(() => {
    const logoUrl = profilePicFile
      ? URL.createObjectURL(profilePicFile)
      : profilePicUrl && profilePicUrl.trim() !== ''
        ? profilePicUrl
        : null;

    const backgroundUrl = bannerPicFile
      ? URL.createObjectURL(bannerPicFile)
      : bannerPicUrl && bannerPicUrl.trim() !== ''
        ? bannerPicUrl
        : null;

    // console.log('BannerAdm -> logoUrl:', logoUrl);
    // console.log('BannerAdm -> backgroundUrl:', backgroundUrl);

    setData({
      title: 'Restaurante',
      logoUrl,
      backgroundUrl,
      estimatedTime: '30-45 min',
      isOpen: true,
    });

    return () => {
      if (profilePicFile && logoUrl && logoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(logoUrl);
      }
      if (bannerPicFile && backgroundUrl && backgroundUrl.startsWith('blob:')) {
        URL.revokeObjectURL(backgroundUrl);
      }
    };
  }, [profilePicFile, bannerPicFile, profilePicUrl, bannerPicUrl]);

  return (
    <div className="relative w-full h-60 bg-black text-white flex items-center justify-center">
      <UploadLogo
        className="absolute top-0 left-0 w-full h-full object-cover opacity-50"
        imageUrl={data.backgroundUrl || null}
        setImageFile={setBannerPicFile}
      />

      <div className="relative z-10 flex flex-col items-center">
        <UploadLogo
          imageUrl={data.logoUrl || null}
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
