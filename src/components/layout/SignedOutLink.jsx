import Button from "react-bootstrap/Button"
import { Link } from "react-router-dom";

const SignedOutLinks = () => {

  return (  
    <ul className="signed-in-out-links">
      <Link 
      onClick={() => (setSignupForm(!signupForm))}
      className='Button me-3'>
      Signup
      </Link>

      <Link 
      onClick={() => (setLoginForm(!loginForm))}
      className='Button'>
      Login
      </Link>

    </ul>
  );
}
 
export default SignedOutLinks;