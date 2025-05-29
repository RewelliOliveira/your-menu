import React from 'react';
import { X } from 'lucide-react';

interface ConfirmModalProps {
    message: string;
    buttonmsg: string;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    message,
    buttonmsg,
    onConfirm,
    onCancel,
    isOpen,
  }) => {
    if (!isOpen) return null;
  
return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
    <div className="bg-white p-8 rounded shadow-lg text-black w-[420px] relative">
        <button
        onClick={onCancel}
        className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
        <X className="w-5 h-5" />
        </button>

        <p className="mb-6 text-lg font-semibold">
        {message}
        </p>

        <div className="flex justify-end">
        <button
            onClick={onConfirm}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded"
        >
            {buttonmsg}
        </button>
        </div>
    </div>
    </div>
    );
};
