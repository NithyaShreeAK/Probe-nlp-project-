import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import styles from "../styles/styles";

function AIResponse({ aiResponse, loading, error, onRetry, keywords = [] }) {
  const [showSources, setShowSources] = useState(true);
  const [copied, setCopied] = useState(false);

  // Highlight function
  const highlightText = (text) => {
    if (!keywords.length || !text) return text;

    // Create a regular expression to match keywords in the response
    const regex = new RegExp(`(${keywords.join("|")})`, "gi");

    return text.split(regex).map((part, index) =>
      keywords.some(keyword => new RegExp(keyword, "gi").test(part)) ? (
        <span key={index} style={styles.highlightedText}>{part}</span>
      ) : (
        part
      )
    );
  };

  const handleCopy = () => {
    if (aiResponse?.answer) {
      navigator.clipboard.writeText(aiResponse.answer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
        {onRetry && (
          <div>
            <button style={styles.retryButton} onClick={onRetry}>
              🔄 Retry
            </button>
          </div>
        )}
      </div>
    );
  }

  if (!aiResponse || !aiResponse.answer) return null;

  return (
    <div style={styles.responseContainer}>
      <h3 style={styles.responseHeading}>🤖 AI Response</h3>

      <div style={styles.markdownContent}>
        <ReactMarkdown>{highlightText(aiResponse.answer)}</ReactMarkdown>
      </div>

      <button style={styles.copyButton} onClick={handleCopy}>
        📋 {copied ? "Copied!" : "Copy Response"}
      </button>

      {/* Sources */}
      {Array.isArray(aiResponse.sources) && aiResponse.sources.length > 0 && (
        <div style={styles.sourcesContainer}>
          <h4 style={styles.suggestionsHeading}>
            🌐 Sources
            <button style={styles.toggleButton} onClick={() => setShowSources(!showSources)}>
              {showSources ? "🔽 Hide" : "🔼 Show"}
            </button>
          </h4>

          {showSources && (
            <ol style={styles.sourcesList}>
              {aiResponse.sources.map((source, index) => (
                <li key={index} style={styles.sourceItem}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer" style={styles.sourceLink}>
                    {source.title} — <small>Rank: {source.rank}, Score: {source.score}</small>
                  </a>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}

export default AIResponse;