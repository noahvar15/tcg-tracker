import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { useEffect, useRef, useState } from "react";
import PokemonSet from "../components/PokemonSet.jsx";
import TotalCards from "../components/TotalCards.jsx";

const Home = () => {
  const navigate = useNavigate();
  const [bgIndex, setBgIndex] = useState(0);
  const images = [
  "/assets/background/mtg1.jpg",
  "/assets/background/pok1.png",
  "/assets/background/mtg2.jpg",
  "/assets/background/pok2.jpg",
  "/assets/background/mtg3.jpg",
  "/assets/background/pok3.png",
  "/assets/background/mtg4.jpg",
  "/assets/background/pok4.jpg",
  "/assets/background/mtg5.jpg",
  "/assets/background/pok5.jpg",
  "/assets/background/mtg6.png",
  "/assets/background/mtg7.jpeg",
];

  const hiddenImgRef = useRef(null);

  useEffect(() => {
    // Preload the next image for smooth transition
    if (hiddenImgRef.current) {
      hiddenImgRef.current.src = images[1];
    }

    const interval = setInterval(() => {
      setBgIndex((prev) => {
        const nextIndex = (prev + 1) % images.length;
        // Preload next image
        if (hiddenImgRef.current) {
          hiddenImgRef.current.src = images[(nextIndex + 1) % images.length];
        }
        return nextIndex;
      });
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: "relative", minHeight: "100vh", width: "100%" }}>
      {/* Blurry Background */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${images[bgIndex]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "blur(5px)", // <-- make blurry
          transition: "background-image 1s ease-in-out",
          zIndex: -1, // behind all content
        }}
      />

      <Navbar />
      <h1 style={{ textAlign: "center", marginTop: "30vh", color: "#fff" }}>
        <TotalCards />
      </h1>

      {/* Hidden img for preloading */}
      <img ref={hiddenImgRef} alt="preload" style={{ display: "none" }} />
    </div>
  );
};

export default Home;
