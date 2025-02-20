import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

function AuthGuard({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!user && !isChecking) {
      navigate('/?login=true');
    }
    setIsChecking(false);
  }, [user, navigate, isChecking]);

  if (isChecking) {
    return <LoadingSpinner />;
  }

  return user ? children : null;
}

export default AuthGuard; 