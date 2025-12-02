import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home.jsx';
import SearchResults from "./pages/SearchResults.jsx";
import PokemonSets from './pages/PokemonSets.jsx'
import SignUp from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import Profile from "./pages/Profile.jsx"
import CollectionPage from "./pages/CollectionPage.jsx"
import PokemonCardsBySets from "./pages/PokemonCardsBySets.jsx";

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/search' element={<SearchResults />} />
        <Route path='/pokemon-sets' element={<PokemonSets />} />
        <Route path="/pokemon-sets/:setId" element={<PokemonCardsBySets />} />
        <Route path='/Signup' element={<SignUp />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/Profile' element={<Profile />} />
        <Route path="/collections/:collectionID" element={<CollectionPage />} />
      </Routes>
    </Router>
  )
}

export default App
