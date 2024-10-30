import React from 'react';
import jpgIcon from '../../assets/jpg.png';
import pdfIcon from '../../assets/pdf.png';
import pngIcon from '../../assets/png.png';
import wordIcon from '../../assets/word.png';

const DocumentButton = ({ filename, previewUrl }) => {
    const getIcon = (extension) => {
        switch (extension) {
            case 'jpg':
            case 'jpeg':
                return <img src={jpgIcon} alt="JPG Icon" className="h-8 w-8" />;
            case 'png':
                return <img src={pngIcon} alt="PNG Icon" className="h-8 w-8" />;
            case 'pdf':
                return <img src={pdfIcon} alt="PDF Icon" className="h-8 w-8" />;
            case 'doc':
            case 'docx':
                return <img src={wordIcon} alt="Word Icon" className="h-8 w-8" />;
            default:
                return <img src={jpgIcon} alt="Default Icon" className="h-8 w-8" />; // Puedes definir un icono por defecto
        }
    };

    const extension = filename.split('.').pop().toLowerCase();

    return (
        <button className="w-full max-w-md flex items-center bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <div className="p-2 bg-gray-300 rounded-l-md">
                {getIcon(extension)}
            </div>
            <div className="flex-grow p-2 text-left truncate">
                <span className="text-sm text-gray-700">{filename}</span>
            </div>
        </button>
    );
};

export default DocumentButton;
