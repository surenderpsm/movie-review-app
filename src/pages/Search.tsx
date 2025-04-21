import React, { useState } from 'react';
import { searchMovies } from '../services/movieService';
import MovieCard from '../components/MovieCard';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await searchMovies(query);
      setResults(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="col-md-8 offset-md-2">
        <h2>Search Movies</h2>
        <form onSubmit={handleSubmit} className="d-flex mb-4">
          <input
              type="text"
              className="form-control me-2"
              placeholder="Enter movie title"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
          />
          <button className="btn btn-outline-primary" disabled={loading}>Search</button>
        </form>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading && <p>Loading...</p>}

        {results.length > 0 && results.map((movie) => (
            <MovieCard key={movie.imdbID} {...movie} />
        ))}
      </div>
  );
};

export default Search;
