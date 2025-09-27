import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTypewriter } from "../hooks/useTypewriter";
import "./ChatBubble.css";

export default function ChatBubble({ message, sender, buttons, isTyping, timestamp, enableTypewriter = true }) {
  const isAI = sender === "AI";
  const [isHovered, setIsHovered] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  
  // Use typewriter effect for AI messages
  const { displayText, isTyping: isTypewriterTyping } = useTypewriter(
    isAI && message && enableTypewriter ? message : null,
    25, // Speed: 25ms per character
    500  // Delay: 500ms before starting
  );

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Show buttons only after typewriter effect is complete
  useEffect(() => {
    if (isAI && buttons && !isTypewriterTyping && displayText === message) {
      const timer = setTimeout(() => {
        setShowButtons(true);
      }, 300); // Small delay after typewriter completes
      return () => clearTimeout(timer);
    } else if (!isAI) {
      setShowButtons(true);
    }
  }, [isAI, buttons, isTypewriterTyping, displayText, message]);

  // Reset buttons when message changes
  useEffect(() => {
    setShowButtons(false);
  }, [message]);

  return (
    <div 
      className={`chat-row ${isAI ? "ai" : "user"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`chat-bubble-container ${isAI ? "ai" : "user"}`}>
        {isAI && (
          <div className="avatar-small">
            <div className="avatar-icon-small">🤖</div>
          </div>
        )}
        
        <div className={`chat-bubble ${isAI ? "ai-bubble" : "user-bubble"}`}>
          {isTyping ? (
            <div className="typing-indicator">
              <div className="typing-dots">
                <span></span><span></span><span></span>
              </div>
              <span className="typing-text">AI is typing...</span>
            </div>
          ) : (
            <>
              <div className="message-content">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => <p className="markdown-p">{children}</p>,
                    code: ({ children }) => <code className="markdown-code">{children}</code>,
                    pre: ({ children }) => <pre className="markdown-pre">{children}</pre>,
                    ul: ({ children }) => <ul className="markdown-ul">{children}</ul>,
                    ol: ({ children }) => <ol className="markdown-ol">{children}</ol>,
                    li: ({ children }) => <li className="markdown-li">{children}</li>,
                    strong: ({ children }) => <strong className="markdown-strong">{children}</strong>,
                    em: ({ children }) => <em className="markdown-em">{children}</em>,
                  }}
                >
                  {isAI && enableTypewriter ? displayText : message}
                </ReactMarkdown>
                {isAI && enableTypewriter && isTypewriterTyping && (
                  <span className="typewriter-cursor">|</span>
                )}
              </div>
              
              {buttons && buttons.length > 0 && showButtons && (
                <div className="button-container">
                  {buttons.map((btn, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => btn.onClick()} 
                      className="quick-btn"
                      aria-label={`Quick reply: ${btn.label}`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              )}
              
              {timestamp && (
                <div className={`message-time ${isHovered ? "visible" : ""}`}>
                  {formatTime(timestamp)}
                </div>
              )}
            </>
          )}
        </div>
        
        {!isAI && (
          <div className="avatar-small user-avatar">
            <div className="avatar-icon-small">👤</div>
          </div>
        )}
      </div>
    </div>
  );
}
