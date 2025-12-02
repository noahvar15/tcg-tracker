import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { useEffect, useState } from "react";
import PokemonSet from "../components/PokemonSet.jsx";
import TotalCards from "../components/TotalCards.jsx";

const Home = () => {
  const navigate = useNavigate();


  return (
    <div>
      <Navbar />
      <h1 style={{ textAlign: "center", marginTop: "100px" }}>
        <TotalCards />
      </h1>
    </div>
  );
};

export default Home;
