import { NavLink } from "react-router-dom";
import SignIn from "../auth/SignIn";
import { useState } from "react";

const SignedOutLinks = () => {

  const [loginForm, setLoginForm] = useState(false);

  return (  
    <ul className="signed-in-out-links">
      <li><NavLink to='/'>Signup</NavLink></li>
      <li onClick={() => (setLoginForm(!loginForm))}><NavLink to='/'>Login</NavLink></li>
      {loginForm ? (
        <SignIn loginForm={loginForm} setLoginForm={setLoginForm}/>
      ): null}
    </ul>
  );
}
 
export default SignedOutLinks;