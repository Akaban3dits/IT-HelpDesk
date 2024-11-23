import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Download, Expand, X, ZoomIn, ZoomOut } from 'lucide-react';

const ImageGallery = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [isCarousel, setIsCarousel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const carouselRef = useRef(null);
  
  // Estados para el zoom y panning
  const [scale, setScale] = useState(1);
  const [panning, setPanning] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const checkScreenSize = () => {
      setIsCarousel(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const getImageUrl = (image) => {
    const baseUrl = process.env.REACT_APP_FILE_BASE_URL || 'http://localhost:5000';
    const normalizedPath = image.file_path.replace(/^uploads[\\/]/, '').replace(/\\/g, '/');
    return `${baseUrl}/uploads/${normalizedPath}`;
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      // Pinch zoom
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setStartPosition({ x: distance, y: distance });
    } else {
      // Single touch - for panning or swiping
      const touch = e.touches[0];
      setTouchStart(touch.clientX);
      if (scale > 1) {
        setPanning(true);
        setStartPosition({
          x: touch.clientX - lastPosition.x,
          y: touch.clientY - lastPosition.y
        });
      }
    }
  };

  const handleTouchMove = (e) => {
    if (!lightboxImage) return;
    e.preventDefault();

    if (e.touches.length === 2) {
      // Handle pinch zoom
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = distance / startPosition.x;
      const newScale = Math.min(Math.max(1, scale * delta), 4);
      setScale(newScale);
    } else if (panning && scale > 1) {
      // Handle panning when zoomed
      const touch = e.touches[0];
      const newX = touch.clientX - startPosition.x;
      const newY = touch.clientY - startPosition.y;

      // Calculate boundaries based on scale
      const maxX = (scale - 1) * 150;
      const maxY = (scale - 1) * 150;

      // Limit panning within boundaries
      const boundedX = Math.min(Math.max(-maxX, newX), maxX);
      const boundedY = Math.min(Math.max(-maxY, newY), maxY);

      setPosition({ x: boundedX, y: boundedY });
    } else {
      setTouchEnd(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    if (panning) {
      setLastPosition(position);
      setPanning(false);
    } else if (Math.abs(touchStart - touchEnd) > 75 && scale === 1) {
      if (touchStart - touchEnd > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setLastPosition({ x: 0, y: 0 });
    setPanning(false);
  };

  const nextImage = () => {
    resetZoom();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  
  const prevImage = () => {
    resetZoom();
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const openLightbox = (image) => {
    setLightboxImage(image);
    document.body.style.overflow = 'hidden';
    resetZoom();
  };

  const closeLightbox = () => {
    setLightboxImage(null);
    document.body.style.overflow = 'auto';
    resetZoom();
  };

  const handleDownload = async (image) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await fetch(getImageUrl(image), {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error('Error al descargar la imagen');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = image.original_filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error en la descarga:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!images || images.length === 0) {
    return <p className="text-center text-gray-500">No hay imágenes disponibles</p>;
  }

  const Modal = ({ image, onClose }) => {
    useEffect(() => {
      const handleEscape = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    if (!image) return null;

    const handleBackdropClick = (e) => {
      if (e.target === e.currentTarget) {
        onClose();
        resetZoom();
      }
    };

    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={handleBackdropClick}
      >
        <div className="relative w-full max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button
              onClick={() => setScale(scale === 1 ? 2 : 1)}
              className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-lg md:hidden"
              aria-label={scale === 1 ? "Aumentar zoom" : "Reducir zoom"}
            >
              {scale === 1 ? <ZoomIn size={24} /> : <ZoomOut size={24} />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(image);
              }}
              disabled={isLoading}
              className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-lg"
              aria-label="Descargar imagen"
            >
              <Download size={24} className={isLoading ? 'animate-pulse' : ''} />
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-lg"
              aria-label="Cerrar"
            >
              <X size={24} />
            </button>
          </div>
          <div 
            className="w-full h-[80vh] flex items-center justify-center bg-black/10"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={getImageUrl(image)}
              alt={image.original_filename}
              className="max-w-full max-h-full object-contain transition-transform duration-200 touch-none"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transformOrigin: 'center',
                willChange: 'transform'
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  const ImageComponent = ({ image, index, showOverlay = true }) => {
    const imageUrl = getImageUrl(image);

    return (
      <div className={`relative group rounded-lg overflow-hidden bg-gray-100 ${showOverlay ? 'aspect-square' : 'h-full'}`}>
        <img
          src={imageUrl}
          alt={image.original_filename || `Imagen ${index + 1}`}
          className="w-full h-full object-cover"
        />
        {showOverlay && (
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={() => openLightbox(image)}
              className="p-2 bg-white/90 rounded-full hover:bg-white transition-all transform hover:scale-105"
              aria-label="Ver imagen"
            >
              <Expand size={20} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(image);
              }}
              disabled={isLoading}
              className="p-2 bg-white/90 rounded-full hover:bg-white transition-all transform hover:scale-105"
              aria-label="Descargar imagen"
            >
              <Download size={20} className={isLoading ? 'animate-pulse' : ''} />
            </button>
          </div>
        )}
      </div>
    );
  };

  const CarouselView = () => (
    <div className="relative w-full overflow-hidden rounded-lg shadow-lg bg-gray-100">
      <div className="aspect-[4/3] sm:aspect-[16/9]">
        <div
          ref={carouselRef}
          className="flex h-full transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {images.map((image, index) => (
            <div key={image.id || index} className="w-full flex-shrink-0 relative">
              <ImageComponent image={image} index={index} showOverlay={false} />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openLightbox(image)}
                  className="p-3 bg-white/90 rounded-full hover:bg-white transition-all transform hover:scale-105 shadow-lg"
                  aria-label="Ver imagen"
                >
                  <Expand size={24} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <>
          <button 
            onClick={prevImage} 
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 rounded-full p-2 hover:bg-white transition-all shadow-lg z-10"
            aria-label="Imagen anterior"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextImage} 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 rounded-full p-2 hover:bg-white transition-all shadow-lg z-10"
            aria-label="Siguiente imagen"
          >
            <ChevronRight size={24} />
          </button>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );

  const GridView = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {images.map((image, index) => (
        <ImageComponent key={image.id || index} image={image} index={index} />
      ))}
    </div>
  );

  return (
    <>
      {isCarousel ? <CarouselView /> : <GridView />}
      <Modal image={lightboxImage} onClose={closeLightbox} />
    </>
  );
};

export default ImageGallery;
