import { useRef, useState, useEffect } from "react";

interface UploadLogoProps {
  className?: string;
  imageUrl?: string; 
  setImageFile: React.Dispatch<React.SetStateAction<File | null>>;
}

export function UploadLogo({ className, imageUrl, setImageFile }: UploadLogoProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(imageUrl || null);
  }, [imageUrl]);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);      
      setPreview(URL.createObjectURL(file));
    }
  }

  function triggerFileInput() {
    inputRef.current?.click();
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 mt-10">
      <div
        className={
          className ||
          "w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer"
        }
        onClick={triggerFileInput}
      >
        {preview ? (
          <img
            src={preview}
            alt="Logo"
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="text-sm text-gray-500">Logo</span>
        )}
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
