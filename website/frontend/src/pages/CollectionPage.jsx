import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const CollectionPage = () => {
   const { collectionID } = useParams();
   const navigate = useNavigate();

   const [cards, setCards] = useState([]);
   const [filter, setFilter] = useState("all");
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   const [userCollections, setUserCollections] = useState([]);
   const [currentCollectionName, setCurrentCollectionName] = useState("");
   const [uID, setUid] = useState(null);

   const [selectedCard, setSelectedCard] = useState(null);
   const [targetCollection, setTargetCollection] = useState("");

   const token = localStorage.getItem("TCG_token");

   const fetchUserAndCollections = async () => {
      if (!token) {
         navigate("/login");
         return;
      }

      try {
         const userRes = await fetch("http://localhost:5000/api/get_user", {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });

         if (!userRes.ok) {
            navigate("/login");
            return;
         }

         const userData = await userRes.json();
         setUid(userData.uID);

         const colRes = await fetch(
            `http://localhost:5000/api/cards/collections/user/${userData.uID}`
         );

         if (!colRes.ok) throw new Error();

         const colData = await colRes.json();
         console.log("Got COLLECTIONS: ", colData)
         setUserCollections(colData);

         const current = colData.find(
            (c) => String(c.collectionID) === String(collectionID)
         );

         if (current) {
            setCurrentCollectionName(current.collection_name);
         }
      } catch {
         setError("Failed to load user/collections.");
      }
   };

   const fetchCards = async () => {
      try {
         setLoading(true);
         setError(null);

         let url = `http://localhost:5000/api/cards/collection/${collectionID}`;
         if (filter === "mtg" || filter === "pokemon") {
            url += `?type=${filter}`;
         }

         const res = await fetch(url);
         if (!res.ok) throw new Error();

         const data = await res.json();
         setCards(data);
      } catch {
         setError("Failed to load cards.");
      } finally {
         setLoading(false);
      }
   };

   const handleRemoveCard = async () => {
      if (!selectedCard) return;

      try {
         const res = await fetch(
            `http://localhost:5000/api/cards/collection/${collectionID}/remove_card`,
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
               },
               body: JSON.stringify({
                  card_type: selectedCard.card_type,
                  id: selectedCard.id,
               }),
            }
         );

         if (!res.ok) throw new Error();

         setCards((prev) =>
            prev.filter(
               (c) =>
                  !(
                     c.id === selectedCard.id &&
                     c.card_type === selectedCard.card_type
                  )
            )
         );

         setSelectedCard(null);
      } catch {
         alert("Failed to remove card from collection.");
      }
   };

   const handleAddToAnotherCollection = async () => {
      if (!selectedCard || !targetCollection) return;
      console.log(selectedCard);

      try {
         const res = await fetch(
            `http://localhost:5000/api/cards/collection/${targetCollection}/add_card`,
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
               },
               body: JSON.stringify({
                  card_type: selectedCard.card_type,
                  id: selectedCard.id,
               }),
            }
         );

         if (!res.ok) throw new Error();

         alert("Card added to selected collection.");
      } catch {
         alert("Failed to add card to collection.");
      }
   };

   useEffect(() => {
      fetchUserAndCollections();
   }, []);

   useEffect(() => {
      if (!collectionID) return;
      fetchCards();
   }, [collectionID, filter]);

   const cardCount = cards.length;

   return (
      <main>
         <Navbar />

         <div style={styles.body}>
            <div style={styles.headerRow}>
               <div>
                  <h2 style={styles.title}>
                     {currentCollectionName || "Collection"} #{collectionID}
                  </h2>
                  <p style={styles.subTitle}>
                     {cardCount} card{cardCount !== 1 ? "s" : ""}
                  </p>
               </div>

               <div style={styles.filterGroup}>
                  <button
                     style={{
                        ...styles.filterButton,
                        ...(filter === "all" ? styles.filterButtonActive : {}),
                     }}
                     onClick={() => setFilter("all")}
                  >
                     All
                  </button>
                  <button
                     style={{
                        ...styles.filterButton,
                        ...(filter === "mtg" ? styles.filterButtonActive : {}),
                     }}
                     onClick={() => setFilter("mtg")}
                  >
                     MTG
                  </button>
                  <button
                     style={{
                        ...styles.filterButton,
                        ...(filter === "pokemon"
                           ? styles.filterButtonActive
                           : {}),
                     }}
                     onClick={() => setFilter("pokemon")}
                  >
                     Pokémon
                  </button>
               </div>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {loading && <p>Loading cards...</p>}

            {!loading && !error && (
               <div style={styles.cardGrid}>
                  {cards.map((card) => (
                     <div
                        key={`${card.card_type}-${card.id}`}
                        style={styles.card}
                        onClick={() => setSelectedCard(card)}
                     >
                        <img
                           src={card.image}
                           alt={card.name}
                           style={styles.cardImage}
                        />
                        <p style={styles.cardName}>{card.name}</p>
                        <p style={styles.cardMeta}>
                           {card.card_type.toUpperCase()} • #{card.card_number}
                        </p>
                     </div>
                  ))}
               </div>
            )}

            {selectedCard && (
               <div style={styles.modalOverlay}>
                  <div style={styles.modal}>
                     <button
                        style={styles.closeButton}
                        onClick={() => setSelectedCard(null)}
                     >
                        ✕
                     </button>

                     <img
                        src={selectedCard.image}
                        alt={selectedCard.name}
                        style={styles.modalImage}
                     />

                     <h3 style={styles.modalTitle}>{selectedCard.name}</h3>
                     <p style={styles.modalText}>
                        Type: {selectedCard.card_type.toUpperCase()}
                     </p>
                     <p style={styles.modalText}>
                        Card Number: {selectedCard.card_number}
                     </p>

                     <div style={styles.modalActions}>
                        <button
                           style={styles.dangerButton}
                           onClick={handleRemoveCard}
                        >
                           Remove from this collection
                        </button>

                        <div style={styles.addToWrapper}>
                           <select
                              value={targetCollection}
                              onChange={(e) =>
                                 setTargetCollection(e.target.value)
                              }
                              style={styles.select}
                           >
                              <option value="">
                                 Add to another collection...
                              </option>
                              {userCollections
                                 .filter(
                                    (c) =>
                                       String(c.collectionID) !==
                                       String(collectionID)
                                 )
                                 .map((c) => (
                                    <option
                                       key={c.collectionID}
                                       value={c.collectionID}
                                    >
                                       {c.collection_name} (#{c.collectionID})
                                    </option>
                                 ))}
                           </select>

                           <button
                              style={styles.primaryButton}
                              onClick={handleAddToAnotherCollection}
                           >
                              Add
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </main>
   );
};

const styles = {
   body: {
      marginTop: "15vh",
      padding: "0 2vw 4rem",
   },
   headerRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "1.5rem",
      flexWrap: "wrap",
      gap: "1rem",
   },
   title: {
      fontSize: "1.8rem",
      margin: 0,
   },
   subTitle: {
      margin: 0,
      opacity: 0.8,
   },
   filterGroup: {
      display: "flex",
      gap: "0.5rem",
   },
   filterButton: {
      padding: "0.4rem 0.8rem",
      borderRadius: "999px",
      border: "1px solid #ccc",
      background: "#767676ff",
      cursor: "pointer",
      fontSize: "0.9rem",
   },
   filterButtonActive: {
      background: "#222",
      color: "white",
      borderColor: "#222",
   },
   cardGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
      gap: "1rem",
   },
   card: {
      background: "rgba(49, 49, 49, 1)",
      borderRadius: "10px",
      padding: "0.5rem",
      boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
      cursor: "pointer",
      transition: "transform 0.15s ease, box-shadow 0.15s ease",
   },
   cardImage: {
      width: "100%",
      height: "auto",
      borderRadius: "6px",
      marginBottom: "0.3rem",
   },
   cardName: {
      fontSize: "0.9rem",
      fontWeight: 600,
      margin: 0,
   },
   cardMeta: {
      fontSize: "0.75rem",
      opacity: 0.7,
      margin: 0,
   },
   modalOverlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
   },
   modal: {
      position: "relative",
      width: "min(420px, 90vw)",
      background: "rgba(49, 49, 49, 1)",
      borderRadius: "16px",
      padding: "1.5rem",
      boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
   },
   closeButton: {
      position: "absolute",
      top: "0.6rem",
      right: "0.6rem",
      border: "none",
      background: "transparent",
      fontSize: "1.1rem",
      cursor: "pointer",
   },
   modalImage: {
      width: "100%",
      borderRadius: "10px",
      marginBottom: "0.8rem",
   },
   modalTitle: {
      margin: 0,
      marginBottom: "0.4rem",
   },
   modalText: {
      margin: 0,
      fontSize: "0.9rem",
      marginBottom: "0.2rem",
   },
   modalActions: {
      marginTop: "1rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
   },
   dangerButton: {
      padding: "0.5rem 0.8rem",
      borderRadius: "8px",
      border: "none",
      background: "#e53935",
      color: "white",
      cursor: "pointer",
      fontSize: "0.9rem",
   },
   addToWrapper: {
      display: "flex",
      gap: "0.5rem",
      alignItems: "center",
   },
   select: {
      flex: 1,
      padding: "0.4rem 0.5rem",
      borderRadius: "8px",
      border: "1px solid #ccc",
      fontSize: "0.9rem",
   },
   primaryButton: {
      padding: "0.45rem 0.9rem",
      borderRadius: "8px",
      border: "none",
      background: "#222",
      color: "white",
      cursor: "pointer",
      fontSize: "0.9rem",
   },
};

export default CollectionPage;
