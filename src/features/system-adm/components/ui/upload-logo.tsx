import { useRef, useState } from "react";

export function UploadLogo() {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  }

  function triggerFileInput() {
    inputRef.current?.click();
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div
        className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer"
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
      <p className="text-sm text-gray-500">Toque para alterar</p>
    </div>
  );
}
