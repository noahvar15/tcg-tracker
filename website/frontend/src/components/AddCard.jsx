{/* 
   Example Usage:
   (In PokemonCardsBySets)
   import AddCard from "../components/AddCard.jsx";

   {cards.map(card => (
               <div key={card.pokID} style={styles.card}>
                 <img
                   src={card.small_img}
                   alt={card.card_name}
                   style={styles.image}
                 />
                 <AddCard card={card} />. <<---------- ADD THIS
               </div>
             ))}
   
   
   
   */}




import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddCard = ({ card }) => {
   const navigate = useNavigate();
   const token = localStorage.getItem("TCG_token");

   const [collections, setCollections] = useState([]);
   const [selectedCollection, setSelectedCollection] = useState("");
   const [loading, setLoading] = useState(true);
   const [adding, setAdding] = useState(false);
   const [error, setError] = useState(null);
   const [successMsg, setSuccessMsg] = useState("");

   useEffect(() => {
      if (!token) {
         setLoading(false);
         return;
      }

      const fetchCollections = async () => {
         try {
            const res = await fetch("http://localhost:5000/api/collections", {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            });

            if (!res.ok) throw new Error("Failed to fetch collections");

            const data = await res.json();
            setCollections(data);
            setLoading(false);
         } catch (err) {
            console.error(err);
            setError("Error loading collections.");
            setLoading(false);
         }
      };

      fetchCollections();
   }, [token]);

   const handleAddCard = async () => {
      if (!selectedCollection) return;

      setAdding(true);
      setError(null);
      setSuccessMsg("");

      try {
         const res = await fetch(
            `http://localhost:5000/api/collections/${selectedCollection}/cards`,
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
               },
               body: JSON.stringify({ card_id: card.id }),
            }
         );

         if (!res.ok) throw new Error("Failed to add card.");

         setSuccessMsg("Added!");
         setTimeout(() => setSuccessMsg(""), 2000);
      } catch (err) {
         setError("Could not add card: ", err);
      } finally {
         setAdding(false);
      }
   };
   if (loading) return <p style={styles.smallText}>Loading...</p>;

   if (!token) {
      return (
         <div style={styles.wrapper}>
            <button style={styles.loginBtn} onClick={() => navigate("/login")}>
               Log in / Sign up to add card
            </button>
         </div>
      );
   }

   return (
      <div style={styles.wrapper}>
         <select
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
            style={styles.select}
         >
            <option value="">Select Collection</option>
            {collections.map((col) => (
               <option key={col.id} value={col.id}>
                  {col.name}
               </option>
            ))}
         </select>

         <button
            style={styles.addBtn}
            disabled={!selectedCollection || adding}
            onClick={handleAddCard}
         >
            {adding ? "Adding..." : "Add"}
         </button>

         {successMsg && <p style={styles.success}>{successMsg}</p>}
         {error && <p style={styles.error}>{error}</p>}
      </div>
   );
};

const styles = {
   wrapper: {
      marginTop: "0.5rem",
      display: "flex",
      gap: "0.4rem",
      alignItems: "center",
      flexWrap: "wrap",
   },
   select: {
      padding: "0.3rem",
      borderRadius: "4px",
      border: "1px solid #ccc",
   },
   addBtn: {
      padding: "0.3rem 0.6rem",
      borderRadius: "4px",
      border: "none",
      background: "#5a6bff",
      color: "white",
      cursor: "pointer",
   },
   loginBtn: {
      padding: "0.3rem 0.6rem",
      borderRadius: "4px",
      border: "none",
      background: "#ff5757",
      color: "white",
      cursor: "pointer",
   },
   smallText: {
      fontSize: "0.85rem",
      opacity: 0.6,
   },
   success: {
      color: "green",
      fontSize: "0.85rem",
   },
   error: {
      color: "red",
      fontSize: "0.85rem",
   },
};

export default AddCard;
