import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';


const Navbar = () => {
  const { user, logout } = useAuth();
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setQuery('');
    }
  };


  useEffect(() => {
    // listen to storage in case user logs in/out in another tab
    const handleStorage = () => setUser(getCurrentUser());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/login');
  };

  return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
        <Link className="navbar-brand" to="/">🎬 Film-connect</Link>
        <form className="d-flex ms-auto" onSubmit={handleSearch}>
          <input
              className="form-control me-2"
              type="search"
              placeholder="Search movies or users"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn-outline-light" type="submit">Search</button>
        </form>
        <div className="collapse navbar-collapse justify-content-end">
          <ul className="navbar-nav">
            {user ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/profile">👤 {user.username}</Link>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
                  </li>
                </>
            ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">Register</Link>
                  </li>
                </>
            )}
          </ul>
        </div>
      </nav>
  );
};

export default Navbar;
