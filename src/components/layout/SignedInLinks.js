import { NavLink } from "react-router-dom";

const SignedInLinks = () => {
  return ( 
    <ul className="signed-in-out-links">
      <li><NavLink to='/'>Notifications</NavLink></li>
      <li><NavLink to='/'>Log Out</NavLink></li>
      <li><NavLink to='/' className='profile-picture-wrapper'>HI</NavLink></li>
    </ul>
  );
}
 
export default SignedInLinks;