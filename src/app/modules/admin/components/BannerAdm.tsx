import React, { useState, useEffect } from "react";
import { UploadLogo } from "./UploadLogo";

export interface BannerAdmProps {
  profilePicFile: File | null;
  bannerPicFile: File | null;
  profilePicUrl: string | null;
  bannerPicUrl: string | null;
  setProfilePicFile: React.Dispatch<React.SetStateAction<File | null>>;
  setBannerPicFile: React.Dispatch<React.SetStateAction<File | null>>;
}

export function BannerAdm({
  profilePicFile,
  bannerPicFile,
  profilePicUrl,
  bannerPicUrl,
  setProfilePicFile,
  setBannerPicFile,
}: BannerAdmProps) {
  const [data, setData] = useState({
    title: "Seu Restaurante",
    logoUrl: "/placeholder.svg",
    backgroundUrl: "/placeholder.svg",
    estimatedTime: "30-45 min",
    isOpen: true,
  });

  useEffect(() => {
    const logoUrl = profilePicFile
      ? URL.createObjectURL(profilePicFile)
      : profilePicUrl && profilePicUrl.trim() !== ""
      ? profilePicUrl
      : "/placeholder.svg";

    const backgroundUrl = bannerPicFile
      ? URL.createObjectURL(bannerPicFile)
      : bannerPicUrl && bannerPicUrl.trim() !== ""
      ? bannerPicUrl
      : "/placeholder.svg";

    setData((prev) => ({
      ...prev,
      logoUrl,
      backgroundUrl,
    }));

    return () => {
      if (profilePicFile && logoUrl.startsWith("blob:")) {
        URL.revokeObjectURL(logoUrl);
      }
      if (bannerPicFile && backgroundUrl.startsWith("blob:")) {
        URL.revokeObjectURL(backgroundUrl);
      }
    };
  }, [profilePicFile, bannerPicFile, profilePicUrl, bannerPicUrl]);

  return (
    <div className="relative w-full h-60 bg-gray-950 text-white flex items-center justify-center overflow-hidden">
      <UploadLogo
        className="absolute top-0 left-0 w-full h-full object-cover opacity-50 rounded-none cursor-pointer"
        imageUrl={data.backgroundUrl}
        setImageFile={setBannerPicFile}
        ariaLabel="Clique para alterar a capa do restaurante"
      />

      <div className="relative z-10 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center overflow-hidden mb-2 border-2 border-white shadow-md">
          <UploadLogo
            imageUrl={data.logoUrl}
            setImageFile={setProfilePicFile}
            className="w-full h-full object-cover rounded-full"
            ariaLabel="Clique para alterar o logo do restaurante"
          />
        </div>

        <h2 className="text-xl font-bold">{data.title}</h2>
        <p className="text-xs text-gray-300 mt-1">
          (Clique nas imagens para personalizar sua foto de perfil e capa)
        </p>

        <div className="flex gap-6 items-center text-sm mt-3 bg-black/40 backdrop-blur-xs px-4 py-1 rounded-full border border-white/10">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
            <span>Aberto</span>
          </div>

          <div className="flex items-center gap-1.5">
            <img src="/timer.svg" alt="Tempo estimado" className="w-4 h-4" />
            <span>{data.estimatedTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
