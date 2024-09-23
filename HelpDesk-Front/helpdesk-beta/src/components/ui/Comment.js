import React, { useState } from 'react';
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

const Comment = ({ author, date, content, imgSrc, replies = [] }) => {
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [showReplies, setShowReplies] = useState(false); // Para manejar la visibilidad de las respuestas
    const [replyText, setReplyText] = useState(''); // Para manejar el texto de la respuesta
    const [localReplies, setLocalReplies] = useState(replies); // Estado local para las respuestas
    const [isReplying, setIsReplying] = useState(false); // Controla si se está mostrando el área para responder

    const handleAddReply = () => {
        if (replyText.trim() !== '') {
            // Lógica para agregar una nueva respuesta
            const newReply = {
                id: new Date().getTime(),
                author: "Tú", // El nombre del usuario que responde
                date: new Date().toLocaleString(),
                content: replyText,
            };
            setLocalReplies([...localReplies, newReply]);
            setReplyText('');
            setIsReplying(false); // Ocultar el área de respuesta después de enviar
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow mb-4">
            <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-blue-600">{author}</span>
                <span className="text-sm text-gray-500">{date}</span>
            </div>
            <p className="text-gray-700">{content}</p>
            {imgSrc && (
                <div className="mt-4 flex justify-center">
                    <img 
                        src={imgSrc} 
                        alt={content} 
                        className="w-64 h-32 object-cover rounded-lg cursor-pointer" 
                        onClick={() => setIsLightboxOpen(true)}
                    />
                </div>
            )}
            {isLightboxOpen && (
                <ImageLightbox 
                    src={imgSrc} 
                    alt={content} 
                    onClose={() => setIsLightboxOpen(false)} 
                />
            )}

            {/* Mostrar las respuestas si existen */}
            {localReplies.length > 0 && (
                <div className="mt-4">
                    <button
                        onClick={() => setShowReplies(!showReplies)}
                        className="text-blue-500 text-sm"
                    >
                        {showReplies ? 'Ocultar Respuestas' : `Ver Respuestas (${localReplies.length})`}
                    </button>
                    {showReplies && (
                        <div className="mt-2 space-y-2">
                            {localReplies.map((reply) => (
                                <div key={reply.id} className="pl-4 border-l-2 border-gray-300">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-semibold text-blue-600">{reply.author}</span>
                                        <span className="text-sm text-gray-500">{reply.date}</span>
                                    </div>
                                    <p className="text-gray-700">{reply.content}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Botón para mostrar/ocultar el área de respuesta */}
            {!isReplying && (
                <button
                    onClick={() => setIsReplying(true)}
                    className="text-blue-600 hover:text-blue-800 font-semibold mt-4"
                >
                    Responder
                </button>
            )}

            {/* Input para agregar una respuesta (solo visible si se presiona "Responder") */}
            {isReplying && (
                <div className="mt-4">
                    <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Responder al comentario..."
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="2"
                    />
                    <div className="flex justify-end mt-2">
                        <button
                            onClick={handleAddReply}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                        >
                            Enviar Respuesta
                        </button>
                        <button
                            onClick={() => setIsReplying(false)}
                            className="ml-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Comment;
