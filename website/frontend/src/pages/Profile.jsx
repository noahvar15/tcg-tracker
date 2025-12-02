import Navbar from "../components/Navbar.jsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateCollection from "../components/CreateCollection.jsx";

const Profile = () => {
   const navigate = useNavigate();

   const [UID, setUID] = useState("");
   const [FName, setFName] = useState("");
   const [collections, setCollections] = useState([]);
   const [displayCards, setDisplayCards] = useState({});

   const validate_User = async () => {
      const TCG_Token = localStorage.getItem("TCG_token");
      if (!TCG_Token) {
         navigate("/login");
         return;
      }
      try {
         const response = await fetch("http://localhost:5000/api/get_user", {
            method: "GET",
            headers: {
               Authorization: `Bearer ${TCG_Token}`,
            },
         });
         if (!response.ok) throw new Error();
         const data = await response.json();
         setUID(data.uID);
         setFName(data.first_name);
      } catch {
         navigate("/login");
      }
   };

   const fetch_Collections = async (u) => {
      try {
         const response = await fetch(
            `http://localhost:5000/api/cards/collections/user/${u}`
         );
         if (!response.ok) throw new Error();
         const data = await response.json();
         setCollections(data);
      } catch {
         console.log("Failed")
      }
   };

   const fetch_Collection_Cards = async (cID) => {
      try {
         const response = await fetch(
            `http://localhost:5000/api/cards/collection/${cID}`
         );
         if (!response.ok) throw new Error();
         const cards = await response.json();
         const sample = cards.slice(0, 10);
         setDisplayCards((prev) => ({
            ...prev,
            [cID]: sample,
         }));
      } catch { }
   };

   useEffect(() => {
      validate_User();
   }, []);

   useEffect(() => {
      if (!UID) return;
      fetch_Collections(UID);
   }, [UID]);

   useEffect(() => {
      if (collections.length === 0) return;
      collections.forEach((collection) => {
         fetch_Collection_Cards(collection.collectionID);
      });
   }, [collections]);

   return (
      <main>
         <Navbar />
         <CreateCollection uID={UID}/>
         <div style={styles.body}>
            <h2 style={styles.nameCollection}>
               <span>{FName}</span>'s Collections
            </h2>

            <div style={styles.collectionList}>
               {collections.map((c) => (
                  <div
                     onClick={() => {
                        navigate(`/collections/${c.collectionID}`)
                     }}
                     key={c.collectionID}
                     style={styles.collectionCard}
                  >
                     <h3 style={styles.collectionTitle}>
                        {c.collection_name}
                     </h3>

                     <ul style={styles.cardsRow}>
                        {(displayCards[c.collectionID] || []).map((card) => (
                           <li key={card.id} style={styles.card}>
                              <img
                                 src={card.image}
                                 alt={card.name}
                                 style={styles.cardImage}
                              />
                              <p style={styles.cardName}>{card.name}</p>
                           </li>
                        ))}
                     </ul>
                  </div>
               ))}
            </div>
         </div>

      </main>
   );
};

const styles = {
   body: {
      marginTop: "15vh",
      padding: "0 2vw"
   },
   nameCollection: {
      marginBottom: "2rem",
   },

   collectionList: {
      display: "flex",
      flexDirection: "column",
      gap: "2rem",
   },

   collectionCard: {
      padding: "1.5rem",
      borderRadius: "12px",
      background: "rgba(49, 49, 49, 1)",
      boxShadow: "0 4px 12px rgba(233, 233, 233, 0.15)",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      cursor: "pointer",
   },

   collectionTitle: {
      marginBottom: "1rem",
      fontSize: "1.3rem",
      fontWeight: "600",
   },

   cardsRow: {
      display: "flex",
      gap: "1rem",
      flexWrap: "wrap",
      padding: 0,
      margin: 0,
      listStyle: "none",
   },

   card: {
      textAlign: "center",
      width: "100px",
   },

   cardImage: {
      width: "100%",
      height: "auto",
      borderRadius: "6px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
   },

   cardName: {
      fontSize: "0.75rem",
      marginTop: "0.3rem",
   },
};

export default Profile;
