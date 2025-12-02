import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function PokemonCardsBySets() {
  const { setId } = useParams();
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/cards/pokemon/cards/${setId}`)
      .then(res => res.json())
      .then(data => setCards(data))
      .catch(err => console.error(err));
  }, [setId]);

  return (
    <main>
      <Navbar />

      <div style={styles.body}>
        <div style={styles.grid}>
          {cards.map(card => (
            <div key={card.pokID} style={styles.card}>
              <img
                src={card.small_img}
                alt={card.card_name}
                style={styles.image}
              />
            </div>
          ))}
        </div>
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
  
