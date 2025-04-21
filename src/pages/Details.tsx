import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getMovieDetails } from '../services/movieService';
import { createReview, getSummary, voteReview } from '../services/reviewService';
import { getCurrentUser } from '../services/authService';
import {getToken} from "../utils/token.ts";

const Details = () => {
  const { imdbID } = useParams();
  const [movie, setMovie] = useState<any>(null);
  const [summary, setSummary] = useState<{ avgRating: string, reviews: any[] }>({ avgRating: '', reviews: [] });
  const [form, setForm] = useState({ title: '', content: '', rating: 5 });
  const user = getCurrentUser();

  useEffect(() => {
    if (imdbID) {
      getMovieDetails(imdbID).then(setMovie);
      getSummary(imdbID).then(setSummary);
    }
  }, [imdbID]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imdbID) return;
    await createReview({ ...form, imdbID });
    setForm({ title: '', content: '', rating: 5 });
    const updated = await getSummary(imdbID);
    setSummary(updated);
  };

  const vote = async (id: string, type: 'helpful' | 'unhelpful') => {
    await voteReview(id, type);
    if (imdbID) {
      const updated = await getSummary(imdbID);
      setSummary(updated);
    }
  };

  if (!movie) return <p>Loading...</p>;

  return (
      <div className="col-md-10 offset-md-1">
        {user && (
            <button
                className="btn btn-outline-warning mb-3"
                onClick={async () => {
                  await fetch(import.meta.env.VITE_API_URL+'api/users/favorites', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${getToken()}`
                    },
                    body: JSON.stringify({
                      imdbID: movie.imdbID,
                      title: movie.Title,
                      poster: movie.Poster
                    })
                  });
                  alert('Toggled favorite!');
                }}
            >
              ⭐ {user ? 'Toggle Favorite' : 'Login to Favorite'}
            </button>
        )}

        <h2>{movie.Title} <small className="text-muted">({movie.Year})</small></h2>
        <p><strong>Genre:</strong> {movie.Genre}</p>
        <p><strong>Director:</strong> {movie.Director}</p>
        <p><strong>Plot:</strong> {movie.Plot}</p>
        <img src={movie.Poster !== 'N/A' ? movie.Poster : '/no-image.jpg'} className="mb-4" height="300" />

        <h4>⭐ Average Rating: {summary.avgRating || 'N/A'}</h4>

        {user && (
            <>
              <h5 className="mt-4">Write a Review</h5>
              <form onSubmit={submitReview}>
                <div className="mb-2">
                  <input name="title" placeholder="Review title" className="form-control" value={form.title} onChange={handleChange} required />
                </div>
                <div className="mb-2">
                  <textarea name="content" placeholder="Your thoughts..." className="form-control" rows={3} value={form.content} onChange={handleChange} required />
                </div>
                <div className="mb-2">
                  <input type="number" name="rating" min={1} max={10} className="form-control" value={form.rating} onChange={handleChange} />
                </div>
                <button className="btn btn-success">Submit Review</button>
              </form>
            </>
        )}

        <h5 className="mt-4">Top Reviews</h5>
        {summary.reviews.length === 0 ? (
            <p>No reviews yet.</p>
        ) : (
            summary.reviews.map((r) => (
                <div className="card mb-2" key={r._id}>
                  <div className="card-body">
                    <h6>{r.title} <small className="text-muted">by {r.user.username}</small></h6>
                    <p>{r.content}</p>
                    <p>⭐ Rating: {r.rating}</p>
                    <div>
                      <button className="btn btn-sm btn-outline-success me-2" onClick={() => vote(r._id, 'helpful')}>
                        👍 {r.helpful.length}
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => vote(r._id, 'unhelpful')}>
                        👎 {r.unhelpful.length}
                      </button>
                    </div>
                  </div>
                </div>
            ))
        )}
      </div>
  );
};

export default Details;
