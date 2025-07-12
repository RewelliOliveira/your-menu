import React, { useEffect } from 'react';
import { Button } from './button';

interface ConfirmModalProps {
  title: string;
  content: string;
  buttonmsg: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  content,
  buttonmsg,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center"
      onMouseDown={onCancel}
    >
      <div
        className="bg-white p-6 rounded-md shadow-lg w-full max-w-md space-y-4 relative text-black"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-lg">{content}</p>

        <div className="flex justify-end gap-2 mt-8">
          <Button
            onClick={onCancel}
            className="!bg-gray-300 !text-black !px-3 !py-1 !text-sm !w-[90px]"
            type="button"
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            type="button"
            className="!px-5 !py-1 !text-sm !w-[120px]"
          >
            {buttonmsg}
          </Button>
        </div>
      </div>
    </div>
  );
};