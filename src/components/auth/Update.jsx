import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const UpdateProfile = () => {

  const { currentUser } = useAuth();
  const { logout, getUserByEmail } = useAuth();

  const [error, setError] = useState("");
  const [user, setUser] = useState();
  // const navigate = useNavigate();

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

  // const handleLogout = async () => {
  //   setError('')
  //   try{
  //     await logout()
  //     navigate('/')
  //   } catch (err) {
  //     setError('Failed to logout')
  //     console.log(err)
  //   }
  // }

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
        {error && <div>{error}</div>}
      </div>
    );
  } else {
    return(
      <div className="loading">Loading...</div>
    )
  }
}
 
export default UpdateProfile;