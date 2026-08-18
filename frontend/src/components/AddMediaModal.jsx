import React, { useState } from 'react';
import api from '../api/axios';

const AddMediaModal = ({ onClose, onAdd }) => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState('movie');
    const [status, setStatus] = useState('unwatched');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            setError('Title is required');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await api.post('media/', { title, type, status });
            onAdd(response.data);
            onClose();
        } catch (err) {
            setError('Failed to add media');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Add Media</h2>
                <form onSubmit={handleSubmit}>
                    {error && <div className="error-text">{error}</div>}
                    
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="type">Type</label>
                        <select id="type" value={type} onChange={(e) => setType(e.target.value)} disabled={isLoading}>
                            <option value="movie">Movie</option>
                            <option value="tv">TV</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="status">Initial Status</label>
                        <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} disabled={isLoading}>
                            <option value="unwatched">Unwatched</option>
                            <option value="watched">Watched</option>
                        </select>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={isLoading}>
                            {isLoading ? 'Adding...' : 'Add'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMediaModal;
