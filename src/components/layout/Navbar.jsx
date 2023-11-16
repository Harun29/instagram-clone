import { Link } from "react-router-dom";
// import SignedInLinks from "./SignedInLinks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPerson, faHouse, faSearch, faCompass, faMessage, faHeart, faPlusSquare, faList } from "@fortawesome/free-solid-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";

const Navigation = () => {

  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getUserByEmail } = useAuth()
  const { logout } = useAuth();
  const [error, setError] = useState("");
  // const [user, setUser] = useState();
  const [notifs, setNotifs] = useState();
  const [notifNumber, setNotifNumber] = useState(0)
  const [dropdown, setDropdown] = useState(false);

  useEffect(() => {

    const fetchUser = async (email) => {
      const user = await getUserByEmail(email);
      // setUser(user);
      setNotifs(user.notif);
    }

    try {
      currentUser && fetchUser(currentUser.email);
    } catch (err) {
      console.error("error in fetch user: ", err)
    }
  }, [currentUser, getUserByEmail])

  const handleLogout = async () => {
    setError('')
    try {
      await logout()
      navigate('/')
    } catch (err) {
      setError('Failed to logout')
      console.log(err)
    }
  }

  useEffect(() => {
    if (error) {
      console.log(error)
    }
  }, [error])

  const handleOpened = async (e) => {
    const notifLikeObject = (notifStatus) => {
      const object = {
        postLiked: e.postLiked,
        postLikedPhoto: e.postLikedPhoto,
        likedBy: e.likedBy,
        likedByPhoto: e.likedByPhoto,
        opened: notifStatus,
        notifRef: e.notifRef,
        notifType: "like"
      }
      return object
    }
    const notifFollowObject = (notifStatus) => {
      const object = {
        followedBy: e.followedBy,
        likedByPhoto: e.likedByPhoto,
        opened: notifStatus,
        notifRef: e.notifRef,
        notifType: "follow"
      }
      return object
    }

    if (!e.opened && e.notifType === "like") {
      await updateDoc(e.notifRef, {
        notif: arrayRemove(notifLikeObject(false))
      });
      await updateDoc(e.notifRef, {
        notif: arrayUnion(notifLikeObject(true))
      });
    } else {
      await updateDoc(e.notifRef, {
        notif: arrayRemove(notifFollowObject(false))
      });
      await updateDoc(e.notifRef, {
        notif: arrayUnion(notifFollowObject(true))
      });
    }
  }

  useEffect(() => {

    if (notifs) {
      setNotifNumber(0)
      console.log(notifs)
      notifs.forEach(notif => {
        if (!notif.opened) (
          setNotifNumber(prevNotifNumber => prevNotifNumber + 1)
        )
      })
    }
  }, [notifs])

  const toggleDropdown = () => {
    setDropdown(prevDropdown => !prevDropdown)
  }

  return (
    <nav className='nav-wrapper'>
      <div className="container">
        <Link to='/' className="brand-logo">
          {!dropdown ? <h1>Blog</h1> :
          <FontAwesomeIcon icon={faInstagram}></FontAwesomeIcon>}
        </Link>
        <Link to='/'>
          <FontAwesomeIcon icon={faHouse}></FontAwesomeIcon>
          {!dropdown ? <button>Home</button> : null}
        </Link>
        <div className="menu-bar">
          <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
          {!dropdown ? <button>Search</button> : null}
        </div>
        <Link to="">
          <FontAwesomeIcon icon={faCompass}></FontAwesomeIcon>
          {!dropdown ? <button>Explore</button> : null}
        </Link>
        <Link to="">
          <FontAwesomeIcon icon={faMessage}></FontAwesomeIcon>
          {!dropdown ? <button>Messages</button> : null}
        </Link>
        <div onClick={toggleDropdown} className="menu-bar notif-icon">
          <FontAwesomeIcon icon={faHeart}></FontAwesomeIcon>
          {notifs && notifNumber > 0 ? <div className="notif-count">
            {notifs ? notifNumber : null}
          </div> : null}
          {!dropdown ? <button>Notifications</button> : null}
        </div>
        <Link to='/createpost'>   
          <FontAwesomeIcon icon={faPlusSquare}></FontAwesomeIcon>
          {!dropdown ? <button>Create</button> : null}          
        </Link>
        <Link to='/profile'>
          <FontAwesomeIcon icon={faPerson}></FontAwesomeIcon>
          {!dropdown ? <button>Profile</button> : null}
        </Link>
        {/* {currentUser ? <SignedInLinks /> : null} */}
      </div>
      <footer>
        <FontAwesomeIcon icon={faList}></FontAwesomeIcon>
        {!dropdown ? <button>More</button> : null}
      </footer>

      {dropdown ?
        <ul className="dropdown-menu">
          <h1 className="notifications-heading">
            Notifications
          </h1>
          {notifs ? (
            notifs.map((notif, index) => (
              <li key={index} className="notification">
                {notif.notifType === "like" ?
                  <div className="notification-container">
                    <Link className="notif-by" to={`/user/${notif.likedBy}`}>
                      <img src={notif.likedByPhoto ? notif.likedByPhoto : '/blank-profile.jpg'} alt="liked" />
                      <strong>{notif.likedBy}</strong>
                    </Link>{' '}
                    <Link onClick={() => handleOpened(notif)} className="post-link-notif" to={`/post/${notif.postLiked}`}>
                      <label>Liked your post</label>
                      <img src={notif.postLikedPhoto} alt="" />
                    </Link>
                  </div>
                  :
                  <div className="notification-container">
                    <Link onClick={() => handleOpened(notif)} className="notif-by follow-notif-link" to={`/user/${notif.followedBy}`}>
                      <div>
                        <img src={notif.likedByPhoto ? notif.likedByPhoto : '/blank-profile.jpg'} alt="liked" />
                        <strong>{notif.followedBy}</strong>
                      </div>
                      <label>Started Following You!</label>
                    </Link>
                  </div>
                }

              </li>
            ))
          ) : (
            <div>Loading...</div>
          )}
        </ul>
        : null}
    </nav>
  );
}

export default Navigation;