import { useState } from 'react';
import Logo from '../../public/vite.svg'

const Navbar = () => {
   const [hoveredOption, setHoveredOption] = useState(null); // Track which option is hovered

   // Handlers for hover logic
   const handleMouseEnter = (option) => setHoveredOption(option);
   const handleMouseLeave = () => setHoveredOption(null);

   // Function to dynamically style options
   const getOptionStyle = (option) => ({
      ...styles.Options,
      borderBottom: hoveredOption === option ? '2px solid transparent' : '2px solid black',
      cursor: 'pointer',
   });

   return (
      <div className="NavContainer" style={styles.NavContainer}>
         <div className="Logo-Container">
            <img src={Logo} alt="Logo" style={styles.Logo} />
         </div>
         <div className="Search-Container" style={styles.SearchContainer}>
            <input
               className="Search-Input"
               placeholder="Search"
               style={styles.Search}
            />
            <div className="Search-Button"></div>
         </div>
         <ul className="Options-Container" style={styles.OptionsContainer}>
            <li>
               <div
                  style={getOptionStyle('Pokemon')}
                  onMouseEnter={() => handleMouseEnter('Pokemon')}
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
               >
                  Pokemon
               </div>
            </li>
         </ul>
         <img src="https://cdn-icons-png.flaticon.com/512/3276/3276535.png" style={styles.account} alt="Account Button22" />
      </div>
   );
};

// Styles
const styles = {
   NavContainer: {
      padding: '1rem',
      width: '100%',
      height: '10vh',
      display: 'grid',
      alignItems: 'center', // Centers all items vertically
      gridTemplateColumns: 'auto auto auto auto',
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
      backgroundColor: 'rgba(53, 53, 53, 0.5)',
      backdropFilter: 'blur(10px)',
      position: 'fixed',
      top: '0px',
   },
   Logo: {
      marginLeft: '2rem',
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
   OptionsContainer: {
      listStyleType: 'none',
      display: 'flex',
   },
   Options: {
      height: '2vh',
      margin: '1rem',
      padding: '0.5rem',
      transition: 'border-bottom 0.2s ease',
   },
   // FIX THE GRIDBOX ; ITS NOT SHOWING FULL HEIGHTç
   SearchContainer: {
      display: 'flex',
      height: '40%',
   },
   Search: {
      border: '2px solid rgb(0,0,0,0.4)',
      paddingLeft: '1rem',
      borderRadius: '1rem',
      height: '100%',
      maxWidth: '50vw',
      width: '20vw',
   },

};


export default Navbar;