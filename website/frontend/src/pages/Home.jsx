import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PokemonSet from "../components/PokemonSet.jsx";

const Home = () => {
  const navigate = useNavigate();

  const handleSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div>
      <Navbar onSearch={handleSearch} />
      <h1 style={{ textAlign: "center", marginTop: "100px" }}>
        Stuff
      </h1>
    </div>
  );
};

export default Home;
