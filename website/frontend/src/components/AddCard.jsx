{/*
   --Just under function start
   const [selectedCard, setSelectedCard] = useState(null);


Add grant to user when making user
let user rename first , m, last name.


   
*/}



import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddCard = ({ card, onClose }) => {
   const navigate = useNavigate();
   const token = localStorage.getItem("TCG_token");

   const [collections, setCollections] = useState([]);
   const [selectedCollection, setSelectedCollection] = useState("");
   const [loading, setLoading] = useState(true);
   const [adding, setAdding] = useState(false);
   const [successMsg, setSuccessMsg] = useState("");
   const [error, setError] = useState("");

   useEffect(() => {
      if (!token) {
         setLoading(false);
         return;
      }

      const fetchCollections = async () => {
         try {
            const res = await fetch("http://localhost:5000/api/collections", {
               headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Failed to fetch collections");

            const data = await res.json();
            setCollections(data);
         } catch (err) {
            console.error(err);
            setError("Error loading collections.");
         } finally {
            setLoading(false);
         }
      };

      fetchCollections();
   }, [token]);

   const handleAdd = async () => {
      if (!selectedCollection) return;

      setAdding(true);
      setError("");
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

         if (!res.ok) throw new Error("Failed.");

         setSuccessMsg("Added");
         setTimeout(() => setSuccessMsg(""), 2000);
      } catch (err) {
         setError("Could not add card.", err);
      } finally {
         setAdding(false);
      }
   };

   const handleBackgroundClick = (e) => {
      if (e.target === e.currentTarget) onClose();
   };

   return (
      <div style={styles.overlay} onClick={handleBackgroundClick}>
         <div style={styles.modal}>
            <button style={styles.closeBtn} onClick={onClose}>
               ✕
            </button>

            <img src={card.image} alt={card.name} style={styles.image} />

            <h3 style={styles.title}>{card.name}</h3>

            {!token && (
               <div style={styles.ctaWrapper}>
                  <p>Log in to save cards to your collections.</p>
                  <button style={styles.loginBtn} onClick={() => navigate("/login")}>
                     Log In / Sign Up
                  </button>
               </div>
            )}

            {token && (
               <>
                  {loading ? (
                     <p>Loading...</p>
                  ) : (
                     <>
                        <select
                           style={styles.select}
                           value={selectedCollection}
                           onChange={(e) => setSelectedCollection(e.target.value)}
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
                           onClick={handleAdd}
                        >
                           {adding ? "Adding..." : "Add to Collection"}
                        </button>

                        {successMsg && <p style={styles.success}>{successMsg}</p>}
                        {error && <p style={styles.error}>{error}</p>}
                     </>
                  )}
               </>
            )}
         </div>
      </div>
   );
};

const styles = {
   overlay: {
      position: "fixed",
      inset: 0,
      backdropFilter: "blur(2px)",
      background: "rgba(0,0,0,0.65)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2000,
   },
   modal: {
      background: "white",
      padding: "1rem",
      borderRadius: "8px",
      width: "320px",
      textAlign: "center",
      position: "relative",
   },
   closeBtn: {
      position: "absolute",
      top: "8px",
      right: "8px",
      background: "transparent",
      border: "none",
      fontSize: "1.2rem",
      cursor: "pointer",
   },
   image: {
      width: "178.5px",
      height: "250px",
      marginBottom: "0.5rem",
   },
   title: { marginBottom: "0.5rem" },
   select: {
      width: "100%",
      padding: "0.3rem",
      borderRadius: "4px",
      border: "1px solid #ccc",
      marginTop: "0.4rem",
   },
   addBtn: {
      marginTop: "0.5rem",
      width: "100%",
      padding: "0.4rem",
      border: "none",
      borderRadius: "4px",
      background: "#5a6bff",
      color: "white",
      cursor: "pointer",
   },
   ctaWrapper: { marginTop: "1rem" },
   loginBtn: {
      padding: "0.4rem 0.8rem",
      border: "none",
      borderRadius: "4px",
      background: "#ff4d4d",
      color: "white",
      cursor: "pointer",
      marginTop: "0.5rem",
   },
   success: { marginTop: "0.4rem", color: "green" },
   error: { marginTop: "0.4rem", color: "red" },
};

export default AddCard;
