import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { currentUser } = useAuth();

  // useEffect(() => {
  //   console.log(currentUser.email)
  // }, [currentUser])

  return currentUser ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default PrivateRoute;
