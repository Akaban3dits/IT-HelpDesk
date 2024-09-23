import React from 'react';
import { X } from 'lucide-react';

const ImageLightbox = ({ src, alt, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
        <div className="relative max-w-[90vw] max-h-[90vh]">
            <img src={src} alt={alt} className="max-h-full max-w-full object-contain" />
            <button
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="absolute top-2 right-2 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-1"
                aria-label="Close lightbox"
            >
                <X size={24} />
            </button>
        </div>
    </div>
);

export default ImageLightbox;
