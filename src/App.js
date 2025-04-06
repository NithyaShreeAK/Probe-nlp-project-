import React, { useState } from "react";
import axios from "axios";
import SearchBox from "./components/SearchBox";
import SearchHistory from "./components/SearchHistory";
import AIResponse from "./components/AIResponse";
import styles from "./styles/styles";

function App() {
  const [query, setQuery] = useState("");
  const [aiResponse, setAiResponse] = useState(null);
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [errorAnswer, setErrorAnswer] = useState("");

  const [searchHistory, setSearchHistory] = useState(
    JSON.parse(localStorage.getItem("searchHistory")) || []
  );

  const fetchAnswer = async () => {
    if (query.trim() === "") return;

    setLoadingAnswer(true);
    setErrorAnswer("");

    try {
      const response = await axios.get(`http://127.0.0.1:8000/answer_with_sources?q=${encodeURIComponent(query)}`);
      setAiResponse(response.data);

      const updatedHistory = [query, ...searchHistory.filter((item) => item !== query)].slice(0, 10);
      setSearchHistory(updatedHistory);
      localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setErrorAnswer("❌ Failed to fetch answer. Please check your internet connection.");
    }

    setLoadingAnswer(false);
  };

  return (
    <div style={styles.container}>
      <h1>Probe</h1>

      <SearchBox query={query} setQuery={setQuery} fetchAnswer={fetchAnswer} />

      <SearchHistory history={searchHistory} setQuery={setQuery} />

      <AIResponse aiResponse={aiResponse} loading={loadingAnswer} error={errorAnswer} />
    </div>
  );
}

export default App;