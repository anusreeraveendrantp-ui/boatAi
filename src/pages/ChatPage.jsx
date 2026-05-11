import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import sampleData from '../data/sampleData';
import ChatMessage from '../components/ChatMessage';
import FeedbackModal from '../components/FeedbackModal';
import './ChatPage.css';

const ChatPage = () => {
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('botai_conversations');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentMessages, setCurrentMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [activeConvIndex, setActiveConvIndex] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  useEffect(() => {
    localStorage.setItem('botai_conversations', JSON.stringify(conversations));
  }, [conversations]);

  const getAIResponse = (question) => {
    const key = question.toLowerCase().trim();
    return sampleData[key] || "Sorry, Did not understand your query!";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: input.trim(),
      timestamp: new Date().toISOString(),
    };

    const aiResponse = {
      id: Date.now() + 1,
      type: 'bot',
      text: getAIResponse(input.trim()),
      timestamp: new Date().toISOString(),
      feedback: null, // 'like' | 'dislike' | null
    };

    setCurrentMessages((prev) => [...prev, userMessage, aiResponse]);
    setInput('');
  };

  const handleLikeDislike = (messageId, feedbackType) => {
    setCurrentMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, feedback: msg.feedback === feedbackType ? null : feedbackType }
          : msg
      )
    );
  };

  const handleSave = () => {
    if (currentMessages.length === 0) return;
    setShowFeedbackModal(true);
  };

  const handleFeedbackSubmit = (rating, subjectiveFeedback) => {
    const newConversation = {
      id: Date.now(),
      messages: currentMessages,
      rating,
      subjectiveFeedback,
      savedAt: new Date().toISOString(),
      title: currentMessages[0]?.text?.slice(0, 40) || 'Conversation',
    };
    setConversations((prev) => [newConversation, ...prev]);
    setCurrentMessages([]);
    setShowFeedbackModal(false);
    setActiveConvIndex(null);
  };

  const handleNewChat = () => {
    setCurrentMessages([]);
    setActiveConvIndex(null);
  };

  const handleLoadConversation = (index) => {
    setActiveConvIndex(index);
    setCurrentMessages(conversations[index].messages);
  };

  const isViewingHistory = activeConvIndex !== null;

  return (
    <div className="chat-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="logo-text">Bot AI</span>
        </div>

        <button className="new-chat-btn" onClick={handleNewChat}>
          + New Chat
        </button>

        <div className="sidebar-section-title">Recent Conversations</div>

        <div className="conversation-list">
          {conversations.length === 0 && (
            <p className="no-conv-text">No saved conversations yet.</p>
          )}
          {conversations.map((conv, index) => (
            <div
              key={conv.id}
              className={`conv-item ${activeConvIndex === index ? 'active' : ''}`}
              onClick={() => handleLoadConversation(index)}
            >
              <span className="conv-icon">💬</span>
              <span className="conv-title">{conv.title}</span>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <button className="history-btn" onClick={() => navigate('/history')}>
            Past Conversations
          </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="chat-main">
        <div className="chat-header">
          <span className="chat-header-title">
            <span className="soul-ai-label"><span>Soul AI</span></span>
          </span>
          {!isViewingHistory && currentMessages.length > 0 && (
            <button
              type="button"
              className="save-btn"
              onClick={handleSave}
            >
              Save
            </button>
          )}
          {isViewingHistory && (
            <div className="history-feedback-badge">
              <span>⭐ {conversations[activeConvIndex]?.rating}/5</span>
            </div>
          )}
        </div>

        <div className="messages-container">
          {currentMessages.length === 0 && !isViewingHistory && (
            <div className="empty-state">
              <div className="empty-icon">🤖</div>
              <h2>How can I help you today?</h2>
              <p>Ask me anything — I'm here to assist!</p>
            </div>
          )}

          {currentMessages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              onFeedback={!isViewingHistory ? handleLikeDislike : null}
            />
          ))}

          {isViewingHistory && conversations[activeConvIndex] && (
            <div className="history-feedback-summary">
              <h4>Conversation Feedback</h4>
              <p><strong>Rating:</strong> {'⭐'.repeat(conversations[activeConvIndex].rating)} ({conversations[activeConvIndex].rating}/5)</p>
              {conversations[activeConvIndex].subjectiveFeedback && (
                <p><strong>Comments:</strong> {conversations[activeConvIndex].subjectiveFeedback}</p>
              )}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {!isViewingHistory && (
          <form className="chat-input-form" onSubmit={handleSubmit}>
            <input
              type="text"
              className="chat-input"
              placeholder="Message Bot AI…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="ask-btn">
              Ask
            </button>
          </form>
        )}
      </main>

      {showFeedbackModal && (
        <FeedbackModal
          onSubmit={handleFeedbackSubmit}
          onClose={() => setShowFeedbackModal(false)}
        />
      )}
    </div>
  );
};

export default ChatPage;
