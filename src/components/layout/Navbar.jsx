import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
// import SignedInLinks from "./SignedInLinks";
import { faPerson, faHouse, faSearch, faCompass, faMessage, faHeart, faPlusSquare, faList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Navigation = () => {

  const {currentUser} = useContext(AuthContext)

  return ( 
    <nav className="nav-wrapper">
      <div className="container">
        <Link to='/' className="brand-logo">
          <h1>
            Blog
          </h1>
        </Link>
        <Link to='/'>
          <FontAwesomeIcon icon={faHouse}></FontAwesomeIcon>
          <button>Home</button>
        </Link>
        <div className="search-bar">
          <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
          <button>Search</button>
        </div>
        <Link to="">
          <FontAwesomeIcon icon={faCompass}></FontAwesomeIcon>
          <button>Explore</button>
        </Link>
        <Link to="">
          <FontAwesomeIcon icon={faMessage}></FontAwesomeIcon>
          <button>Messages</button>
        </Link>
        <Link to="">
          <FontAwesomeIcon icon={faHeart}></FontAwesomeIcon>
          <button>Notifications</button>
        </Link>
        <Link to='/createpost'>
          <FontAwesomeIcon icon={faPlusSquare}></FontAwesomeIcon>
          <button>Create</button>
        </Link>
        <Link to='/profile'>
          <FontAwesomeIcon icon={faPerson}></FontAwesomeIcon>
          <button>Profile</button>
        </Link>
        {/* {currentUser ? <SignedInLinks /> : null} */}
      </div>
      <footer>
        <FontAwesomeIcon icon={faList}></FontAwesomeIcon>
        <button>more</button>
      </footer>
    </nav>
   );
}
 
export default Navigation;