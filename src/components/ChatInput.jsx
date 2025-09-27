import React, { useState, useRef, useEffect } from "react";
import "./ChatInput.css";

export default function ChatInput({ onSend, disabled = false }) {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSend(text);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  const handleEmojiClick = (emoji) => {
    setText(prev => prev + emoji);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  return (
    <div className="chat-input-container">
      <div className={`input-wrapper ${isFocused ? "focused" : ""} ${disabled ? "disabled" : ""}`}>
        <div className="input-actions">
          <button 
            className="action-button emoji-btn"
            onClick={() => handleEmojiClick("😊")}
            disabled={disabled}
            title="Add emoji"
            aria-label="Add emoji"
          >
            😊
          </button>
          <button 
            className="action-button emoji-btn"
            onClick={() => handleEmojiClick("👍")}
            disabled={disabled}
            title="Add thumbs up"
            aria-label="Add thumbs up"
          >
            👍
          </button>
          <button 
            className="action-button emoji-btn"
            onClick={() => handleEmojiClick("❤️")}
            disabled={disabled}
            title="Add heart"
            aria-label="Add heart"
          >
            ❤️
          </button>
        </div>
        
        <div className="input-field-container">
          <textarea
            ref={textareaRef}
            className="chat-input"
            placeholder={disabled ? "AI is offline..." : "Type a message... (Shift+Enter for new line)"}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            rows={1}
            maxLength={1000}
          />
          <div className="character-count">
            {text.length}/1000
          </div>
        </div>
        
        <button 
          className={`send-btn ${text.trim() ? "active" : ""}`}
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          title="Send message (Enter)"
          aria-label="Send message"
        >
          <span className="send-icon">➤</span>
        </button>
      </div>
      
      {disabled && (
        <div className="offline-indicator">
          <span className="offline-icon">⚠️</span>
          <span>AI is currently offline. Your messages will be sent when connection is restored.</span>
        </div>
      )}
    </div>
  );
}
