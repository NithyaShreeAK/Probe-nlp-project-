import React, { useEffect, useState } from "react";
import styles from "../styles/styles";

function SearchHistory({ setQuery }) {
  const [history, setHistory] = useState([]);

  // Load history from local storage
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setHistory(savedHistory);
  }, []);

  // Remove a specific item from history
  const clearHistoryItem = (itemToRemove) => {
    const updatedHistory = history.filter((item) => item !== itemToRemove);
    setHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
  };

  // Handle item removal safely
  const handleRemove = (event, item) => {
    event.stopPropagation(); // Prevent triggering `setQuery(item)`
    clearHistoryItem(item);
  };

  if (!history.length) return null; // Hide if empty

  return (
    <div style={styles.historyContainer}>
      <h4 style={styles.historyTitle}>Recent Searches</h4>
      <div style={styles.historyList}>
        {history.map((item, index) => (
          <div
            key={index}
            style={styles.historyItemWrapper}
            onClick={() => setQuery(item)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setQuery(item)}
          >
            <span style={styles.historyItemText}>{item}</span>
            <button
              style={styles.removeButton}
              onClick={(e) => handleRemove(e, item)}
              aria-label={`Remove ${item}`}
            >
              ❌
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchHistory;