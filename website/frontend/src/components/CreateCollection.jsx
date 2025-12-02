import { useState } from "react";

export default function CreateCollection({ uID }) {
  const [collectionName, setCollectionName] = useState("");
  const [descriptor, setDescriptor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("http://localhost:5000/api/cards/collection/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uID,
          collection_name: collectionName,
          descriptor,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      setSuccess(`Collection created! ID: ${data.collectionID}`);
      setCollectionName("");
      setDescriptor("");

    } catch (err) {
      setError("Network error");
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Collection</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          
          <div style={styles.field}>
            <label style={styles.label}>Collection Name</label>
            <input
              type="text"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Description (optional)</label>
            <textarea
              value={descriptor}
              onChange={(e) => setDescriptor(e.target.value)}
              style={{ ...styles.input, height: "80px", resize: "none" }}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Creating..." : "Create Collection"}
          </button>
        </form>

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    background: "linear-gradient(180deg, #0d0d0d, #1a1a1a)",
    color: "white",
  },

  card: {
    width: "380px",
    padding: "2.3rem",
    borderRadius: "12px",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    boxShadow: "0 0 18px rgba(0, 0, 0, 0.45)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  title: {
    marginBottom: "1.5rem",
    fontSize: "1.9rem",
    fontWeight: "700",
    color: "white",
  },

  form: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  field: {
    display: "flex",
    flexDirection: "column",
  },

  label: {
    marginBottom: "0.35rem",
    fontSize: "0.95rem",
    color: "#ddd",
  },

  input: {
    padding: "0.75rem",
    borderRadius: "6px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(0,0,0,0.3)",
    color: "white",
    fontSize: "1rem",
  },

  button: {
    marginTop: "0.5rem",
    padding: "0.8rem",
    backgroundColor: "rgb(22,22,22)", // your requested color
    border: "none",
    borderRadius: "8px",
    fontSize: "1.05rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "0.2s",
  },

  error: {
    marginTop: "1rem",
    color: "red",
    fontWeight: "600",
    textAlign: "center",
  },

  success: {
    marginTop: "1rem",
    color: "rgb(0, 200, 90)",
    fontWeight: "600",
    textAlign: "center",
  },
};
