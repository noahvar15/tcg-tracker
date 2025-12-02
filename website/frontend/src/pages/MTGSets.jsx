import Navbar from "../components/Navbar.jsx";
import MTGSet from "../components/MTGSet.jsx";

import sets from '../../public/assets/mtg_sets.json';

const MTGSets = () => {
  return (
    <main>
      <Navbar />
      <div style={styles.gridContainer}>
        {sets.map((s, i) => (
          <MTGSet key={i} setCode={s.set_code} />
        ))}
      </div>
    </main>
  );
};

const styles = {
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    padding: '1rem'
  }
};

export default MTGSets;
