import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import SignedInLinks from "./SignedInLinks";
import SignedOutLinks from "./SignedOutLink";
import Navbar from "react-bootstrap/Navbar";

const Navigation = () => {

  const {currentUser} = useContext(AuthContext)

  return ( 
    <Navbar className="nav-wrapper">
      <div className="container">
        <Link to='/' className="brand-logo">
          <h1>
            Blog
          </h1>
        </Link>
        {currentUser ? <SignedInLinks /> : <SignedOutLinks />}
      </div>
    </Navbar>
   );
}
 
export default Navigation;