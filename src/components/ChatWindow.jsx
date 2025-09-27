import React, { useState, useRef, useEffect } from "react";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import "./ChatWindow.css";

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [aiTyping, setAiTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [typewriterEnabled, setTypewriterEnabled] = useState(true);
  const bottomRef = useRef(null);

  // Simulate connection status
  useEffect(() => {
    const interval = setInterval(() => {
      setIsOnline(Math.random() > 0.1); // 90% chance of being online
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      sender: "User",
      message: text,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setAiTyping(true);

    // Simulate AI response with more realistic delay
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        sender: "AI",
        message: generateAIResponse(text),
        timestamp: new Date(),
        buttons: [
          { 
            label: "👍 Helpful", 
            onClick: () => handleQuickReply("Thanks, that was helpful!") 
          },
          { 
            label: "❓ More info", 
            onClick: () => handleQuickReply("Can you tell me more?") 
          },
          { 
            label: "🔄 Different approach", 
            onClick: () => handleQuickReply("Can you suggest a different approach?") 
          },
        ],
      };
      setMessages((prev) => [...prev, aiResponse]);
      setAiTyping(false);
    }, 800 + Math.random() * 500); // Reduced delay since typewriter effect handles the timing
  };

  const generateAIResponse = (userText) => {
    const responses = [
      `I understand you're asking about "${userText}". Let me help you with that.`,
      `That's an interesting question about "${userText}". Here's what I think:`,
      `Great point about "${userText}"! Based on my knowledge, I'd suggest:`,
      `Regarding "${userText}", I can provide some insights that might be helpful.`,
      `I see you're interested in "${userText}". This is a common topic, and here's my perspective:`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleQuickReply = (choice) => {
    sendMessage(choice);
  };

  const clearChat = () => {
    setMessages([]);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiTyping]);

  return (
    <div className={`chat-window ${darkMode ? "dark" : "light"}`}>
      {/* Header */}
      <div className="chat-header">
        <div className="header-left">
          <div className="avatar">
            <div className="avatar-icon">🤖</div>
          </div>
          <div className="header-info">
            <h1>Frontline Worker Assistant</h1>
            <div className="status">
              <div className={`status-indicator ${isOnline ? "online" : "offline"}`}></div>
              <span>{isOnline ? "Online" : "Offline"}</span>
            </div>
          </div>
        </div>
        <div className="header-actions">
          <button 
            className="action-btn" 
            onClick={clearChat}
            title="Clear chat"
            aria-label="Clear chat"
          >
            🗑️
          </button>
          <button 
            className="action-btn" 
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="welcome-message">
            <div className="welcome-content">
              <h2>👋 Welcome to Frontline Worker Assistant</h2>
              <p>I'm here to help you with your work tasks and questions. How can I assist you today?</p>
              <div className="quick-start-buttons">
                <button 
                  className="quick-start-btn"
                  onClick={() => sendMessage("What can you help me with?")}
                >
                  What can you help me with?
                </button>
                <button 
                  className="quick-start-btn"
                  onClick={() => sendMessage("Show me some examples")}
                >
                  Show me some examples
                </button>
              </div>
            </div>
          </div>
        )}
        
        {messages.map((msg) => (
          <ChatBubble key={msg.id} {...msg} />
        ))}
        
        {aiTyping && <ChatBubble sender="AI" isTyping={true} />}
        <div ref={bottomRef}></div>
      </div>

      {/* Input Area */}
      <ChatInput onSend={sendMessage} disabled={!isOnline} />
    </div>
  );
}
