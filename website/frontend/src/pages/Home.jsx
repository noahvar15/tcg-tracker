import Navbar from "../components/Navbar.jsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PokemonSet from "../components/PokemonSet.jsx";

const Home = () => {

   return (
      <main>
         <Navbar />
         <div style={styles.body}>
            <h2>Stuff</h2>
            <PokemonSet setId="base1" />
            <PokemonSet setId="base2" />
            <PokemonSet setId="base3" />
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