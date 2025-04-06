import React from "react";
import styles from "../styles/styles";

function SearchBox({ query, setQuery, fetchAnswer }) {
  return (
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
  );
}

export default SearchBox;