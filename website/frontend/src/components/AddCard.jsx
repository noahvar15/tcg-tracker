import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddCard = ({ card, onClose }) => {
   const navigate = useNavigate();
   const token = localStorage.getItem("TCG_token");
   const [uID, setUid] = useState(null);

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
            const userRes = await fetch("http://localhost:5000/api/get_user", {
               headers: { Authorization: `Bearer ${token}` },
            });

            if (!userRes.ok) throw new Error("Failed to get user");

            const userData = await userRes.json();
            const userId = userData.uID;

            const res = await fetch(
               `http://localhost:5000/api/cards/collections/user/${userId}`,
               {
                  headers: { Authorization: `Bearer ${token}` },
               }
            );

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
      console.log(card);

      try {
         const res = await fetch(
            `http://localhost:5000/api/cards/collection/${selectedCollection}/add_card`,
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
               },
               body: JSON.stringify({
                  card_type: card.type,
                  id: card.id,
               }),
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
                           <option key={col.collectionID} value={col.collectionID}>
                              {col.collection_name}
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
      backdropFilter: "blur(4px)",
      background: "rgba(0, 0, 0, 0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2000,
   },
   modal: {
      background: "#1a1a1a",
      padding: "1.5rem",
      borderRadius: "12px",
      width: "340px",
      textAlign: "center",
      position: "relative",
      color: "#f0f0f0",
      boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
   },
   closeBtn: {
      position: "absolute",
      top: "10px",
      right: "10px",
      background: "transparent",
      border: "none",
      fontSize: "1.3rem",
      color: "#f0f0f0",
      cursor: "pointer",
   },
   image: {
      width: "178.5px",
      height: "250px",
      marginBottom: "0.6rem",
      borderRadius: "6px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
   },
   title: {
      marginBottom: "0.5rem",
      fontWeight: "600",
   },
   select: {
      width: "100%",
      padding: "0.4rem",
      borderRadius: "6px",
      border: "1px solid #444",
      background: "#2a2a2a",
      color: "#f0f0f0",
      marginTop: "0.5rem",
   },
   addBtn: {
      marginTop: "0.6rem",
      width: "100%",
      padding: "0.5rem",
      border: "none",
      borderRadius: "6px",
      background: "#f3c634c0",
      color: "black",
      cursor: "pointer",
      fontWeight: "500",
      transition: "background 0.2s",
   },
   addBtnHover: {
      background: "#4758e5",
   },
   ctaWrapper: { 
      marginTop: "1rem", 
      color: "#ddd",
   },
   loginBtn: {
      padding: "0.4rem 0.8rem",
      border: "none",
      borderRadius: "6px",
      background: "#ff4d4d",
      color: "white",
      cursor: "pointer",
      marginTop: "0.5rem",
      fontWeight: "500",
   },
   success: { 
      marginTop: "0.4rem", 
      color: "#4caf50", 
      fontWeight: "500",
   },
   error: { 
      marginTop: "0.4rem", 
      color: "#ff4d4d", 
      fontWeight: "500",
   },
};


export default AddCard;
