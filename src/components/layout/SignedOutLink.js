import { NavLink } from "react-router-dom";
import SignIn from "../auth/SignIn";

const SignedOutLinks = () => {
  return (  
    <ul className="signed-in-out-links">
      <li><NavLink to='/'>Signup</NavLink></li>
      <li><NavLink to='/'>Login</NavLink></li>
      <SignIn />
    </ul>
  );
}
 
export default SignedOutLinks;