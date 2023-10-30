import { NavLink } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faPerson } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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

  return (
    <ul className="d-flex mt-3">

      <div className="notif-dropdown dropdown me-2">
        <Button className="btn dropdown-toggle" type="button" id="notif-dropdown" data-bs-toggle="dropdown">
          <FontAwesomeIcon icon={faBell} className="text-white"></FontAwesomeIcon>
        </Button>
        <div className="notif-count">
          {notifs ? notifs.length : null}
        </div>
        <ul className="dropdown-menu" style={{ minWidth: '250px' }} aria-labelledby="notif-dropdown">
          {notifs ? (
            notifs.map((notif, index) => (
              <li key={index} className="list-group-item d-flex align-items-center justify-content-center">
                <Link className="me-3 notif-by" to={`/user/${notif.likedBy}`}>
                  <img src={notif.likeByPhoto ? notif.likeByPhoto : '/blank-profile.jpg'} alt="liked" />
                  <strong>{notif.likedBy}</strong>
                </Link>{' '}
                <Link to={`/post/${notif.postLiked}`}>
                  Liked your post
                  {
                    <img src="" alt="" />
                  }
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