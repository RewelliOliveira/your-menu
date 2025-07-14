import { useState, ChangeEvent } from 'react';

export function useImageHandler() {
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState<string | null>(null);

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImgFile(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setImgPreview(url);
    } else {
      setImgPreview(null);
    }
  }

  return {
    imgFile,
    imgPreview,
    handleImageChange,
    setImgFile,
    setImgPreview,
  };
}