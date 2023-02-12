import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Profile from './projects/Profile'

const PrivateRouteForProfile = (...rest) => {
  const { currentUser } = useAuth();

  return currentUser ? (
    <Profile {...rest}/>
  ) : (
    <Navigate to="/" />
  );

};

export default PrivateRouteForProfile;
