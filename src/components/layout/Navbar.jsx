import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import SignedInLinks from "./SignedInLinks";
import SignedOutLinks from "./SignedOutLink";

const Navbar = () => {

  const {currentUser} = useContext(AuthContext)

  return ( 
    <nav className="nav-wrapper">
      <div className="container">
        <Link to='/' className="brand-logo">Blog</Link>
        {currentUser ? <SignedInLinks /> : <SignedOutLinks />}
      </div>
    </nav>
   );
}
 
export default Navbar;