import React, { useState } from 'react';
import RatingStars from './RatingStars';
import api from '../api/axios';

const MediaCard = ({ media, onUpdate, onDelete }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleMarkWatched = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.patch(`media/${media.id}/`, { status: 'watched' });
            onUpdate(response.data);
        } catch (err) {
            setError('Failed to update status');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleMoveToWatch = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.patch(`media/${media.id}/`, { status: 'unwatched', rating: null });
            onUpdate(response.data);
        } catch (err) {
            setError('Failed to update status');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRate = async (newRating) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.patch(`media/${media.id}/`, { rating: newRating });
            onUpdate(response.data);
        } catch (err) {
            setError('Failed to update rating');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        setError(null);
        try {
            await api.delete(`media/${media.id}/`);
            onDelete(media.id);
        } catch (err) {
            setError('Failed to delete media');
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    return (
        <div className="media-card">
            <div className="media-info">
                <h3 className="media-title">{media.title}</h3>
                <span className="media-type">{media.type === 'movie' ? 'Movie' : 'TV'}</span>
            </div>

            {error && <div className="error-text">{error}</div>}

            <div className="media-actions">
                {media.status === 'watched' && (
                    <div className="rating-container">
                        <RatingStars rating={media.rating || 0} onRate={handleRate} isLoading={isLoading} />
                    </div>
                )}

                <div className="button-group">
                    {media.status === 'unwatched' ? (
                        <button className="btn-primary" onClick={handleMarkWatched} disabled={isLoading}>
                            {isLoading ? 'Updating...' : 'Mark as Watched'}
                        </button>
                    ) : (
                        <button className="btn-secondary" onClick={handleMoveToWatch} disabled={isLoading}>
                            Move to To Watch
                        </button>
                    )}

                    {!showDeleteConfirm ? (
                        <button className="btn-danger" onClick={() => setShowDeleteConfirm(true)} disabled={isLoading}>
                            Delete
                        </button>
                    ) : (
                        <div className="delete-confirm">
                            <span>Delete "{media.title}"? This action cannot be undone.</span>
                            <div className="confirm-buttons">
                                <button className="btn-secondary" onClick={() => setShowDeleteConfirm(false)} disabled={isDeleting}>Cancel</button>
                                <button className="btn-danger" onClick={handleDelete} disabled={isDeleting}>
                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MediaCard;
