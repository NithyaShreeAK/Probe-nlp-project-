import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [errorSuggestions, setErrorSuggestions] = useState("");

  const [aiResponse, setAiResponse] = useState(null);
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [errorAnswer, setErrorAnswer] = useState("");

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      fetchSuggestions(query);
    }, 300); // Debounce API calls

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const fetchSuggestions = async (input) => {
    setLoadingSuggestions(true);
    setErrorSuggestions("");

    try {
      const response = await axios.get(`http://127.0.0.1:8000/search?q=${input}`, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Suggestions API Response:", response.data);
      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setErrorSuggestions("Failed to load suggestions. Try again.");
    }

    setLoadingSuggestions(false);
  };

  const fetchAnswer = async () => {
    if (query.trim() === "") return;

    setLoadingAnswer(true);
    setAiResponse(null);
    setErrorAnswer("");

    try {
      const response = await axios.get(`http://127.0.0.1:8000/answer_with_sources?q=${query}`, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("AI Response:", response.data);
      setAiResponse(response.data);
    } catch (error) {
      console.error("Error fetching AI answer:", error);
      setErrorAnswer("Failed to fetch the answer. Try again.");
    }

    setLoadingAnswer(false);
  };

  return (
    <div style={styles.container}>
      <h1>Smart Search Engine</h1>

      {/* Search Input */}
      <div style={styles.searchBox}>
        <input
          type="text"
          placeholder="Search anything..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={styles.input}
        />
        <button onClick={fetchAnswer} style={styles.searchButton}>
          🔍
        </button>
      </div>

      {/* Suggestions */}
      {loadingSuggestions && <p>Loading suggestions...</p>}
      {errorSuggestions && <p style={{ color: "red" }}>{errorSuggestions}</p>}
      <ul style={styles.suggestionsList}>
        {suggestions.map((suggestion, index) => (
          <li key={index} style={styles.suggestionItem} onClick={() => setQuery(suggestion)}>
            {suggestion}
          </li>
        ))}
      </ul>

      {/* AI Response */}
      {loadingAnswer && <p>Fetching answer...</p>}
      {errorAnswer && <p style={{ color: "red" }}>{errorAnswer}</p>}

      {aiResponse && (
        <div style={styles.responseContainer}>
          <h3>AI Answer:</h3>
          <p style={styles.answer}>{aiResponse.answer}</p>

          {/* Sources / Citations */}
          {aiResponse.sources.length > 0 && (
            <div style={styles.sourcesContainer}>
              <h4>Sources:</h4>
              <ul>
                {aiResponse.sources.map((source, index) => (
                  <li key={index}>
                    <a href={source.url} target="_blank" rel="noopener noreferrer">
                      {source.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { textAlign: "center", marginTop: "50px", fontFamily: "Arial, sans-serif" },
  searchBox: { display: "flex", justifyContent: "center", marginBottom: "20px" },
  input: {
    padding: "10px",
    width: "300px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  searchButton: {
    padding: "10px",
    borderRadius: "5px",
    marginLeft: "10px",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
  },
  suggestionsList: { listStyleType: "none", padding: 0, marginTop: "10px" },
  suggestionItem: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    cursor: "pointer",
    backgroundColor: "#f8f9fa",
  },
  responseContainer: {
    marginTop: "20px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    backgroundColor: "#f9f9f9",
  },
  answer: { fontSize: "16px", lineHeight: "1.5" },
  sourcesContainer: { marginTop: "15px" },
};

export default App;