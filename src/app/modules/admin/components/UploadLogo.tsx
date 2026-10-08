import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/core/utils/utils";

export interface UploadLogoProps {
  className?: string;
  imageUrl?: string | null;
  setImageFile: React.Dispatch<React.SetStateAction<File | null>>;
  ariaLabel?: string;
}

export function UploadLogo({
  className,
  imageUrl,
  setImageFile,
  ariaLabel = "Fazer upload de imagem",
}: UploadLogoProps) {
  const [preview, setPreview] = useState<string>("/placeholder.svg");
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!imageUrl || imageUrl.trim() === "") {
      setPreview("/placeholder.svg");
    } else {
      setPreview(imageUrl);
    }
  }, [imageUrl]);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
      const newPreviewUrl = URL.createObjectURL(file);
      previewUrlRef.current = newPreviewUrl;
      setPreview(newPreviewUrl);
    }
  }

  function triggerFileInput() {
    inputRef.current?.click();
  }

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    };
  }, []);

  return (
    <div
      className={cn(
        "relative rounded-full bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer group transition-transform hover:scale-105",
        className || "w-24 h-24"
      )}
      onClick={triggerFileInput}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") triggerFileInput();
      }}
      aria-label={ariaLabel}
    >
      <img
        src={preview}
        alt="Foto de perfil ou logo"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-medium">
        Alterar
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
    </div>
  );
}
