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
   const [isEditingName, setIsEditingName] = useState(false);
   const [newName, setNewName] = useState("");

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

   const handleSaveName = async () => {
      if (!newName.trim()) return alert("Name cannot be empty");

      try {
         const res = await fetch(
            `http://localhost:5000/api/cards/collections/${collectionID}/rename`,
            {
               method: "PUT",
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
               },
               body: JSON.stringify({ new_name: newName }),
            }
         );

         if (!res.ok) throw new Error();

         const data = await res.json();

         // Update UI immediately
         setCurrentCollectionName(newName);

         // Update userCollections too
         setUserCollections((prev) =>
            prev.map((c) =>
               c.collectionID == collectionID
                  ? { ...c, collection_name: data.new_name }
                  : c
            )
         );

         setIsEditingName(false);
         setNewName("");

      } catch (err) {
         alert("Failed to rename collection", err);
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
               <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {isEditingName ? (
                     <>
                        <input
                           style={styles.nameInput}
                           value={newName}
                           onChange={(e) => setNewName(e.target.value)}
                           placeholder="Collection name"
                        />
                        <button
                           style={styles.saveButton}
                           onClick={handleSaveName}
                        >
                           Save
                        </button>
                        <button
                           style={styles.cancelButton}
                           onClick={() => {
                              setIsEditingName(false);
                              setNewName("");
                           }}
                        >
                           Cancel
                        </button>
                     </>
                  ) : (
                     <>
                        <h2 style={styles.title}>{currentCollectionName}</h2>
                        <button
                           style={styles.editButton}
                           onClick={() => {
                              setIsEditingName(true);
                              setNewName(currentCollectionName);
                           }}
                        >
                           Edit
                        </button>
                     </>
                  )}
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
      marginTop: "16vh",
      padding: "0 3vw 5rem",
      color: "white",
      fontFamily: "Inter, sans-serif",
   },

   /* ----------- HEADER ----------- */
   headerRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "2rem",
      flexWrap: "wrap",
      gap: "1rem",
   },

   title: {
      fontSize: "2.2rem",
      fontWeight: 700,
      margin: 0,
   },

   subTitle: {
      margin: "0 0 0 0.4rem",
      opacity: 0.75,
      fontSize: "1rem",
   },

   /* ----------- FILTER BUTTONS ----------- */
   filterGroup: {
      display: "flex",
      gap: "0.6rem",
   },

   filterButton: {
      padding: "0.5rem 1rem",
      borderRadius: "1000px",
      background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.12)",
      color: "#ddd",
      cursor: "pointer",
      fontSize: "0.9rem",
      transition: "0.2s",
   },

   filterButtonActive: {
      background: "rgb(255, 204, 0)",
      borderColor: "rgb(255, 204, 0)",
      color: "black",
      fontWeight: 600,
   },

   /* ----------- CARD GRID ----------- */
   cardGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
      gap: "1.3rem",
      marginTop: "1rem",
   },

   /* ----------- CARD ----------- */
   card: {
      background: "rgba(255,255,255,0.08)",
      borderRadius: "12px",
      padding: "0.75rem",
      boxShadow: "0 4px 15px rgba(0,0,0,0.25)",
      cursor: "pointer",
      transition: "transform 0.15s ease, box-shadow 0.2s ease",
   },

   cardImage: {
      width: "100%",
      borderRadius: "10px",
      marginBottom: "0.5rem",
   },

   cardName: {
      fontSize: "1rem",
      fontWeight: 600,
      margin: "0.2rem 0",
      color: "#fff",
   },

   cardMeta: {
      fontSize: "0.8rem",
      opacity: 0.75,
      margin: 0,
   },

   /* ----------- MODAL ----------- */
   modalOverlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.75)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2000,
      backdropFilter: "blur(4px)",
   },

   modal: {
      position: "relative",
      width: "min(450px, 92vw)",
      background: "rgba(30, 30, 30, 0.95)",
      borderRadius: "18px",
      padding: "2rem",
      boxShadow: "0 8px 25px rgba(0,0,0,0.55)",
      animation: "fadeIn 0.25s ease",
      justifyContent: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "30vw"
   },

   closeButton: {
      position: "absolute",
      top: "0.9rem",
      right: "0.9rem",
      border: "none",
      background: "transparent",
      color: "#aaa",
      fontSize: "1.2rem",
      cursor: "pointer",
      transition: "0.2s",
   },

   modalImage: {
      width: "70%",
      borderRadius: "12px",
      marginBottom: "1rem",
   },

   modalTitle: {
      fontSize: "1.4rem",
      margin: "0 0 0.5rem",
      fontWeight: 700,
   },

   modalText: {
      fontSize: "0.95rem",
      opacity: 0.85,
      margin: "0.3rem 0",
   },

   modalActions: {
      marginTop: "1.5rem",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
   },

   dangerButton: {
      padding: "0.65rem 1rem",
      borderRadius: "10px",
      border: "none",
      background: "#ff4a4a",
      color: "white",
      cursor: "pointer",
      fontWeight: 600,
      fontSize: "0.95rem",
      transition: "0.2s",
   },

   addToWrapper: {
      display: "flex",
      gap: "0.6rem",
      alignItems: "center",
   },

   select: {
      flex: 1,
      padding: "0.55rem 0.65rem",
      borderRadius: "10px",
      border: "1px solid rgba(255,255,255,0.2)",
      background: "rgba(255,255,255,0.08)",
      color: "white",
      fontSize: "0.9rem",
   },

   primaryButton: {
      padding: "0.55rem 1rem",
      borderRadius: "10px",
      border: "none",
      background: "rgb(255, 204, 0)",
      color: "black",
      fontWeight: 600,
      cursor: "pointer",
      fontSize: "0.95rem",
   },

   /* ----------- EDIT NAME SECTION ----------- */
   nameInput: {
      padding: "0.45rem 0.7rem",
      borderRadius: "8px",
      border: "1px solid rgba(255,255,255,0.2)",
      background: "rgba(255,255,255,0.08)",
      color: "white",
      fontSize: "1rem",
      minWidth: "200px",
   },

   editButton: {
      padding: "0.35rem 0.75rem",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      background: "rgba(255,255,255,0.15)",
      color: "white",
      fontSize: "0.85rem",
      fontWeight: 500,
   },

   saveButton: {
      padding: "0.35rem 0.75rem",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      background: "rgb(0, 200, 90)",
      color: "white",
      fontWeight: 600,
   },

   cancelButton: {
      padding: "0.35rem 0.75rem",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      background: "rgba(255,255,255,0.25)",
      color: "white",
   },
};

export default CollectionPage;
