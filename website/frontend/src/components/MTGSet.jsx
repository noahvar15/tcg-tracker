import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function MTGSet({ setCode }) {
  const [setData, setSetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!setCode) return;

    setLoading(true);
    setError(null);

    fetch(`http://127.0.0.1:5000/api/cards/mtg/sets/${setCode}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setSetData(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [setCode]);

  if (loading) return <p style={styles.loading}>Loading MTG set...</p>;
  if (error) return <p style={styles.error}>Error: {error}</p>;
  if (!setData) return <p style={styles.loading}>No data found.</p>;

  return (
    <div style={styles.card} onClick={() => navigate('/mtg-sets/' + setCode)} >
      <div style={styles.textContainer}>
        <h2 style={styles.title} title={setData.set_name}>
          {setData.set_name}
        </h2>
      </div>
    </div>
  );
}

const styles = {
  card: {
    display: "flex",
    alignItems: "center",
    maxWidth: "500px",
    margin: "10px auto 10px auto",
    padding: "20px",
    borderRadius: "1rem",
    backgroundColor: "rgba(53, 53, 53, 0.6)",
    backdropFilter: "blur(10px)",
    color: "white",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
    fontFamily: "Arial, sans-serif",
    transition: "transform 0.2s, box-shadow 0.2s",
    width:"27.5rem",
  },
  image: {
    maxWidth: "250px",
    maxHeight: "150px",
    borderRadius: "1rem",
    objectFit: "cover",
    marginRight: "20px",
    flexShrink: 0,
  },
  textContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    overflow: "hidden",       // prevents text from leaving container
  },
  title: {
    margin: 0,
    marginBottom: "8px",
    fontSize: "1.5rem",
    color: "#ffcc00",
    whiteSpace: "wrap",     // single line
    overflow: "hidden",
    textOverflow: "ellipsis", // adds "..." if text is too long
  },
  series: {
    margin: 0,
    fontSize: "1rem",
    color: "#f0f0f0",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
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
