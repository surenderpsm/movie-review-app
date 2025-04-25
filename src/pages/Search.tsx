import {useEffect, useState} from 'react';
import { searchMovies } from '../services/movieService';
import { searchUsers } from '../services/userService';
import MovieCard from '../components/MovieCard';
import { Link } from 'react-router-dom';

import { useLocation } from 'react-router-dom';

const useQuery = () => new URLSearchParams(useLocation().search);

const Search = () => {
  const query = useQuery().get('q') || '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [movieResults, setMovieResults] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userResults, setUserResults] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'movies' | 'users'>('all');

  useEffect(() => {
    const fetchBoth = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const [movies, users] = await Promise.all([
          searchMovies(query),
          searchUsers(query)
        ]);
        setMovieResults(movies);
        setUserResults(users);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError('Search failed');
      } finally {
        setLoading(false);
      }
    };

    fetchBoth();
  }, [query]);
  

  return (
      <div className="col-md-8 offset-md-2">
        <h2>Search Movies & Users</h2>


        <div className="mb-4">
          <button className={`btn me-2 ${activeTab === 'all' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveTab('all')}>All</button>
          <button className={`btn me-2 ${activeTab === 'movies' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveTab('movies')}>Movies</button>
          <button className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveTab('users')}>Users</button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {loading && <p>Loading...</p>}

        {(activeTab === 'all' || activeTab === 'movies') && (
            <>
              <h5>🎬 Movies</h5>
              {movieResults.length === 0 ? (
                  <p>No movies found.</p>
              ) : (
                  movieResults.map((movie) => <MovieCard key={movie.imdbID} {...movie} />)
              )}
            </>
        )}

        {(activeTab === 'all' || activeTab === 'users') && (
            <>
              <h5 className="mt-4">👤 Users</h5>
              {userResults.length === 0 ? (
                  <p>No users found.</p>
              ) : (
                  userResults.map((user) => (
                      <div key={user._id} className="mb-2">
                        <Link to={`/profile/${user._id}`}>{user.username}</Link>
                      </div>
                  ))
              )}
            </>
        )}
      </div>
  );
};

export default Search;
