import { NavLink } from "react-router-dom";
import { useState } from "react";
import Notifications from "./Notifications";

const SignedInLinks = () => {

  const [notifDropdown, setNotifDropdown] = useState(false);

  return ( 
    <ul className="signed-in-out-links">
      <button onClick={() => setNotifDropdown(!notifDropdown)} className="navbar-button">
        Notifications

        {notifDropdown ? (
        <Notifications />
        ) : null}
      </button>
      
      <button className="navbar-button"><NavLink to='/'>Log Out</NavLink></button>
      <button className="profile-picture"><NavLink to='/' >HI</NavLink></button>
    </ul>
  );
}
 
export default SignedInLinks;