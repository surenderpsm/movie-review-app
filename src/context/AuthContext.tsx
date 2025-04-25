import { createContext, useContext, useState } from 'react';
import { getCurrentUser, logout as doLogout } from '../services/authService';
import { User } from '../types/User';

interface AuthContextType {
  user: User | null;
  setUser: (u: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(getCurrentUser());

  const logout = () => {
    doLogout();
    setUser(null);
  };

  return (
      <AuthContext.Provider value={{ user, setUser, logout }}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
