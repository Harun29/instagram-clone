import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import HomeIcon from "../../icons/HomeIcon";
import SearchIcon from "../../icons/SearchIcon";
import HeartIcon from "../../icons/HeartIcon";
import HeartIconFull from "../../icons/HeartIconFull";
import CompassIcon from "../../icons/CompasIcon";
import MessageCircleIcon from "../../icons/MessageCircleIcon";
import PlusIcon from "../../icons/PlusIcon";
import ListIcon from "../../icons/ListIcon";
import ListIconBold from "../../icons/ListIconBold";
import HomeIconFull from "../../icons/HomeIconFull";
import SettingsIcon from "../../icons/SettingsIcon";
import SaveIcon from "../../icons/SaveIcon";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../config/firebase";

const Navigation = () => {

  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getUserByEmail } = useAuth()
  const { logout } = useAuth();
  const [error, setError] = useState("");
  const [notifs, setNotifs] = useState();
  const [notifNumber, setNotifNumber] = useState(0)
  const [dropdown, setDropdown] = useState(false);
  const [moreDropdown, setMoreDropdown] = useState(false);
  const [userPhoto, setUserPhoto] = useState('blank-profile.jpg');

  useEffect(() => {
    const fetchUser = async (email) => {
      const user = await getUserByEmail(email);
      // setUser(user);
      setNotifs(user.notif);
      if (user.pphoto) {
        const userPhotoUrl = await getDownloadURL(ref(storage, `profile_pictures/${user.pphoto}`));
        setUserPhoto(userPhotoUrl);
      }
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
      navigate('/signup')
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

  const handleDropdown = () => {
    setDropdown(prevDropdown => !prevDropdown)
  }

  const handleMoreDropdown = () => {
    setMoreDropdown(prevMoreDropdown => !prevMoreDropdown)
  }

  return (
    <div>
      <nav className='nav-wrapper'>
        <div className={`container${dropdown ? " active" : ''}`}>
          <Link onClick={dropdown ? handleDropdown : null} to='/' className="brand-logo">
            {!dropdown ? <h1 style={{ fontFamily: 'Oleo Script' }}>igclone</h1> :
              <FontAwesomeIcon icon={faInstagram}></FontAwesomeIcon>}
          </Link>
          <Link onClick={dropdown ? handleDropdown : null} to='/'>
            {
              window.location.pathname === '/' && !dropdown ?
                <HomeIconFull></HomeIconFull> :
                <HomeIcon></HomeIcon>
            }
            {!dropdown ? <button style={window.location.pathname === '/' ? { fontWeight: '700' } : null}>Home</button> : null}
          </Link>
          <div className="menu-bar">
            <SearchIcon></SearchIcon>
            {!dropdown ? <button>Search</button> : null}
          </div>
          <Link to="">
            <CompassIcon></CompassIcon>
            {!dropdown ? <button>Explore</button> : null}
          </Link>
          <Link to="">
            <MessageCircleIcon></MessageCircleIcon>
            {!dropdown ? <button>Messages</button> : null}
          </Link>
          <div onClick={handleDropdown} className="menu-bar notif-icon">
            {
              dropdown ?
                <HeartIconFull></HeartIconFull> :
                <HeartIcon></HeartIcon>
            }
            {notifs && notifNumber > 0 ? <div className="notif-count">
              {notifs ? notifNumber : null}
            </div> : null}
            {!dropdown ? <button>Notifications</button> : null}
          </div>
          <Link to='/createpost'>
            <PlusIcon></PlusIcon>
            {!dropdown ? <button>Create</button> : null}
          </Link>
          <Link to='/profile'>
            <img src={userPhoto} style={window.location.pathname === '/profile' ? { border: '2px solid black', width: '31px', height: '31px' } : null} alt="user" className="profile-photo navbar" />
            {!dropdown ? <button style={window.location.pathname === '/profile' ? { fontWeight: '700'} : null}>Profile</button> : null}
          </Link>
        </div>
        <footer onClick={handleMoreDropdown}>
          {
            moreDropdown ?
              <ListIconBold></ListIconBold> :
              <ListIcon></ListIcon>
          }
          {!dropdown ? <button style={moreDropdown ? { fontWeight: '700' } : null}>More</button> : null}
        </footer>
        {moreDropdown ?
          <div className="more-dropdown-container">

            <Link to="/settings" className="more-dropdown-element menu-bar">
              <SettingsIcon></SettingsIcon>
              <button>Settings</button>
            </Link>
            <div className="more-dropdown-element menu-bar">
              <SaveIcon></SaveIcon>
              <button>Saved</button>
            </div>
            <Link onClick={handleLogout} className="more-dropdown-element menu-bar">
              <button>Logout</button>
            </Link>
          </div>
          :
          null
        }
      </nav>

      <ul className={`dropdown-menu${dropdown ? ' active' : ''}`}>
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
    </div>
  );
}

export default Navigation;