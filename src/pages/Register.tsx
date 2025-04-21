import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService';

export const GENRES = [
  'Action', 'Adventure', 'Comedy', 'Crime',
  'Drama', 'Fantasy', 'Horror', 'Mystery',
  'Romance', 'Sci-Fi', 'Thriller', 'Animation',
  'Biography', 'History', 'Musical', 'War'
];


const Register = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
    preferredGenres: [] as string[],
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const toggleGenre = (genre: string) => {
    setForm((prev) => ({
      ...prev,
      preferredGenres: prev.preferredGenres.includes(genre)
          ? prev.preferredGenres.filter((g) => g !== genre)
          : [...prev.preferredGenres, genre],
    }));
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(form);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
      <div className="col-md-6 offset-md-3">
        <h2 className="mb-4">Register</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Username</label>
            <input type="text" name="username" className="form-control"
                   value={form.username} onChange={handleChange} required/>
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input type="email" name="email" className="form-control"
                   value={form.email} onChange={handleChange} required/>
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input type="password" name="password" className="form-control"
                   value={form.password} onChange={handleChange} required/>
          </div>
          <div className="mb-3">
            <label>Role</label>
            <select name="role" className="form-select"
                    value={form.role} onChange={handleChange}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              {/* Optional */}
            </select>
          </div>
          <div className="mb-3">
            <label>Preferred Genres</label>
            <div className="d-flex flex-wrap">
              {GENRES.map((g) => (
                  <button
                      key={g}
                      type="button"
                      className={`btn me-2 mb-2 ${form.preferredGenres.includes(g) ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => toggleGenre(g)}
                  >
                    {g}
                  </button>
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-success w-100">Register</button>
        </form>
      </div>
  );
};

export default Register;
