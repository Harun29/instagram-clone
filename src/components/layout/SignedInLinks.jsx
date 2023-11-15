import { NavLink } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";

const SignedInLinks = () => {

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
    <ul>
      <div className="notif-dropdown">
        <button className="dropdown-toggle" onClick={toggleDropdown}>
          <FontAwesomeIcon icon={faBell} className="text-white"></FontAwesomeIcon>
        </button>
        {notifs && notifNumber > 0 ? <div className="notif-count">
          {notifs ? notifNumber : null}
        </div> : null}
        {dropdown ?
          <ul className="dropdown-menu" style={{ minWidth: '400px', marginLeft: '-225px', marginTop: '10px' }}>
            {notifs ? (
              notifs.map((notif, index) => (
                <li key={index} id={notif.opened ? 'opened-notification' : 'notification'}>
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

      </div>

      <NavLink to='/createpost'>
        <Button className="me-2">Post</Button>
      </NavLink>

          {/* <NavLink to="update-profile" className="dropdown-item">Settings</NavLink> */}
          {/* <button onClick={handleLogout} className="dropdown-item">Logout</button> */}

    </ul>
  );
}

export default SignedInLinks;