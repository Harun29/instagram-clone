import SignIn from "../auth/SignIn";
import { useState } from "react";
import SignUp from "../auth/SignUp";
import Button from "react-bootstrap/Button"

const SignedOutLinks = () => {

  const [loginForm, setLoginForm] = useState(false);
  const [signupForm, setSignupForm] = useState(false);

  return (  
    <ul className="signed-in-out-links">
      <Button 
      onClick={() => (setSignupForm(!signupForm))}
      className='navbar-button me-3'>
      Signup
      </Button>

      <Button 
      onClick={() => (setLoginForm(!loginForm))}
      className='navbar-button'>
      Login
      </Button>
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