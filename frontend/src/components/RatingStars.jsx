import React from 'react';

const RatingStars = ({ rating, onRate, isLoading }) => {
    return (
        <div className="rating-stars" role="group" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={isLoading}
                    onClick={() => onRate(star)}
                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                    className={`star-button ${rating >= star ? 'active' : ''}`}
                >
                    ★
                </button>
            ))}
        </div>
    );
};

export default RatingStars;
