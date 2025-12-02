import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import AddCard from "../components/AddCard.jsx";

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [searchParams] = useSearchParams();
  const [selectedCard, setSelectedCard] = useState(null);
  const query = searchParams.get("q");
  const navigate = useNavigate();



  useEffect(() => {
    if (!query) return;

    const fetchCards = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/cards/search?q=${encodeURIComponent(query)}`
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
      <Navbar />
      <div style={styles.container}>
        {results.length === 0 ? (
          <p style={styles.noResults}>No cards found. Try searching above.</p>
        ) : (
          <div style={styles.grid}>
            {results.map((card) => (
              <div key={card.id} style={styles.card}>
                <img src={card.image} alt={card.name} style={styles.image} onClick={() => setSelectedCard(card)}/>
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedCard && (
          <AddCard
            card={selectedCard}
            onClose={() => setSelectedCard(null)}
          />
        )}
    </div>
  );
};

const styles = {
  container: {
    marginTop: "80px",
    margin: "1rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(178.5px, 178.5px))",
    gap: "0.4rem",
    justifyContent: "center",
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
