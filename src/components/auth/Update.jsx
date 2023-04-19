import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const UpdateProfile = () => {

  const { currentUser } = useAuth();
  const { getUserByEmail } = useAuth();
  const [user, setUser] = useState();

  useEffect(() => {
    const fetchUserByEmail = async (email) => {
      const user = await getUserByEmail(email);
      setUser(user);
    }
    try{
      currentUser && fetchUserByEmail(currentUser.email)
    }
    catch(err){
      console.error(err)
    }
  }, [currentUser, getUserByEmail])

  if(user){
    return (
      <div className="profile">
        <h5>Email: {user.email}
          <Link to="email-update" className="ms-3">Update</Link>
        </h5>
        <h5>Name: {user.name}
          <Link to="name-update" className="ms-3">Update</Link>
        </h5>
        <h5>Username: {user.userName}
          <Link to="username-update" className="ms-3">Update</Link>
        </h5>
        <h5>birth date: {user.age}
          <Link to="birthday-update" className="ms-3">Update</Link>
        </h5>
        <Link to="password-update" className="ms-3">Update password</Link>
      </div>
    );
  } else {
    return(
      <div className="loading">Loading...</div>
    )
  }
}
 
export default UpdateProfile;