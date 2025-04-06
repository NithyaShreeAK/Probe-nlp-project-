const styles = {
  /** ---------- Main Container ---------- */
  container: {
    textAlign: "center",
    marginTop: "50px",
    fontFamily: "'Inter', sans-serif",
    padding: "0 24px",
    color: "#222",
  },

  /** ---------- Search Box ---------- */
  searchBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "14px",
    marginBottom: "30px",
  },
  input: {
    padding: "16px 20px",
    width: "360px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    outline: "none",
    fontSize: "16px",
    transition: "all 0.3s ease",
    backgroundColor: "#fff",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.06)",
  },
  inputFocus: {
    borderColor: "#007bff",
    boxShadow: "0px 0px 10px rgba(0, 123, 255, 0.5)",
  },
  searchButton: {
    padding: "14px 22px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #007bff, #0056b3)",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(0, 123, 255, 0.3)",
  },
  searchButtonHover: {
    transform: "scale(1.07)",
    boxShadow: "0 5px 15px rgba(0, 123, 255, 0.4)",
  },

  /** ---------- AI Response Styling ---------- */
  responseContainer: {
    marginTop: "35px",
    padding: "28px",
    border: "1px solid #ddd",
    borderRadius: "14px",
    background: "rgba(255, 255, 255, 0.97)",
    backdropFilter: "blur(10px)",
    maxWidth: "820px",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "left",
    boxShadow: "0 5px 18px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease-in-out",
  },
  responseHeading: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#222",
    marginBottom: "12px",
  },
  markdownContent: {
    fontSize: "17px",
    lineHeight: "1.75",
    color: "#333",
  },
  copyButton: {
    marginTop: "18px",
    padding: "12px 18px",
    background: "#007bff",
    color: "#fff",
    borderRadius: "10px",
    fontSize: "15px",
    cursor: "pointer",
    border: "none",
    transition: "background 0.3s ease",
  },
  copyButtonHover: {
    background: "#0056b3",
  },

    historyContainer: {
      marginTop: "30px",
      padding: "20px",
      borderRadius: "12px",
      background: "#ffffff",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
      maxWidth: "600px",
      marginLeft: "auto",
      marginRight: "auto",
      transition: "all 0.3s ease-in-out",
    },
    historyTitle: {
      fontSize: "20px",
      fontWeight: "600",
      color: "#222",
      borderBottom: "2px solid #f0f0f0",
      paddingBottom: "8px",
      marginBottom: "16px",
      textAlign: "center",
    },
    historyList: {
      listStyleType: "none",
      padding: "0",
      margin: "0",
      maxHeight: "250px",
      overflowY: "auto",
    },
    historyItemWrapper: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 16px",
      backgroundColor: "#f3f7ff",
      borderRadius: "10px",
      marginBottom: "8px",
      cursor: "pointer",
      transition: "background 0.3s ease, transform 0.2s",
      fontSize: "16px",
      fontWeight: "500",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
    },
    historyItemWrapperHover: {
      backgroundColor: "#e2ebff",
      transform: "scale(1.02)",
    },
    historyItemText: {
      flex: 1,
      fontSize: "15px",
      color: "#333",
      fontWeight: "500",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    removeButton: {
      fontSize: "16px",
      color: "#ff4d4f",
      background: "transparent",
      border: "none",
      cursor: "pointer",
      transition: "color 0.3s ease, transform 0.2s",
    },
    removeButtonHover: {
      color: "#d9363e",
      transform: "scale(1.1)",
    },


  /** ---------- Sources Section ---------- */
  sourcesContainer: {
    marginTop: "25px",
    padding: "18px",
    backgroundColor: "#eef5ff",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
  },
  sourcesHeading: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#0056b3",
  },
  sourcesList: {
    paddingLeft: "22px",
    lineHeight: "1.6",
  },
  sourceItem: {
    marginBottom: "10px",
  },
  sourceLink: {
    color: "#007bff",
    textDecoration: "none",
    fontSize: "16px",
    transition: "color 0.3s",
  },
  sourceLinkHover: {
    textDecoration: "underline",
    color: "#0056b3",
  },
  toggleButton: {
    marginLeft: "12px",
    padding: "6px 10px",
    fontSize: "13px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
  toggleButtonHover: {
    backgroundColor: "#0056b3",
  },

  /** ---------- Loading Spinner ---------- */
  loadingContainer: {
    textAlign: "center",
    padding: "22px",
    fontSize: "17px",
    color: "#333",
  },
  loadingText: {
    fontSize: "17px",
    fontWeight: "bold",
    marginTop: "12px",
  },
  spinner: {
    width: "32px",
    height: "32px",
    border: "4px solid rgba(0, 123, 255, 0.3)",
    borderTop: "4px solid #007bff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  /** ---------- Error Styling ---------- */
  errorContainer: {
    textAlign: "center",
    color: "red",
    padding: "16px",
    fontSize: "17px",
  },
  retryButton: {
    marginTop: "12px",
    padding: "10px 16px",
    fontSize: "15px",
    backgroundColor: "#dc3545",
    color: "#fff",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
  retryButtonHover: {
    backgroundColor: "#a71d2a",
  },

  /** ---------- Dark Mode ---------- */
  darkMode: {
    backgroundColor: "#1e1e1e",
    color: "#e0e0e0",
  },
};

export default styles;