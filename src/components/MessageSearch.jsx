import React, { useState, useEffect } from "react";
import "./MessageSearch.css";

export default function MessageSearch({ messages, onSearchResult, isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (searchTerm.trim()) {
      const results = messages
        .map((msg, index) => ({ ...msg, originalIndex: index }))
        .filter(msg => 
          msg.message && 
          msg.message.toLowerCase().includes(searchTerm.toLowerCase())
        );
      setSearchResults(results);
      setSelectedIndex(0);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, messages]);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "Enter" && searchResults.length > 0) {
      handleResultClick(searchResults[selectedIndex]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < searchResults.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev > 0 ? prev - 1 : searchResults.length - 1
      );
    }
  };

  const handleResultClick = (result) => {
    onSearchResult(result.originalIndex);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="message-search-overlay" onClick={onClose}>
      <div className="message-search-modal" onClick={e => e.stopPropagation()}>
        <div className="search-header">
          <h3>Search Messages</h3>
          <button className="close-btn" onClick={onClose} aria-label="Close search">
            ✕
          </button>
        </div>
        
        <div className="search-input-container">
          <input
            type="text"
            className="search-input"
            placeholder="Type to search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <div className="search-icon">🔍</div>
        </div>

        {searchTerm && (
          <div className="search-results">
            {searchResults.length > 0 ? (
              <>
                <div className="results-count">
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                </div>
                <div className="results-list">
                  {searchResults.map((result, index) => (
                    <div
                      key={result.originalIndex}
                      className={`result-item ${index === selectedIndex ? 'selected' : ''}`}
                      onClick={() => handleResultClick(result)}
                    >
                      <div className="result-sender">
                        {result.sender === "AI" ? "🤖 AI" : "👤 You"}
                      </div>
                      <div className="result-message">
                        {result.message.length > 100 
                          ? `${result.message.substring(0, 100)}...` 
                          : result.message
                        }
                      </div>
                      <div className="result-time">
                        {new Date(result.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="no-results">
                No messages found for "{searchTerm}"
              </div>
            )}
          </div>
        )}

        <div className="search-footer">
          <div className="search-shortcuts">
            <span>↑↓ Navigate</span>
            <span>Enter Select</span>
            <span>Esc Close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
