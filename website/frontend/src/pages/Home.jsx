import Navbar from "../components/Navbar.jsx";
import Carousell from "../components/Carousell.jsx";
//import { useEffect, useState } from "react";
//import { useNavigate } from "react-router-dom";

const Home = () => {

   return (
      <main>
         <Navbar />
         <div style={styles.body}>
            <Carousell />
            <h2>Stuff</h2>
         </div>

      </main>
   )
};

const styles = {
   body: {
      marginTop: '15vh',
   }
}

export default Home;