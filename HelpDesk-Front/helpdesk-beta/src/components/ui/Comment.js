import React, { useState } from 'react';
import { Trash2, MessageSquare } from 'lucide-react';

const Comment = ({
    comment_text,
    created_at,
    first_name,
    last_name,
    user_id,
    replies = [],
    onReply,
    onDelete,
    currentUserId
}) => {
    const [isRepliesExpanded, setIsRepliesExpanded] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');

    const toggleRepliesExpansion = () => {
        setIsRepliesExpanded(!isRepliesExpanded);
        if (!isRepliesExpanded) setIsReplying(false);
    };

    const toggleReplying = () => {
        setIsReplying(!isReplying);
        if (!isReplying) setIsRepliesExpanded(false);
    };

    const handleReply = () => {
        if (replyText.trim()) {
            onReply(replyText);
            setReplyText('');
            setIsReplying(false);
        }
    };

    const canDelete = currentUserId === user_id || currentUserId === String(user_id);

    return (
        <div className="bg-white p-4 rounded-lg shadow mb-4 relative">
            {/* Header Row */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-blue-500" />
                    <h4 className="font-semibold text-blue-600">{`${first_name} ${last_name}`}</h4>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">{new Date(created_at).toLocaleString()}</span>
                    {canDelete && (
                        <button
                            onClick={() => onDelete()}
                            className="text-red-500 hover:text-red-700 transition-all p-1"
                            aria-label="Eliminar comentario"
                        >
                            <Trash2 className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Comment Text */}
            <p className="text-gray-700 mb-4">{comment_text}</p>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
                <button
                    onClick={toggleReplying}
                    className={`text-blue-500 hover:text-blue-700 font-medium ${isReplying ? 'underline' : ''}`}
                >
                    Responder
                </button>
                {replies.length > 0 && (
                    <button
                        onClick={toggleRepliesExpansion}
                        className={`text-blue-500 hover:text-blue-700 font-medium ${isRepliesExpanded ? 'underline' : ''}`}
                    >
                        {isRepliesExpanded ? 'Ocultar respuestas' : `Ver respuestas (${replies.length})`}
                    </button>
                )}
            </div>

            {/* Reply Form */}
            {isReplying && (
                <div className="mt-4">
                    <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Escribe tu respuesta..."
                        rows="3"
                    />
                    <div className="flex justify-end mt-2">
                        <button
                            onClick={handleReply}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                        >
                            Enviar
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

            {/* Recursive Replies */}
            {isRepliesExpanded && (
                <div className="ml-4 border-l-2 border-gray-300 pl-4 mt-4">
                    {replies.map((reply) => (
                        <Comment
                            key={reply.id}
                            {...reply}
                            onReply={(replyText) => onReply(replyText)}
                            onDelete={() => onDelete()}
                            currentUserId={currentUserId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Comment;
