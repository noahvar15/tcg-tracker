import { useState } from "react";
import viteLogo from '../../public/vite.svg';
import { useNavigate, Link } from "react-router-dom";


export default function Navbar() {
  const [query, setQuery] = useState("");
  const [hoveredOption, setHoveredOption] = useState(null);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleMouseEnter = (option) => setHoveredOption(option);
  const handleMouseLeave = () => setHoveredOption(null);

  const getOptionStyle = (option) => ({
    ...styles.Options,
    borderBottom: hoveredOption === option ? '2px solid transparent' : '2px solid black',
    cursor: 'pointer',
  });

  return (
    <nav style={styles.nav}>
      <Link to = "/" style={styles.logo}>
        <img src={viteLogo} alt="Logo" style={styles.logoImage} />
        TCG Tracker
      </Link>
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search for a card..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          style={styles.searchInput}
        />
        <button onClick={handleSearch} style={styles.searchButton}>
          Search
        </button>
      </div>
      <ul className="Options-Container" style={styles.OptionsContainer}>
        <li>
          <div
            style={getOptionStyle('MTG')}
            onMouseEnter={() => handleMouseEnter('MTG')}
            onMouseLeave={handleMouseLeave}
          >
            MTG
          </div>
        </li>
        <li>
          <div
            style={getOptionStyle('Pokemon')}
            onMouseEnter={() => handleMouseEnter('Pokemon')}
            onMouseLeave={handleMouseLeave}
            onClick={() => navigate('/pokemon-sets')}
          >
            Pokemon
          </div>
        </li>
      </ul>
      <img
        src="https://cdn-icons-png.flaticon.com/512/3276/3276535.png"
        style={styles.account}
        alt="Account Button"
        onClick={() => navigate("/Signup")
      />
    </nav>
  );
}

const styles = {
  nav: {
    padding: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem 2rem",
    backgroundColor: 'rgba(53, 53, 53, 0.5)',
    color: "white",
    position: "sticky",
    top: 0,
    width: "95vw",
    height: "10vh",
    gap: "2rem",
    zIndex: '9999',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(1000px)',
  },
  logo: { fontWeight: "bold", fontSize: "1.5rem", color: "inherit"},
  logoImage: { width: "32px", height: "auto", paddingRight: "1rem" },
  searchContainer: { display: "flex", gap: "0.5rem", height: "40%" },
  searchInput: { padding: "0.5rem", border: '2px solid rgb(0,0,0,0.4)', borderRadius: "1rem", width: "300px" },
  searchButton: { padding: "0.5rem 1rem", border: '2px solid rgb(0,0,0,0.4)', borderRadius: "1rem", cursor: "pointer" },
  OptionsContainer: {
    listStyleType: 'none',
    display: 'flex',
    gap: "1rem"
  },
  Options: {
    height: '2vh',
    margin: '1rem',
    paddingBottom: '1rem',
    transition: 'border-bottom 0.2s ease',
  },
  account: {
    border: "2px Solid Black",
    borderRadius: '100px',
    backgroundColor: 'white',
    cursor: 'pointer',
    height: '3rem',
    width: '3rem',
    justifySelf: 'end',
    marginRight: '2rem',
  },
};
