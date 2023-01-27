import { NavLink } from "react-router-dom";
import SignIn from "../auth/SignIn";
import { useState } from "react";
import SignUp from "../auth/SignUp";

const SignedOutLinks = () => {

  const [loginForm, setLoginForm] = useState(false);
  const [signupForm, setSignupForm] = useState(false);

  return (  
    <ul className="signed-in-out-links">
      <button 
      onClick={() => (setSignupForm(!signupForm))}
      className='navbar-button'>
        <NavLink to='/'>Signup</NavLink>
      </button>

      <button 
      onClick={() => (setLoginForm(!loginForm))}
      className='navbar-button'>
        <NavLink to='/'>Login</NavLink>
      </button>
      {loginForm ? (
        <SignIn loginForm={loginForm} setLoginForm={setLoginForm}/>
      ): null}
      {signupForm ? (
        <SignUp signupForm={signupForm} setSignupForm={setSignupForm}/>
      ): null}
    </ul>
  );
}
 
export default SignedOutLinks;