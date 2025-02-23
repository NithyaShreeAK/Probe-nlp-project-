import React, { useState } from "react";
import axios from "axios";

function App() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = async (input) => {
    setQuery(input);
    if (input.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(`http://127.0.0.1:8000/search?q=${input}`);
      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Smart Search Engine</h1>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => fetchSuggestions(e.target.value)}
        style={{ padding: "10px", width: "300px" }}
      />
      <ul>
        {suggestions.map((suggestion, index) => (
          <li key={index}>{suggestion}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;