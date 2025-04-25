import { useEffect, useState } from 'react';
import { getCurrentUser } from '../services/authService';
import { getFeed } from '../services/userService';
import { Link } from 'react-router-dom';

const Home = () => {
  const user = getCurrentUser();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [feed, setFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeed().then(setFeed).finally(() => setLoading(false));
  }, [user]);
  if (loading) return <p>Loading...</p>;

  return (
      <div className="col-md-8 offset-md-2">
        {user ? (
            <>
              <h2>Welcome back, {user.username} 👋</h2>
              <hr />
              <h4>📰 Recent Reviews by People You Follow</h4>
              {feed.length === 0 ? (
                  <p>No recent activity yet. Start following people!</p>
              ) : (
                  feed.map((r) => (
                      <div key={r._id} className="card mb-2">
                        <div className="card-body">
                          <h6>
                            {r.title} <small className="text-muted">by <Link to={`/profile/${r.user._id}`}>{r.user.username}</Link></small>
                          </h6>
                          <p>{r.content}</p>
                          <p className="text-muted">
                            ⭐ {r.rating} — <Link to={`/details/${r.imdbID}`}>View Movie</Link>
                          </p>
                        </div>
                      </div>
                  ))
              )}
            </>
        ) : (
            <>
              <h2>🎬 Welcome to Film-connect</h2>
              <p>Discover, review, and discuss movies. Join our community!</p>
              <Link to="/register" className="btn btn-success me-2">Get Started</Link>
              <Link to="/login" className="btn btn-outline-primary">Login</Link>
              <hr />
              <h4>📰 All Reviews</h4>
              {feed.length === 0 ? (
                  <p>No reviews yet. Login to exploring movies!</p>
              ) : (
                  feed.map((r) => (
                      <div key={r._id} className="card mb-2">
                        <div className="card-body">
                          <h6>
                            {r.title} <small className="text-muted">by <Link to={`/profile/${r.user._id}`}>{r.user.username}</Link></small>
                          </h6>
                          <p>{r.content}</p>
                          <p className="text-muted">
                            ⭐ {r.rating} — <Link to={`/details/${r.imdbID}`}>View Movie</Link>
                          </p>
                        </div>
                      </div>
                  ))
              )}
            </>
        )}
      </div>
  );
};

export default Home;
