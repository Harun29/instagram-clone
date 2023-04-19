import { NavLink } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faPerson } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";

const SignedInLinks = () => {

  const navigate = useNavigate();
  const { logout } = useAuth();
  const [error, setError] = useState("");

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

  useEffect(()=>{
    if(error){
      console.log(error)
    }
  }, [error])

  return ( 
    <ul className="d-flex mt-3">

      <div className="dropdown me-2">
        <Button className="btn dropdown-toggle" type="button" id="notif-dropdown" data-bs-toggle="dropdown">
          <FontAwesomeIcon icon={faBell} className="text-white"></FontAwesomeIcon>
        </Button>
        <ul className="dropdown-menu" aria-labelledby="notif-dropdown">
          <li className="dropdown-item">notification 1</li>
          <li className="dropdown-item">notification 2</li>
          <li className="dropdown-item">notification 3</li>
        </ul>
      </div>
      
      <NavLink to='/createpost'>
        <Button className="me-2">Post</Button>
      </NavLink>

      <div className="dropdown">
        <Button className="btn dropdown-toggle" type="button" id="profile-dropdown" data-bs-toggle="dropdown">
          <FontAwesomeIcon icon={faPerson} className="text-white"></FontAwesomeIcon>
        </Button>
        <div className="dropdown-menu" aria-labelledby="profile-dropdown">
          <NavLink to="profile" className="dropdown-item">Profile</NavLink>
          <NavLink to="update-profile" className="dropdown-item">Settings</NavLink>
          <button onClick={handleLogout} className="dropdown-item">Logout</button>
        </div>
      </div>
    </ul>
  );
}
 
export default SignedInLinks;