import Button from "react-bootstrap/Button"
import { Link } from "react-router-dom";

const SignedOutLinks = () => {

  return (  
     <ul className="d-flex mt-3">
      <Link to="/signup">
       Signup
      </Link>

      <Link to="/login">
       Login
      </Link>

    </ul>
  );
}
 
export default SignedOutLinks;