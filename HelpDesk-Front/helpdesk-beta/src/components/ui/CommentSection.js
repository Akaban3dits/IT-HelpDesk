import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { 
    fetchComments, 
    createComment, 
    deleteComment 
} from '../../api/comments/commentService';
import { readToken } from '../../api/auth/authService';
import Comment from './Comment';
import Modal from './ModalComment';

const CommentsSection = ({ friendlyCode }) => {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);

    const fetchAndSetComments = async () => {
        try {
            setIsLoading(true);
            const data = await fetchComments(friendlyCode);
            setComments(data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const getUserFromToken = async () => {
            try {
                const decodedToken = await readToken();
                setCurrentUser(decodedToken);
            } catch (error) {
                console.error('Error reading token:', error);
            }
        };

        getUserFromToken();
        fetchAndSetComments();
    }, [friendlyCode]);

    const handleAddComment = async () => {
        if (comment.trim() !== '') {
            try {
                await createComment(friendlyCode, { comment_text: comment });
                await fetchAndSetComments();
                setComment('');
            } catch (error) {
                console.error('Error adding comment:', error);
            }
        }
    };

    const handleAddReply = async (parentCommentId, replyText) => {
        try {
            await createComment(friendlyCode, {
                comment_text: replyText,
                parent_comment_id: parentCommentId,
            });
            await fetchAndSetComments();
        } catch (error) {
            console.error('Error adding reply:', error);
        }
    };

    const promptDeleteComment = (commentId) => {
        setCommentToDelete(commentId);
        setIsModalOpen(true);
    };

    const handleDeleteComment = async () => {
        if (commentToDelete) {
            try {
                await deleteComment(commentToDelete);
                await fetchAndSetComments();
                setIsModalOpen(false);
                setCommentToDelete(null);
            } catch (error) {
                console.error('Error deleting comment:', error);
            }
        }
    };

    return (
        <div className="bg-gray-50 rounded-b-lg p-4 border-t border-gray-200">
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDeleteComment}
            />

            <h3 className="text-lg font-semibold text-gray-700 flex items-center space-x-2 mb-4">
                <MessageSquare className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <span>Chatea con un Encargado</span>
            </h3>

            <div className="mb-6">
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Añade un comentario..."
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                />
                <div className="flex justify-end mt-2">
                    <button
                        onClick={handleAddComment}
                        disabled={isLoading}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? 'Enviando...' : 'Enviar'}
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    <p className="text-gray-500 text-center">Cargando comentarios...</p>
                ) : comments.length > 0 ? (
                    comments.map((comment) => (
                        <Comment
                            key={comment.id}
                            {...comment}
                            onReply={(replyText) => handleAddReply(comment.id, replyText)}
                            onDelete={() => promptDeleteComment(comment.id)}
                            currentUserId={currentUser?.userId}
                        />
                    ))
                ) : (
                    <p className="text-gray-500">No hay comentarios.</p>
                )}
            </div>
        </div>
    );
};

export default CommentsSection;