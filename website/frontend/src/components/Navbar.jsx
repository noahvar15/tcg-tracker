import { useState } from "react";

const Navbar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) onSearch(query.trim());
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>TCG Tracker</div>
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search for a card..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          style={styles.searchInput}
        />
        <button onClick={handleSearch} style={styles.searchButton}>
          Search
        </button>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem 2rem",
    backgroundColor: "#222",
    color: "white",
    position: "sticky",
    top: 0,
    width: "95vw",
    gap: "2rem",
  },
  logo: { fontWeight: "bold", fontSize: "1.5rem" },
  searchContainer: { display: "flex", gap: "0.5rem" },
  searchInput: { padding: "0.5rem", borderRadius: "0.25rem", width: "300px" },
  searchButton: { padding: "0.5rem 1rem", borderRadius: "0.25rem", cursor: "pointer" },
};

export default Navbar;
