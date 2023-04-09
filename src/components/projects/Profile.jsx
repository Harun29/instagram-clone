import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Profile = () => {

  const { currentUser } = useAuth();
  const { logout, getUserByEmail } = useAuth();

  const [error, setError] = useState("");
  const [user, setUser] = useState();
  const navigate = useNavigate();

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

  const handleLogout = async () => {
    setError('')
    try{
      await logout()
      navigate('/')
    } catch (err) {
      setError('Failed to logout')
      console.log(err)
    }
  }

  if(user){
    return (
      <div className="profile">
        <h5>Email: {user.email}</h5>
        <h5>Name: {user.name}</h5>
        <h5>Username: {user.userName}</h5>
        <h5>birth date: {user.age}</h5>
        <button className="navbar-button" onClick={handleLogout}>Log Out</button>
        {error && <div>{error}</div>}
        <Link to="../update-profile">
          <button>Update</button>
        </Link>
      </div>
    );
  } else {
    return(
      <div className="loading">Loading...</div>
    )
  }
}
 
export default Profile;