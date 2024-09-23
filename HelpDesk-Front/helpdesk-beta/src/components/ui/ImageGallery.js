import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ImageLightbox from './ImageLightbox';

const ImageGallery = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const carouselRef = useRef(null);

    useEffect(() => {
        const checkIfMobile = () => setIsMobile(window.innerWidth < 640);
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
    const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
    const handleTouchEnd = () => {
        if (touchStart - touchEnd > 75) nextImage();
        if (touchStart - touchEnd < -75) prevImage();
    };

    const nextImage = () => setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    const prevImage = () => setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);

    return isMobile ? (
        <div className="relative w-full overflow-hidden">
            <div
                ref={carouselRef}
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {images.map((image, index) => (
                    <div key={image.id} className="w-full flex-shrink-0">
                        <img
                            src={image.src}
                            alt={image.alt}
                            className="w-full h-64 object-cover cursor-pointer"
                            onClick={() => setSelectedImage(image)}
                        />
                    </div>
                ))}
            </div>
            <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2"
                aria-label="Previous image"
            >
                <ChevronLeft size={24} />
            </button>
            <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2"
                aria-label="Next image"
            >
                <ChevronRight size={24} />
            </button>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
                        aria-label={`Go to image ${index + 1}`}
                    />
                ))}
            </div>
            {selectedImage && (
                <ImageLightbox
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    onClose={() => setSelectedImage(null)}
                />
            )}
        </div>
    ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((image) => (
                <div key={image.id} className="aspect-w-16 aspect-h-9">
                    <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover cursor-pointer rounded-lg"
                        onClick={() => setSelectedImage(image)}
                    />
                </div>
            ))}
            {selectedImage && (
                <ImageLightbox
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    onClose={() => setSelectedImage(null)}
                />
            )}
        </div>
    );
};

export default ImageGallery;
