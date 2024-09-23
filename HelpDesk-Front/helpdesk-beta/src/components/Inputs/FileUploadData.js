import React, { useState, useRef } from 'react';
import { X } from 'lucide-react'; // Icono de eliminación de lucide-react

// Asegúrate de importar las imágenes desde tu carpeta assets
import pdfIcon from '../../assets/pdf.png';
import imageIcon from '../../assets/jpg.png';
import wordIcon from '../../assets/word.png';
import defaultIcon from '../../assets/png.png'; // Puedes cambiar este icono por un genérico si lo deseas

const FileUploadArea = ({ onFileChange, maxFiles = 5 }) => {
    const [files, setFiles] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    const handleFiles = (newFiles) => {
        const updatedFiles = [...files, ...Array.from(newFiles)].slice(0, maxFiles);
        setFiles(updatedFiles);
        onFileChange(updatedFiles);
    };

    const removeFile = (index) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
        onFileChange(updatedFiles);
    };

    const onButtonClick = () => {
        fileInputRef.current.click();
    };

    // Función para obtener el icono correcto basado en la extensión del archivo
    const getFileIcon = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        switch (extension) {
            case 'pdf':
                return <img src={pdfIcon} alt="" className="w-5 h-5" />;
            case 'png':
                return <img src={defaultIcon} alt="" className="w-5 h-5" />;
            case 'jpg':
                return <img src={imageIcon} alt="" className="w-5 h-5" />;
            case 'jpeg':
                return <img src={imageIcon} alt="" className="w-5 h-5" />;
            case 'gif':
            case 'doc':
                return <img src={wordIcon} alt="" className="w-5 h-5" />;
            case 'docx':
                return <img src={wordIcon} alt="" className="w-5 h-5" />;
            default:
                return <img src={defaultIcon} alt="" className="w-5 h-5" />;
        }
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-4 py-5">
                <h3 className="text-lg font-medium text-center text-gray-700 mb-4">UPLOAD FILE</h3>
                <div className="space-y-2">
                    {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-200">
                            <div className="flex items-center">
                                {getFileIcon(file.name)}
                                <span className="ml-2 text-sm text-gray-600 truncate w-40">{file.name}</span>
                            </div>
                            <button
                                onClick={() => removeFile(index)}
                                className="p-1 rounded-full text-red-500 hover:bg-red-100 transition-colors duration-200"
                                aria-label="Remove file"
                            >
                                <X size={18} className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Mostrar el área de arrastre y el botón solo si no se alcanzó el límite */}
                {files.length < maxFiles && (
                    <div
                        className={`mt-4 border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            onChange={handleChange}
                            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                            className="hidden"
                        />
                        <img src={defaultIcon} alt="Upload Icon" className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm font-medium text-gray-900">
                            DRAG FILE HERE
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                            OR
                        </p>
                        <button
                            type="button"
                            className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={onButtonClick}
                        >
                            BROWSE FILES
                        </button>
                    </div>
                )}

                <p className="mt-2 text-xs text-center text-gray-500">
                    {files.length} / {maxFiles} files uploaded
                </p>
            </div>
        </div>
    );
};

export default FileUploadArea;
