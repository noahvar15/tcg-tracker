import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import AddCard from "../components/AddCard";

export default function MTGCardsBySets() {
  const { setCode } = useParams();
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/cards/mtg/cards/${setCode}`)
      .then(res => res.json())
      .then(data => setCards(data))
      .catch(err => console.error(err));
  }, [setCode]);

  return (
    <main>
        
      <Navbar />

      <div style={styles.body}>
        <div style={styles.grid}>
          {cards.map(card => (
            <div key={card.mtgID} style={styles.card}>
              <img
                src={card.image}
                alt={card.name}
                style={styles.image}
                onClick={() => setSelectedCard(card)}
              />
            </div>
          ))}
        </div>
        {selectedCard && (
          <AddCard
            card={selectedCard}
            onClose={() => setSelectedCard(null)}
          />
        )}
      </div>
    </main>
  );
}

const styles = {
    body: {
      marginTop: "15vh",
      padding: "1rem",
      paddingLeft: "4.5rem",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(5, 1fr)", 
      gap: "1rem",
      marginTop: "1rem",
    },
    card: {
      background: "#222",
      padding: "10px",
      borderRadius: "10px",
      textAlign: "center",
      color: "white",
    },
    image: {
      width: "100%",
      borderRadius: "10px",
    },

  };
  
