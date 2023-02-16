import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Profile = () => {

  const { currentUser } = useAuth();
  const [error, setError] = useState("");
  const { logout } = useAuth();
  const navigate = useNavigate();


  const handleLoogout = async () => {
    setError('')

    try{
      await logout()
      navigate('/')
    } catch (err) {
      setError('Failed to logout')
      console.log(err)
    }
  }

  return (
    <div className="profile">
      <h5>Email: {currentUser.email}</h5>
      <button className="navbar-button" onClick={handleLoogout}>Log Out</button>
      {error && <div>{error}</div>}
      <Link to="../update-profile">
        <button>Update</button>
      </Link>
    </div>
  );
}
 
export default Profile;