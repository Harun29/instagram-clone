import { Link } from "react-router-dom";

const SignedOutLinks = () => {

  return (  
     <ul className="d-flex mt-3">

      <Link to="/login" className="me-2 btn btn-primary">
        Login
      </Link>

      <Link to="/signup" className="btn btn-primary">
        Signup
      </Link> 

    </ul>
  );
}
 
export default SignedOutLinks;