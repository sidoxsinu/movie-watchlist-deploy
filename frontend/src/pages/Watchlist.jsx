import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import MediaCard from '../components/MediaCard';
import AddMediaModal from '../components/AddMediaModal';

const Watchlist = () => {
    const { logout } = useContext(AuthContext);
    const [mediaList, setMediaList] = useState([]);
    const [activeTab, setActiveTab] = useState('unwatched');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMedia = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get('media/');
            setMediaList(response.data);
        } catch (err) {
            setError('Failed to load media');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMedia();
    }, []);

    const handleUpdate = (updatedMedia) => {
        setMediaList(prev => prev.map(m => m.id === updatedMedia.id ? updatedMedia : m));
    };

    const handleDelete = (id) => {
        setMediaList(prev => prev.filter(m => m.id !== id));
    };

    const handleAdd = (newMedia) => {
        setMediaList(prev => [newMedia, ...prev]);
    };

    const displayedMedia = mediaList.filter(m => m.status === activeTab);

    return (
        <div className="layout-container">
            <header className="header">
                <h1>Watchlist</h1>
                <div className="header-actions">
                    <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>Add Media</button>
                    <button className="btn-secondary" onClick={logout}>Log Out</button>
                </div>
            </header>

            <div className="tabs">
                <button
                    className={`tab-button ${activeTab === 'unwatched' ? 'active' : ''}`}
                    onClick={() => setActiveTab('unwatched')}
                >
                    To Watch
                </button>
                <button
                    className={`tab-button ${activeTab === 'watched' ? 'active' : ''}`}
                    onClick={() => setActiveTab('watched')}
                >
                    Watched
                </button>
            </div>

            <main className="content">
                {isLoading ? (
                    <div className="loading-state">Loading...</div>
                ) : error ? (
                    <div className="error-alert">{error}</div>
                ) : displayedMedia.length === 0 ? (
                    <div className="empty-state">
                        {activeTab === 'unwatched'
                            ? 'Your watchlist is empty. Add a movie or show to get started.'
                            : 'Nothing watched yet. Your watched movies and shows will appear here.'}
                    </div>
                ) : (
                    <div className="media-grid">
                        {displayedMedia.map(media => (
                            <MediaCard
                                key={media.id}
                                media={media}
                                onUpdate={handleUpdate}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </main>

            {isAddModalOpen && (
                <AddMediaModal
                    onClose={() => setIsAddModalOpen(false)}
                    onAdd={handleAdd}
                />
            )}
        </div>
    );
};

export default Watchlist;
