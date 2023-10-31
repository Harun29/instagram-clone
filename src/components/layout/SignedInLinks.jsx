import { NavLink } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faPerson } from "@fortawesome/free-solid-svg-icons";
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

  useEffect(() => {

    const fetchUser = async (email) => {
      const user = await getUserByEmail(email);
      // setUser(user);
      setNotifs(user.likeNotif);
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

  const handleOpened = async(e) => {
    if(!e.opened){
      await updateDoc(e.notifRef, {
        likeNotif: arrayRemove({
          postLiked: e.postLiked,
          postLikedPhoto: e.postLikedPhoto,
          likedBy: e.likedBy,
          likedByPhoto: e.likedByPhoto,
          opened: false,
          notifRef: e.notifRef
        })
      });
      await updateDoc(e.notifRef, {
        likeNotif: arrayUnion({
          postLiked: e.postLiked,
          postLikedPhoto: e.postLikedPhoto,
          likedBy: e.likedBy,
          likedByPhoto: e.likedByPhoto,
          opened: true,
          notifRef: e.notifRef
        })
      });
    }
  }

  return (
    <ul className="d-flex mt-3">

      <div className="notif-dropdown dropdown me-2">
        <Button className="btn dropdown-toggle" type="button" id="notif-dropdown" data-bs-toggle="dropdown">
          <FontAwesomeIcon icon={faBell} className="text-white"></FontAwesomeIcon>
        </Button>
        <div className="notif-count">
          {notifs ? notifs.length : null}
        </div>
        <ul className="dropdown-menu" style={{ minWidth: '400px', marginLeft: '-225px', marginTop: '10px' }}>
          {notifs ? (
            notifs.map((notif, index) => (
              <li key={index} className='px-2 list-group-item d-flex align-items-center justify-content-between' id={notif.opened ? 'opened-notification' : 'notification'}>
                <Link className="me-3 notif-by" to={`/user/${notif.likedBy}`}>
                  <img src={notif.likedByPhoto ? notif.likedByPhoto : '/blank-profile.jpg'} alt="liked" />
                  <strong>{notif.likedBy}</strong>
                </Link>{' '}
                <Link onClick={() => handleOpened(notif)} className="post-link-notif" to={`/post/${notif.postLiked}`}>
                  <label>Liked your post</label>
                  <img src={notif.postLikedPhoto} alt="" />
                </Link>
              </li>
            ))
          ) : (
            <div>Loading...</div>
          )}
        </ul>
      </div>

      <NavLink to='/createpost'>
        <Button className="me-2">Post</Button>
      </NavLink>

      <div className="dropdown">
        <Button className="btn dropdown-toggle" type="button" id="profile-dropdown" data-bs-toggle="dropdown">
          <FontAwesomeIcon icon={faPerson} className="text-white"></FontAwesomeIcon>
        </Button>
        <div className="dropdown-menu" aria-labelledby="profile-dropdown">
          <NavLink to="profile" className="dropdown-item">Profile</NavLink>
          <NavLink to="update-profile" className="dropdown-item">Settings</NavLink>
          <button onClick={handleLogout} className="dropdown-item">Logout</button>
        </div>
      </div>
    </ul>
  );
}

export default SignedInLinks;