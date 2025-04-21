import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';
import { getMyProfile, getProfile, followUser, unfollowUser } from '../services/userService';
import { Link } from 'react-router-dom';
import {GENRES} from "./Register.tsx";
import {getToken} from "../utils/token.ts";

const Profile = () => {
  const { id } = useParams(); // If null, it's my own profile
  const [profile, setProfile] = useState<any>(null);
  const [isMyProfile, setIsMyProfile] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingGenres, setEditingGenres] = useState(false);
  const [tempGenres, setTempGenres] = useState<string[]>([]);



  const toggleTempGenre = (genre: string) => {
    setTempGenres((prev) =>
        prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };


  const currentUser = getCurrentUser();

  const load = async () => {
    try {
      let data;
      if (!id) {
        data = await getMyProfile();
        setIsMyProfile(true);
      } else {
        data = await getProfile(id);
        setIsMyProfile(currentUser?.id === id);
      }
      setProfile(data);
      setTempGenres(data.preferredGenres || []);

      const allReviews = await fetch(`${import.meta.env.VITE_API_URL}/reviews/user/${data._id}`).then(res => res.json());
      setReviews(allReviews);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const isFollowing = currentUser && profile?.followers?.includes(currentUser.id);

  const toggleFollow = async () => {
    if (!profile) return;
    if (isFollowing) await unfollowUser(profile._id);
    else await followUser(profile._id);
    load(); // reload after follow/unfollow
  };

  if (loading) return <p>Loading profile...</p>;
  if (!profile) return <p>Profile not found</p>;

  return (
      <div className="col-md-8 offset-md-2">
        <h2>{profile.username} {isMyProfile && <span className="badge bg-primary ms-2">You</span>}</h2>
        <p><strong>Role:</strong> {profile.role}</p>

        {isMyProfile && (
            <>
              <p><strong>Email:</strong> {profile.email}</p>
            </>
        )}

        {profile.preferredGenres?.length > 0 && (
            <p><strong>Genres:</strong> {profile.preferredGenres.join(', ')}</p>
        )}
        {isMyProfile && (
            <button className="btn btn-sm btn-outline-primary mb-3" onClick={() => setEditingGenres(true)}>
              ✏️ Edit Genre Preferences
            </button>
        )}



        {!isMyProfile && currentUser && (
            <button className="btn btn-sm btn-outline-secondary mb-3" onClick={toggleFollow}>
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
        )}

        <div className="mb-3">
          <strong>Followers:</strong> {profile.followers?.length || 0} |
          <strong className="ms-2">Following:</strong> {profile.following?.length || 0}
        </div>

        <h5>Reviews</h5>
        {reviews.length === 0 ? (
            <p>No reviews yet.</p>
        ) : (
            reviews.map((review) => (
                <div key={review._id} className="card mb-2">
                  <div className="card-body">
                    <h6>{review.title}</h6>
                    <p>{review.content}</p>
                    <p className="text-muted">⭐ {review.rating} — <Link to={`/details/${review.imdbID}`}>View Movie</Link></p>
                  </div>
                </div>
            ))
        )}

        {editingGenres && (
            <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Preferred Genres</h5>
                    <button className="btn-close" onClick={() => setEditingGenres(false)}></button>
                  </div>
                  <div className="modal-body">
                    <div className="d-flex flex-wrap">
                      {GENRES.map((g) => (
                          <button
                              key={g}
                              type="button"
                              className={`btn me-2 mb-2 ${tempGenres.includes(g) ? 'btn-primary' : 'btn-outline-secondary'}`}
                              onClick={() => toggleTempGenre(g)}
                          >
                            {g}
                          </button>
                      ))}
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => setEditingGenres(false)}>Cancel</button>
                    <button className="btn btn-primary" onClick={async () => {
                      await fetch(import.meta.env.VITE_API_URL +'/user/genres', {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${getToken()}`
                        },
                        body: JSON.stringify({ genres: tempGenres })
                      });
                      setEditingGenres(false);
                      await load(); // refresh profile
                    }}>
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}

      </div>
  );
};

export default Profile;
