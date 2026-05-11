import React, { useState } from 'react';
import './ChatMessage.css';

const ChatMessage = ({ message, onFeedback }) => {
  const [hovered, setHovered] = useState(false);
  const isBot = message.type === 'bot';

  return (
    <div className={`message-wrapper ${isBot ? 'bot-wrapper' : 'user-wrapper'}`}>
      {isBot && (
        <div className="bot-avatar">🤖</div>
      )}

      <div
        className={`message-bubble ${isBot ? 'bot-bubble' : 'user-bubble'}`}
        onMouseEnter={() => isBot && setHovered(true)}
        onMouseLeave={() => isBot && setHovered(false)}
      >
        {isBot && (
          <span className="message-sender"><span>Soul AI</span></span>
        )}

        <p className="message-text">{message.text}</p>

        {isBot && onFeedback && (
          <div className={`feedback-buttons ${hovered || message.feedback ? 'visible' : ''}`}>
            <button
              className={`feedback-btn like-btn ${message.feedback === 'like' ? 'active' : ''}`}
              onClick={() => onFeedback(message.id, 'like')}
              title="Like this response"
            >
              👍
            </button>
            <button
              className={`feedback-btn dislike-btn ${message.feedback === 'dislike' ? 'active' : ''}`}
              onClick={() => onFeedback(message.id, 'dislike')}
              title="Dislike this response"
            >
              👎
            </button>
          </div>
        )}

        {isBot && !onFeedback && message.feedback && (
          <div className="feedback-readonly">
            {message.feedback === 'like' ? '👍' : '👎'}
          </div>
        )}
      </div>

      {!isBot && (
        <div className="user-avatar">👤</div>
      )}
    </div>
  );
};

export default ChatMessage;
