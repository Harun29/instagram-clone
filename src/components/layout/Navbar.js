import { Link } from "react-router-dom";
import SignedInLinks from "./SignedInLinks";
import SignedOutLinks from "./SignedOutLink";

const Navbar = () => {

  return ( 
    <nav className="nav-wrapper">
      <div className="container">
        <Link to='/' className="brand-logo">Blog</Link>
        <SignedInLinks />
        <SignedOutLinks />
      </div>
    </nav>
   );
}
 
export default Navbar;