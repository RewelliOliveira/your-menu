import React, { useState, useEffect } from 'react';
import { UploadLogo } from './upload-logo';

export const BannerAdm: React.FC = () => {

    const [data, setData] = useState({
        title: '',
        logoUrl: '',
        backgroundUrl: '',
        estimatedTime: '',
        isOpen: false,
    });

    useEffect(() => {
        setData({
            title: 'Restaurante',
            logoUrl: 'placeholder.svg',
            backgroundUrl: 'placeholder.svg',
            estimatedTime: '30-45 min',
            isOpen: true,
        });
    }, []);

    return (
        <div className="relative w-full h-60 bg-black text-white flex items-center justify-center">
            <UploadLogo className="absolute top-0 left-0 w-full h-full object-cover opacity-50" />

            <div className="relative z-10 flex flex-col items-center">
                <UploadLogo />

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
