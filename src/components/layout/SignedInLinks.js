import { NavLink } from "react-router-dom";
import { useState } from "react";
import Notifications from "./Notifications";

const SignedInLinks = () => {

  const [notifDropdown, setNotifDropdown] = useState(false);

  return ( 
    <ul className="signed-in-out-links">
      <button onClick={() => setNotifDropdown(!notifDropdown)} className="navbar-button notif-button">
        Notifications
      </button>
      {notifDropdown ? (
        <Notifications notifDropdown={notifDropdown} setNotifDropdown={setNotifDropdown}/>
        ) : null}
      
      <NavLink to='/createpost'>
        <button className="navbar-button">Post</button>
      </NavLink>
      <NavLink to='/profile'>
        <button className="profile-picture">Profile</button>
      </NavLink>
    </ul>
  );
}
 
export default SignedInLinks;