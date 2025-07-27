import { useRef, useState, useEffect } from "react";

interface UploadLogoProps {
  className?: string;
  imageUrl?: string | null;
  setImageFile: React.Dispatch<React.SetStateAction<File | null>>;
}

export function UploadLogo({ className, imageUrl, setImageFile }: UploadLogoProps) {
  const [preview, setPreview] = useState<string | null>(null);
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
      className={
        className ||
        "w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer"
      }
      onClick={triggerFileInput}
    >
      <img
        src={preview || "/placeholder.svg"}
        alt="Logo"
        className="w-full h-full object-cover"
      />
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
