import React, { useState } from 'react';
import { Download } from 'lucide-react';
import jpgIcon from '../../assets/jpg.png';
import pdfIcon from '../../assets/pdf.png';
import pngIcon from '../../assets/png.png';
import wordIcon from '../../assets/word.png';

const DocumentButton = ({ doc }) => {
  const [isLoading, setIsLoading] = useState(false);

  const getFileExtension = (filename) => {
    return filename?.split('.').pop()?.toLowerCase() || '';
  };

  const getMimeType = (extension) => {
    const mimeTypes = {
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'txt': 'text/plain',
      'csv': 'text/csv',
    };
    return mimeTypes[extension] || 'application/octet-stream';
  };

  const handleDownload = async () => {
    setIsLoading(true);
  
    try {
      console.log("Iniciando descarga del archivo...");
      if (!doc?.file_path || !doc?.original_filename) {
        throw new Error('Información del archivo incompleta');
      }

      const baseUrl = process.env.REACT_APP_FILE_BASE_URL || 'http://localhost:5000';
      const normalizedPath = doc.file_path.replace(/^uploads[\\/]/, '').replace(/\\/g, '/');
      const fileUrl = `${baseUrl}/uploads/${normalizedPath}`;
      console.log("URL normalizada del archivo:", fileUrl);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await fetch(fileUrl, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': getMimeType(getFileExtension(doc.original_filename)),
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error('Error al descargar el archivo');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.original_filename;
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);

    } catch (error) {
      console.error('Error en la descarga:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getIconForExtension = (extension) => {
    switch (extension) {
      case 'pdf':
        return pdfIcon;
      case 'jpg':
      case 'jpeg':
        return jpgIcon;
      case 'png':
        return pngIcon;
      case 'doc':
      case 'docx':
        return wordIcon;
      default:
        return null;
    }
  };

  const getTruncatedFilename = (filename, maxLength = 20) => {
    return filename.length > maxLength ? `${filename.slice(0, maxLength)}...` : filename;
  };

  const icon = getIconForExtension(getFileExtension(doc.original_filename));

  return (
    <div className="space-y-2">
      <button
        onClick={handleDownload}
        disabled={isLoading}
        className={`w-full flex items-center bg-white hover:bg-gray-50 rounded-lg border border-gray-200 
          transition-all duration-200 group ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="p-3 bg-gray-50 rounded-l-lg border-r border-gray-200 group-hover:bg-gray-100">
          {icon ? <img src={icon} alt={doc.original_filename} className="w-8 h-8" /> : <span className="text-xs font-bold uppercase">{getFileExtension(doc.original_filename)}</span>}
        </div>
        
        <div className="flex-grow p-3 flex items-center justify-between">
          <span className="text-sm text-gray-700 truncate mr-2">
            {getTruncatedFilename(doc.original_filename, 25)}
          </span>
          <Download
            className={`h-5 w-5 text-gray-400 ${isLoading ? 'animate-pulse' : 'opacity-0 group-hover:opacity-100'} 
              transition-opacity duration-200`}
          />
        </div>
      </button>
    </div>
  );
};

export default DocumentButton;
