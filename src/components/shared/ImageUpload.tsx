import { useId, useRef, useState, type ChangeEvent } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ACCEPTED_IMAGE_TYPES } from "@/lib/image";
import { notifyError } from "@/lib/notify";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/services/upload-service";

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  className?: string;
  maxSize?: number;
  compact?: boolean;
}

export function ImageUpload({ value, onChange, label = "Adicionar foto", className, maxSize, compact = false }: ImageUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    try {
      onChange(await uploadImage(file, maxSize));
    } catch (error) {
      notifyError(error, "Não foi possível enviar a imagem.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={cn("group relative overflow-hidden rounded-2xl border-2 border-dashed bg-muted/50", className)}>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES}
        className="sr-only"
        onChange={handleFile}
        disabled={uploading}
        aria-label={label}
      />

      {value ? (
        <>
          <img src={value} alt="" className="absolute inset-0 size-full object-cover" />
          <div
            className={cn(
              "absolute inset-0 flex items-end justify-end gap-2 bg-linear-to-t from-black/60 via-transparent to-transparent transition-opacity sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100",
              compact ? "items-center justify-center bg-black/40 p-1" : "p-3",
            )}
          >
            <Button
              type="button"
              size={compact ? "icon-sm" : "sm"}
              variant="secondary"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              aria-label="Trocar imagem"
            >
              <ImagePlus /> {!compact && "Trocar"}
            </Button>
            <Button type="button" size="icon-sm" variant="secondary" onClick={() => onChange(null)} aria-label="Remover imagem">
              <Trash2 />
            </Button>
          </div>
        </>
      ) : (
        <label
          htmlFor={inputId}
          className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-2 p-2 text-center transition-colors hover:bg-accent/60"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-card text-primary shadow-sm">
            <ImagePlus className="size-5" />
          </span>
          <span className={cn("font-semibold", compact ? "text-xs" : "text-sm")}>{label}</span>
          {!compact && <span className="text-xs text-muted-foreground">JPG, PNG ou WEBP até 5 MB</span>}
        </label>
      )}

      {uploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-card/70 backdrop-blur-sm">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
}
