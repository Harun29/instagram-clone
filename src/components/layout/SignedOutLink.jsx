import Button from "react-bootstrap/Button"
import { Link } from "react-router-dom";

const SignedOutLinks = () => {

  return (  
    <div className="signed-in-out-links">
      <Link to="/signup">
       Signup
      </Link>

      <Link to="/login">
       Login
      </Link>

    </div>
  );
}
 
export default SignedOutLinks;