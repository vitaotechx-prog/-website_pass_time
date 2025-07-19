import React, { useState, useEffect } from 'react';
import { Comment } from '@/entities/Comment';
import { User } from '@/entities/User';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, MessageSquare, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Comments({ productId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkUserAndLoadComments = async () => {
            try {
                const currentUser = await User.me();
                setUser(currentUser);
            } catch (error) {
                setUser(null);
            }
            loadComments();
        };
        checkUserAndLoadComments();
    }, [productId]);

    const loadComments = async () => {
        setLoading(true);
        const response = await fetch('/api/comments/${productId}');
        const fetchedComments = await response.json();
        setComments(fetchedComments);
        setLoading(false);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;

        setSubmitting(true);
        try {
            await fetch('/api/comments/${productId}', {
                method: 'POST',
                headers : {'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        content: newComment,
                        user_name: user.full_name || 'Anônimo',
                    }),
                });
                setNewComment('');
                loadComments(); //Recarrega os comentarios
        } catch (error) {
            console.error('Erro ao enviar comentário:', error);
        }
        setSubmitting(false);
    };

    const addEmoji = (emoji) => {
        setNewComment(prev => prev + emoji);
    };

    return (
        <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-blue-600" />
                Comentários ({comments.length})
            </h3>

            {/* Comment Form */}
            {user ? (
                <form onSubmit={handleCommentSubmit} className="mb-8 p-4 border rounded-xl bg-gray-50">
                    <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Adicione seu comentário... 🎉"
                        className="mb-2 bg-white"
                        rows={3}
                    />
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            {['👍', '🔥', '🎉', '❤️', '😂'].map(emoji => (
                                <Button key={emoji} type="button" variant="ghost" size="icon" onClick={() => addEmoji(emoji)} className="text-xl">
                                    {emoji}
                                </Button>
                            ))}
                        </div>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            <span className="ml-2">Enviar</span>
                        </Button>
                    </div>
                </form>
            ) : (
                <div className="mb-8 p-6 border-2 border-dashed rounded-xl text-center">
                    <p className="mb-4 text-gray-600">Você precisa estar logado para comentar.</p>
                    <Button onClick={() => User.login()}>Fazer Login</Button>
                </div>
            )}

            {/* Comments List */}
            {loading ? (
                <div className="flex justify-center items-center h-24">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                </div>
            ) : (
                <div className="space-y-6">
                    <AnimatePresence>
                        {comments.length > 0 ? (
                            comments.map((comment, index) => (
                                <motion.div
                                    key={comment.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="flex gap-4 items-start"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center font-bold text-gray-600">
                                        {comment.user_name ? comment.user_name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <div className="flex-1 bg-white p-4 rounded-xl shadow-sm border">
                                        <div className="flex justify-between items-center mb-1">
                                            <p className="font-semibold text-gray-900">{comment.user_name}</p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(comment.created_date).toLocaleDateString('pt-BR')}
                                            </p>
                                        </div>
                                        <p className="text-gray-700">{comment.content}</p>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p>Nenhum comentário ainda. Seja o primeiro a comentar!</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}