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
  const [sessionId] = useState(() => {
    // Generate new session ID on every page load/refresh
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log('✨ Created new session ID:', newSessionId);
    return newSessionId;
  });
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [latency, setLatency] = useState(0);
  const bottomRef = useRef(null);

  // Log session ID on mount
  useEffect(() => {
    console.log('📱 Chat Window mounted with session ID:', sessionId);
  }, [sessionId]);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Geolocation error:', error);
          // Set default location (San Francisco) if geolocation fails
          setLocation({
            latitude: 37.7749,
            longitude: -122.4194
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    } else {
      // Set default location if geolocation is not supported
      setLocation({
        latitude: 37.7749,
        longitude: -122.4194
      });
    }
  }, []);

  // Simulate connection status
  useEffect(() => {
    const interval = setInterval(() => {
      setIsOnline(Math.random() > 0.1); // 90% chance of being online
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Measure latency
  const measureLatency = async () => {
    const startTime = performance.now();
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
      const endTime = performance.now();
      setLatency(Math.round(endTime - startTime));
    } catch (error) {
      setLatency(0);
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    
    // Measure latency before sending
    await measureLatency();
    
    // Prepare message data with all required fields
    const messageData = {
      session_id: sessionId,
      latitude: location.latitude,
      longitude: location.longitude,
      coordinates: `${location.latitude},${location.longitude}`,
      latency: latency,
      message: text,
      timestamp: new Date().toISOString()
    };
    
    console.log('Sending message with data:', messageData);
    
    const userMessage = {
      id: Date.now(),
      sender: "User",
      message: text,
      timestamp: new Date(),
      metadata: messageData
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setAiTyping(true);

    // Simulate AI response with more realistic delay
    setTimeout(async () => {
      // Measure latency for AI response
      await measureLatency();
      
      const aiResponseData = {
        session_id: sessionId,
        latitude: location.latitude,
        longitude: location.longitude,
        coordinates: `${location.latitude},${location.longitude}`,
        latency: latency,
        message: generateAIResponse(text),
        timestamp: new Date().toISOString()
      };
      
      console.log('AI response with data:', aiResponseData);
      
      const aiResponse = {
        id: Date.now() + 1,
        sender: "AI",
        message: generateAIResponse(text),
        timestamp: new Date(),
        metadata: aiResponseData,
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

  const resetSession = () => {
    window.location.reload(); // Reload to generate new session ID
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
          <div className="session-info">
            <div className="session-id">Session: {sessionId.split('_')[1]}</div>
            <div className="location-info">
              📍 {location.latitude ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 'Getting location...'}
            </div>
            <div className="latency-info">
              ⚡ {latency}ms
            </div>
          </div>
          <button 
            className="action-btn" 
            onClick={resetSession}
            title="Reset session"
            aria-label="Reset session"
          >
            🔄
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
