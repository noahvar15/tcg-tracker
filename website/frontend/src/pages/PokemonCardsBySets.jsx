import { useParams } from "react-router-dom";

export default function PokemonCardsBySets() {
  const { setId } = useParams();

  // Example: fetch cards
  useEffect(() => {
    fetch(`http://localhost:8000/api/cards/pokemon/cards/${setId}`)
      .then(res => res.json())
      .then(data => console.log(data));
  }, [setId]);

  return (
    <div>
      <h1>Cards for Set: {setId}</h1>
    </div>
  );
}
