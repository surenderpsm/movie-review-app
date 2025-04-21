import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const user = getCurrentUser();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoute;
