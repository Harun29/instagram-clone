import { NavLink } from "react-router-dom";
import { useState } from "react";
import Notifications from "./Notifications";

const SignedInLinks = () => {

  const [notifDropdown, setNotifDropdown] = useState(false);

  return ( 
    <ul className="signed-in-out-links">
      <li onClick={() => setNotifDropdown(!notifDropdown)} className="notif-button">
        Notifications

        {notifDropdown ? (
        <Notifications />
        ) : null}
      </li>

      <li><NavLink to='/'>Log Out</NavLink></li>
      <li><NavLink to='/' >HI</NavLink></li>
    </ul>
  );
}
 
export default SignedInLinks;