import { NavLink } from "react-router-dom";

const SignedOutLinks = () => {
  return (  
    <ul className="signed-in-out-links">
      <li><NavLink to='/'>Signup</NavLink></li>
      <li><NavLink to='/'>Login</NavLink></li>
    </ul>
  );
}
 
export default SignedOutLinks;