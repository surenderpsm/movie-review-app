import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import Search from "./pages/Search.tsx";
import Details from "./pages/Details.tsx";

const App = () => {
  return (
      <>
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/search" element={<Search />} />
            <Route path="/details/:imdbID" element={<Details />} />
          </Routes>
        </div>
      </>
  );
};

export default App;
