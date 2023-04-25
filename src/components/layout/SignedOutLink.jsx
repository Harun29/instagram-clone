import { Link } from "react-router-dom";

const SignedOutLinks = () => {

  return (  
     <ul className="d-flex mt-3">
      <Link to="/signup" className="Button">
       Signup
      </Link>

      <Link to="/login" className="Button">
       Login
      </Link>

    </ul>
  );
}
 
export default SignedOutLinks;