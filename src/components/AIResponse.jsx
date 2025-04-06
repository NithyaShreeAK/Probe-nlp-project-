import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import styles from "../styles/styles";

function AIResponse({ aiResponse, loading, error, onRetry }) {
  const [showSources, setShowSources] = useState(true);
  const [copied, setCopied] = useState(false);

  // Copy AI response to clipboard with toast notification
  const handleCopy = () => {
    if (aiResponse?.answer) {
      navigator.clipboard.writeText(aiResponse.answer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Hide after 2 seconds
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div className="spinner"></div>
        <p style={styles.loadingText}>⏳ Fetching answer...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        ⚠️ {error}
        <br />
        {onRetry && (
          <button style={styles.retryButton} onClick={onRetry}>
            🔄 Retry
          </button>
        )}
      </div>
    );
  }

  if (!aiResponse || !aiResponse.answer) return null;

  return (
    <div style={styles.responseContainer}>
      <h3 style={styles.responseHeading}>🤖 AI Response</h3>

      <div style={styles.markdownContent}>
        <ReactMarkdown>{aiResponse.answer}</ReactMarkdown>
      </div>

      {/* Copy Button with Feedback */}
      <button style={styles.copyButton} onClick={handleCopy}>
        📋 {copied ? "Copied!" : "Copy Response"}
      </button>

      {/* Toggle Sources */}
      {Array.isArray(aiResponse.sources) && aiResponse.sources.length > 0 && (
        <div style={styles.sourcesContainer}>
          <h4 style={styles.suggestionsHeading}>
            🌐 Sources
            <button style={styles.toggleButton} onClick={() => setShowSources(!showSources)}>
              {showSources ? "⬆ Hide" : "⬇ Show"}
            </button>
          </h4>

          {showSources && (
            <ul style={styles.sourcesList}>
              {aiResponse.sources.map((source, index) => (
                <li key={index} style={styles.sourceItem}>
                  [{index + 1}]{" "}
                  <a href={source.url} target="_blank" rel="noopener noreferrer" style={styles.sourceLink}>
                    {source.title}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default AIResponse;