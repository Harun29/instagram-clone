import { NavLink } from "react-router-dom";
import SignIn from "../auth/SignIn";
import { useState } from "react";
import SignUp from "../auth/SignUp";

const SignedOutLinks = () => {

  const [loginForm, setLoginForm] = useState(false);
  const [signupForm, setSignupForm] = useState(false);

  return (  
    <ul className="signed-in-out-links">
      <li onClick={() => (setSignupForm(!signupForm))}><NavLink to='/'>Signup</NavLink></li>
      <li onClick={() => (setLoginForm(!loginForm))}><NavLink to='/'>Login</NavLink></li>
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