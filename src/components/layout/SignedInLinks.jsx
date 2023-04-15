import { NavLink } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

const SignedInLinks = () => {

  return ( 
    <ul className="signed-in-out-links d-flex">

      <div className="dropdown me-2">
        <Button className="btn dropdown-toggle" type="button" id="notif-dropdown" data-bs-toggle="dropdown">
          <FontAwesomeIcon icon={faBell}></FontAwesomeIcon>
        </Button>
        <ul className="dropdown-menu" aria-labelledby="notif-dropdown">
          <li className="dropdown-item">notification 1</li>
          <li className="dropdown-item">notification 2</li>
          <li className="dropdown-item">notification 3</li>
        </ul>      
      </div>
      
      <NavLink to='/createpost'>
        <Button className="navbar-button me-2">Post</Button>
      </NavLink>
      <NavLink to='/profile'>
        <Button className="profile-picture me-2">Profile</Button>
      </NavLink>
    </ul>
  );
}
 
export default SignedInLinks;