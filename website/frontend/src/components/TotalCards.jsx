import { useEffect, useState } from "react";

export default function TotalCards() {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/cards/total-cards");
        if (!res.ok) throw new Error("Failed to fetch total card count.");

        const data = await res.json();
        setCount(data[0].total_card_count);
      } catch (err) {
        setError("Error loading card count.");
      } finally {
        setLoading(false);
      }
    };

    fetchTotal();
  }, []);

  if (loading) return <p style={{ color: "#999" }}>Loading total...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h3 style={styles.label}>Total Cards in Database</h3>
        <p style={styles.number}>{count.toLocaleString()}</p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    marginTop: "1rem",
  },

  card: {
    background: "rgba(247, 208, 49, 0.3)",
    borderRadius: "16px",
    padding: "1.8rem 2.4rem",
    textAlign: "center",
    color: "white",
    boxShadow: "0 0 20px rgba(247, 208, 49, 0.3)",
    border: "2px solid rgba(247, 208, 49, 0.4)",
    backdropFilter: "blur(6px)",
    transition: "0.3s ease",
    maxWidth: "350px",
    width: "100%",
    animation: "fadeIn 0.5s ease-out",
  },

  label: {
    fontSize: "1.1rem",
    opacity: 0.85,
    marginBottom: "0.6rem",
    letterSpacing: "0.5px",
  },

  number: {
    fontSize: "3rem",
    fontWeight: "700",
    margin: 0,
    animation: "popIn 0.4s ease-out",
  },
};


