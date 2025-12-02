import { useParams } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar";

export default function PokemonCardsBySets() {
  const { setId } = useParams();

  // Example: fetch cards
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/cards/pokemon/cards/${setId}`)
      .then(res => res.json())
      .then(data => console.log(data));
  }, [setId]);

  return (
    <main>
        <Navbar />
        <div style={styles.body}>
            <h1>Cards for Set: {setId}</h1>
        </div>
    </main>
  );
}

const styles = {
    body: {
       marginTop: '15vh',
    }
 }