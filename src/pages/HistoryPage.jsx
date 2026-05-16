import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HistoryPage.css';

const HistoryPage = () => {
  const [filterRating, setFilterRating] = useState('all');

  // Read saved conversations and merge in any active (unsaved) session
  const savedConversations = JSON.parse(localStorage.getItem('botai_conversations') || '[]');
  const activeSession = JSON.parse(localStorage.getItem('botai_active_session') || 'null');

  // Merge: active session goes first if not already in saved list
  const allConversations = activeSession
    ? [
        activeSession,
        ...savedConversations.filter((c) => c.id !== activeSession.id),
      ]
    : savedConversations;

  const conversations = allConversations;

  const filtered = filterRating === 'all'
    ? conversations
    : conversations.filter((c) => String(c.rating) === String(filterRating));

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const getLikeCount = (messages) =>
    messages.filter((m) => m.type === 'bot' && m.feedback === 'like').length;

  const getDislikeCount = (messages) =>
    messages.filter((m) => m.type === 'bot' && m.feedback === 'dislike').length;

  return (
    <div className="history-layout">
      <header className="history-header">
        <Link to="/" className="back-btn">
          ← Back to Chat
        </Link>
        <h1 className="history-title">Past Conversations</h1>
        <div className="filter-group">
          <label className="filter-label">Filter by Rating:</label>
          <select
            className="filter-select"
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
          >
            <option value="all">All Ratings</option>
            <option value="5">⭐⭐⭐⭐⭐ (5)</option>
            <option value="4">⭐⭐⭐⭐ (4)</option>
            <option value="3">⭐⭐⭐ (3)</option>
            <option value="2">⭐⭐ (2)</option>
            <option value="1">⭐ (1)</option>
          </select>
        </div>
      </header>

      <div className="history-content">
        {filtered.length === 0 && (
          <div className="no-history">
            <div className="no-history-icon">📭</div>
            <h3>No conversations found</h3>
            <p>
              {filterRating === 'all'
                ? 'Start a chat and save it to see it here.'
                : `No conversations with a ${filterRating}-star rating.`}
            </p>
          </div>
        )}

        {filtered.map((conv) => (
          <div key={conv.id} className="history-card">
            <div className="history-card-header">
              <div className="history-card-meta">
                <span className="history-card-title">{conv.title}</span>
                <span className="history-card-date">{formatDate(conv.savedAt)}</span>
              </div>
              <div className="history-card-stats">
                <span className="stat-badge like-badge">
                  👍 {getLikeCount(conv.messages)}
                </span>
                <span className="stat-badge dislike-badge">
                  👎 {getDislikeCount(conv.messages)}
                </span>
                <span className="stat-badge rating-badge">
                  ⭐ {conv.rating}/5
                </span>
              </div>
            </div>

            <div className="history-messages">
              {conv.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`history-msg ${msg.type === 'user' ? 'user-msg' : 'bot-msg'}`}
                >
                  <span className="msg-sender">
                    {msg.type === 'user' ? 'You' : <span>Soul AI</span>}
                  </span>
                  <p className="msg-text">{msg.text}</p>
                  {msg.type === 'bot' && msg.feedback && (
                    <span className={`msg-feedback ${msg.feedback}`}>
                      {msg.feedback === 'like' ? '👍' : '👎'}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {conv.subjectiveFeedback && (
              <div className="history-card-feedback">
                <strong>Feedback:</strong> {conv.subjectiveFeedback}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;
