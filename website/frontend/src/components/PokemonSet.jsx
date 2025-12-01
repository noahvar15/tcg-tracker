import React, { useEffect, useState } from "react";

export default function PokemonSet({ setId }) {
  const [setData, setSetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!setId) return;

    setLoading(true);
    setError(null);

    fetch(`http://127.0.0.1:5000/api/cards/pokemon/sets/${setId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setSetData(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [setId]);

  if (loading) return <p style={styles.loading}>Loading Pokémon set...</p>;
  if (error) return <p style={styles.error}>Error: {error}</p>;
  if (!setData) return <p style={styles.loading}>No data found.</p>;

  return (
    <div style={styles.card}>
      <img
        src={`/assets/${setId}.jpg`}
        alt={setData.name}
        style={styles.image}
        onError={(e) => {
          e.target.onerror = null; // Prevent infinite loop
          e.target.src = `/assets/base1.jpg`; // Fallback image
  }}
      />
      <div style={styles.textContainer}>
        <h2 style={styles.title}>{setData.name}</h2>
        <p style={styles.series}>{setData.series}</p>
      </div>
    </div>
  );
}

const styles = {
  card: {
    display: "flex",
    alignItems: "center",
    maxWidth: "600px",
    margin: "100px auto 20px auto",
    padding: "20px",
    borderRadius: "1rem",
    backgroundColor: "rgba(53, 53, 53, 0.6)",
    backdropFilter: "blur(10px)",
    color: "white",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
    fontFamily: "Arial, sans-serif",
    transition: "transform 0.2s, box-shadow 0.2s",
    width:"600px",
  },
  image: {
    maxWidth: "400px",
    height: "150px",
    borderRadius: "1rem",
    objectFit: "cover",
    marginRight: "20px",
    flexShrink: 0,
  },
  textContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  title: {
    margin: 0,
    marginBottom: "8px",
    fontSize: "1.5rem",
    color: "#ffcc00",
  },
  series: {
    margin: 0,
    fontSize: "1rem",
    color: "#f0f0f0",
  },
  loading: {
    textAlign: "center",
    marginTop: "120px",
    color: "white",
    fontSize: "1.2rem",
  },
  error: {
    textAlign: "center",
    marginTop: "120px",
    color: "red",
    fontSize: "1.2rem",
  },
};
