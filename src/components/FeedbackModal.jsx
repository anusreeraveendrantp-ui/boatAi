import React, { useState } from 'react';
import './FeedbackModal.css';

const FeedbackModal = ({ onSubmit, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please provide a rating before saving.');
      return;
    }
    onSubmit(rating, feedback);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Rate this Conversation</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-section">
            <label className="modal-label">How would you rate this conversation?</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${(hoverRating || rating) >= star ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  aria-label={`Rate ${star} out of 5`}
                >
                  ★
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="rating-label">
                {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]} ({rating}/5)
              </p>
            )}
          </div>

          <div className="modal-section">
            <label className="modal-label" htmlFor="feedback-text">
              Any additional feedback? (optional)
            </label>
            <textarea
              id="feedback-text"
              className="feedback-textarea"
              placeholder="Tell us what you think about this conversation..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="modal-cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="modal-submit-btn">
              Save Conversation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
