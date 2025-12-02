import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const navigate = useNavigate();

  const handleSearch = (newQuery) => {
    navigate(`/search?q=${encodeURIComponent(newQuery)}`);
  };

  useEffect(() => {
    if (!query) return;

    const fetchCards = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/cards/mtg/search?q=${encodeURIComponent(query)}`
        );
        if (!response.ok) throw new Error("Failed to fetch cards.");

        const data = await response.json();
        setResults(data);
      } catch (err) {
        console.error(err);
        setResults([]);
      }
    };

    fetchCards();
  }, [query]);

  return (
    <div>
      <Navbar onSearch={handleSearch} />
      <div style={styles.container}>
        {results.length === 0 ? (
          <p style={styles.noResults}>No cards found. Try searching above.</p>
        ) : (
          <div style={styles.grid}>
            {results.map((card) => (
              <div key={card.id} style={styles.card}>
                <img src={card.image} alt={card.name} style={styles.image} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginTop: "80px",
    margin: "1rem",
    width: "100%",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(178.5px, 178.5px))",
    gap: "0.4rem",
  },
  image: {
    width: "178.5px",
    height: "250px",
  },
  noResults: {
    textAlign: "center",
    width: "100%",
  },
};

export default SearchResults;
