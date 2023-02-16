import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import Profile from './projects/Profile'

const PrivateRoute = ({component: Component, ...rest}) => {
  const { currentUser } = useAuth();

  return currentUser ? (
    <Component {...rest}/>
  ) : (
    <Navigate to="/" />
  );

};

export default PrivateRoute;
