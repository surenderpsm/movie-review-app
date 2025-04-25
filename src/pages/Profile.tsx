import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';
import { getMyProfile, getProfile, followUser, unfollowUser } from '../services/userService';
import { Link } from 'react-router-dom';
import {GENRES} from "./Register.tsx";
import {getToken} from "../utils/token.ts";

const Profile = () => {
  const { id } = useParams(); // If null, it's my own profile
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null);
  const [isMyProfile, setIsMyProfile] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingGenres, setEditingGenres] = useState(false);
  const [tempGenres, setTempGenres] = useState<string[]>([]);

  // New state variables for username and password editing
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [usernameSuccess, setUsernameSuccess] = useState('');

  const [editingPassword, setEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

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
      setNewUsername(data.username);
      setTempGenres(data.preferredGenres || []);

      const allReviews = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/user/${data._id}`).then(res => res.json());
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

  const handleUpdateUsername = async () => {
    try {
      setUsernameError('');
      setUsernameSuccess('');

      if (!newUsername || newUsername.trim() === '') {
        setUsernameError('Username cannot be empty');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/username`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ username: newUsername })
      });

      const data = await response.json();

      if (!response.ok) {
        setUsernameError(data.error || 'Failed to update username');
        return;
      }

      setUsernameSuccess('Username updated successfully');
      setEditingUsername(false);
      await load(); // Refresh profile data
    } catch (err) {
      console.error(err);
      setUsernameError('An error occurred while updating username');
    }
  };

  const handleUpdatePassword = async () => {
    try {
      setPasswordError('');
      setPasswordSuccess('');

      if (!currentPassword) {
        setPasswordError('Current password is required');
        return;
      }

      if (!newPassword) {
        setPasswordError('New password is required');
        return;
      }

      if (newPassword !== confirmPassword) {
        setPasswordError('New passwords do not match');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setPasswordError(data.error || 'Failed to update password');
        return;
      }

      setPasswordSuccess('Password updated successfully');
      setEditingPassword(false);

      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      setPasswordError('An error occurred while updating password');
    }
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
              <div className="mb-3">
                <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => setEditingUsername(true)}
                >
                  ✏️ Edit Username
                </button>
                <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setEditingPassword(true)}
                >
                  🔑 Change Password
                </button>
              </div>
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

        {/* Edit Genres Modal */}
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
                      await fetch(import.meta.env.VITE_API_URL +'/api/user/genres', {
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

        {/* Edit Username Modal */}
        {editingUsername && (
            <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Username</h5>
                    <button className="btn-close" onClick={() => setEditingUsername(false)}></button>
                  </div>
                  <div className="modal-body">
                    {usernameError && (
                        <div className="alert alert-danger">{usernameError}</div>
                    )}
                    {usernameSuccess && (
                        <div className="alert alert-success">{usernameSuccess}</div>
                    )}
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label">New Username</label>
                      <input
                          type="text"
                          className="form-control"
                          id="username"
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => setEditingUsername(false)}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleUpdateUsername}>
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}

        {/* Edit Password Modal */}
        {editingPassword && (
            <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Change Password</h5>
                    <button className="btn-close" onClick={() => setEditingPassword(false)}></button>
                  </div>
                  <div className="modal-body">
                    {passwordError && (
                        <div className="alert alert-danger">{passwordError}</div>
                    )}
                    {passwordSuccess && (
                        <div className="alert alert-success">{passwordSuccess}</div>
                    )}
                    <div className="mb-3">
                      <label htmlFor="currentPassword" className="form-label">Current Password</label>
                      <input
                          type="password"
                          className="form-control"
                          id="currentPassword"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="newPassword" className="form-label">New Password</label>
                      <input
                          type="password"
                          className="form-control"
                          id="newPassword"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                      <input
                          type="password"
                          className="form-control"
                          id="confirmPassword"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => setEditingPassword(false)}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleUpdatePassword}>
                      Update Password
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