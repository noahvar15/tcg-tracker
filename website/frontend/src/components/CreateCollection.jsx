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
    <div style={{ padding: "20px", maxWidth: "400px" }}>
      <h2>Create New Collection</h2>

      <form onSubmit={handleSubmit}>

        <label>Collection Name</label>
        <input
          type="text"
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <label>Description (optional)</label>
        <textarea
          value={descriptor}
          onChange={(e) => setDescriptor(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Collection"}
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      {success && <p style={{ color: "green", marginTop: "10px" }}>{success}</p>}
    </div>
  );
}
