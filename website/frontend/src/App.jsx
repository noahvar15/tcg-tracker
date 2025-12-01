import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home.jsx'
import PokemonSets from './pages/PokemonSets.jsx'

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/pokemon-sets' element={<PokemonSets />} />
      </Routes>
    </Router>
  )
}

export default App
