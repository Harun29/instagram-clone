import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import {
  updateDoc,
  arrayRemove,
  arrayUnion,
  collection,
  where,
  query,
  getDocs,
  or,
} from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../config/firebase";
import { useRef } from "react";
import HomeIcon from "../../icons/HomeIcon";
import SearchIcon from "../../icons/SearchIcon";
import HeartIcon from "../../icons/HeartIcon";
import HeartIconFull from "../../icons/HeartIconFull";
import CompassIcon from "../../icons/CompasIcon";
import MessageCircleIcon from "../../icons/MessageCircleIcon";
import MessageCircleIconFull from "../../icons/MessageCircleIconFull";
import PlusIcon from "../../icons/PlusIcon";
import ListIcon from "../../icons/ListIcon";
import ListIconBold from "../../icons/ListIconBold";
import HomeIconFull from "../../icons/HomeIconFull";
import SettingsIcon from "../../icons/SettingsIcon";
import SaveIcon from "../../icons/SaveIcon";
import CreatePost from "../projects/CreatePost";
import ExitIcon from "../../icons/xIcon";
import { db } from "../../config/firebase";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getUserByEmail } = useAuth();
  const { logout } = useAuth();
  const [error, setError] = useState("");
  const [notifs, setNotifs] = useState([]);
  const [notifNumber, setNotifNumber] = useState(0);
  const [dropdown, setDropdown] = useState(false);
  const [moreDropdown, setMoreDropdown] = useState(false);
  const [userPhoto, setUserPhoto] = useState("/blank-profile.jpg");
  const [userName, setUserName] = useState();
  const [createPost, setCreatePost] = useState(false);
  const [searchDropdown, setSearchDropdown] = useState(false);
  const [hide, setHide] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [buttonClicked, setButtonClicked] = useState(false);
  const createRef = useRef(null);
  const moreDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickInsideDropdown =
        moreDropdownRef.current &&
        moreDropdownRef.current.contains(event.target);
      const isClickInsideBottomExcludedRegion =
        event.clientY > window.innerHeight - 55;

      if (!isClickInsideDropdown && !isClickInsideBottomExcludedRegion) {
        setMoreDropdown(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [moreDropdown]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickInsideCreate =
        createRef.current && createRef.current.contains(event.target);

      if (!isClickInsideCreate && !buttonClicked) {
        setCreatePost(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [createPost, buttonClicked]);

  useEffect(() => {
    createPost && setButtonClicked(false)
  }, [createPost])
  
  const handleCreatePost = () => {
    setButtonClicked(true);
    setCreatePost(!createPost);
  };

  useEffect(() => {
    const fetchUsers = async (input) => {
      const q = query(
        collection(db, "users"),
        or(where("name", "==", input), or(where("userName", "==", input))),
      );
      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
          const newDocument = doc.data();
          let imgUrl = 'blank-profile.jpg'
          if(doc.data().pphoto){
            imgUrl = await getDownloadURL(
              ref(storage, `profile_pictures/${doc.data().pphoto}`),
            );
          }
          newDocument.pphoto = imgUrl;
          let found = false;
          searchResults.forEach((result) => {
            if (result.userName === doc.data().userName) {
              found = true;
            }
          });
          !found &&
            setSearchResults((prevResults) => [...prevResults, newDocument]);
        });
      } catch (err) {
        console.error(err);
      }
    };
    try {
      fetchUsers(searchInput);
    } catch (err) {
      console.error(err);
    }
  }, [searchInput, searchResults]);

  useEffect(() => {
    const fetchUser = async (email) => {
      const user = await getUserByEmail(email);
      // setUser(user);
      setNotifs(user.notif?.reverse());
      if (user.pphoto) {
        const userPhotoUrl = await getDownloadURL(
          ref(storage, `profile_pictures/${user.pphoto}`),
        );
        setUserPhoto(userPhotoUrl);
      }
      setUserName(user.userName);
    };

    try {
      currentUser && fetchUser(currentUser.email);
    } catch (err) {
      console.error("error in fetch user: ", err);
    }
  }, [currentUser, getUserByEmail]);

  const handleLogout = async () => {
    setError("");
    try {
      await logout();
      navigate("/signup");
    } catch (err) {
      setError("Failed to logout");
      console.log(err);
    }
  };

  useEffect(() => {
    if (error) {
      console.log(error);
    }
  }, [error]);

  const handleOpened = async (e) => {
    const notifLikeObject = (notifStatus) => {
      const object = {
        postLiked: e.postLiked,
        postLikedPhoto: e.postLikedPhoto,
        likedBy: e.likedBy,
        likedByPhoto: e.likedByPhoto,
        opened: notifStatus,
        notifRef: e.notifRef,
        notifType: "like",
      };
      return object;
    };
    const notifFollowObject = (notifStatus) => {
      const object = {
        followedBy: e.followedBy,
        likedByPhoto: e.likedByPhoto,
        opened: notifStatus,
        notifRef: e.notifRef,
        notifType: "follow",
      };
      return object;
    };

    const notifCommentObject = (notifStatus) => {
      const object = {
        commentedBy: e.commentedBy,
        commentedByPhoto: e.commentedByPhoto,
        opened: notifStatus,
        notifRef: e.notifRef,
        notifType: "comment",
        postCommented: e.postCommented,
        postCommentedPhoto: e.postCommentedPhoto,
      };
      return object;
    };

    if (!e.opened && e.notifType === "like") {
      await updateDoc(e.notifRef, {
        notif: arrayRemove(notifLikeObject(false)),
      });
      await updateDoc(e.notifRef, {
        notif: arrayUnion(notifLikeObject(true)),
      });
    } else if (!e.opened && e.notifType === "follow") {
      await updateDoc(e.notifRef, {
        notif: arrayRemove(notifFollowObject(false)),
      });
      await updateDoc(e.notifRef, {
        notif: arrayUnion(notifFollowObject(true)),
      });
    } else if (!e.opened && e.notifType === "comment") {
      await updateDoc(e.notifRef, {
        notif: arrayRemove(notifCommentObject(false)),
      });
      await updateDoc(e.notifRef, {
        notif: arrayUnion(notifCommentObject(true)),
      });
    }
  };

  useEffect(() => {
    if (notifs) {
      setNotifNumber(0);
      notifs.forEach((notif) => {
        if (!notif.opened)
          setNotifNumber((prevNotifNumber) => prevNotifNumber + 1);
      });
    }
  }, [notifs]);

  const handleDropdown = () => {
    const stateCheck = dropdown;
    setSearchDropdown(false);
    setDropdown((prevDropdown) => !prevDropdown);
    if (!stateCheck) {
      setHide(true);
    } else if (!location.pathname.includes("/messenger")) setHide(false);
  };

  const handleSearchDropdown = () => {
    const stateCheck = searchDropdown;
    setDropdown(false);
    setSearchDropdown((prevSearchDropdown) => !prevSearchDropdown);
    if (!stateCheck) {
      setHide(true);
    } else if (!location.pathname.includes("/messenger")) {
      setHide(false);
    }
  };

  const handleHide = () => {
    setDropdown(false);
    setSearchDropdown(false);
    setHide(false);
  };

  const handleMoreDropdown = () => {
    setMoreDropdown((prevMoreDropdown) => !prevMoreDropdown);
  };

  useEffect(() => {
    location.pathname.includes("/messenger") && setHide(true);
  }, [location]);

  const deleteNotif = async (e) => {
    await updateDoc(e.notifRef, {
      notif: arrayRemove(e),
    });
    setNotifs(notifs.filter((notif) => e.notifRef !== notif.notifRef));
  };

  return (
    <div className="navigation-container">
      <nav className="nav-wrapper">
        <div className="container">
          <div>
          <Link
            onClick={hide && handleHide}
            to="/"
            className={`brand-logo logo-on-top ${!hide ? "active" : ""}`}
          >
            <h1
              className={`logo-name ${hide ? " active" : ""}`}
              style={{ fontFamily: "Oleo Script" }}
            >
              igclone
            </h1>
            <FontAwesomeIcon icon={faInstagram}></FontAwesomeIcon>
          </Link>
          </div>
          <Link onClick={hide && handleHide} to="/">
            {window.location.pathname === "/" && !hide ? (
              <HomeIconFull />
            ) : (
              <HomeIcon />
            )}
            <button
              className={`notif-button ${hide && " active"}`}
              style={
                window.location.pathname === "/" ? { fontWeight: "700" } : null
              }
            >
              Home
            </button>
          </Link>
          <div
            style={searchDropdown ? { border: "1px solid #c7c7c7" } : null}
            onClick={handleSearchDropdown}
            className="menu-bar"
          >
            <SearchIcon></SearchIcon>
            <button className={`notif-button ${hide && " active"}`}>
              Search
            </button>
          </div>
          <Link to="">
            <CompassIcon></CompassIcon>
            <button className={`notif-button ${hide && " active"}`}>
              Explore
            </button>
          </Link>
          <Link onClick={hide && handleHide} to="/messenger">
            {window.location.pathname === "/messenger" ? (
              <MessageCircleIconFull />
            ) : (
              <MessageCircleIcon />
            )}
            <button className={`notif-button ${hide && " active"}`}>
              Messages
            </button>
          </Link>
          <div
            onClick={handleDropdown}
            style={dropdown ? { border: "1px solid #c7c7c7" } : null}
            className="menu-bar notif-icon"
          >
            {dropdown ? (
              <HeartIconFull></HeartIconFull>
            ) : (
              <HeartIcon></HeartIcon>
            )}
            {notifs && notifNumber > 0 ? (
              <div className="notif-count">{notifs ? notifNumber : null}</div>
            ) : null}
            <button className={`notif-button ${hide && " active"}`}>
              Notifications
            </button>
          </div>
          <div onClick={handleCreatePost} className="menu-bar">
            <PlusIcon></PlusIcon>
            <button className={`notif-button ${hide && " active"}`}>
              Create
            </button>
          </div>
          <Link onClick={hide && handleHide} to="/profile">
            <img
              src={userPhoto}
              style={
                window.location.pathname === "/profile"
                  ? { border: "2px solid black", width: "31px", height: "31px" }
                  : null
              }
              alt="user"
              className="profile-photo navbar"
            />
            <button
              style={
                window.location.pathname === "/profile"
                  ? { fontWeight: "700" }
                  : null
              }
              className={`notif-button ${hide && " active"}`}
            >
              Profile
            </button>
          </Link>
        </div>
        <footer onClick={handleMoreDropdown}>
          {dropdown ? <ListIconBold></ListIconBold> : <ListIcon></ListIcon>}
          <button
            className={`notif-button ${hide && " active"}`}
            style={moreDropdown ? { fontWeight: "700" } : null}
          >
            More
          </button>
        </footer>
        {moreDropdown ? (
          <div ref={moreDropdownRef} className="more-dropdown-container">
            <Link to="/settings" className="more-dropdown-element menu-bar">
              <SettingsIcon></SettingsIcon>
              <button>Settings</button>
            </Link>
            <div className="more-dropdown-element menu-bar">
              <SaveIcon></SaveIcon>
              <button>Saved</button>
            </div>
            <Link
              onClick={handleLogout}
              className="more-dropdown-element menu-bar"
            >
              <button>Logout</button>
            </Link>
          </div>
        ) : null}
      </nav>

      <ul className={`dropdown-menu${dropdown ? " active" : ""}`}>
        <h1 className="notifications-heading">Notifications</h1>
        {notifs ?
          notifs.map((notif, index) => (
            <li key={index} className="notification">
              {notif.notifType === "like" ? (
                <div className="notification-container">
                  <Link className="notif-by" to={`/user/${notif.likedBy}`}>
                    <img
                      src={
                        notif.likedByPhoto
                          ? notif.likedByPhoto
                          : "/blank-profile.jpg"
                      }
                      alt="liked"
                    />
                    <strong>{notif.likedBy}</strong>
                    <label>Liked your post</label>
                  </Link>{" "}
                  <div className="photo-and-exit">
                    <Link
                      onClick={() => handleOpened(notif)}
                      className="post-link-notif"
                      to={`/post/${notif.postLiked}`}
                    >
                      <img src={notif.postLikedPhoto} alt="" />
                    </Link>
                    <button
                      onClick={() => deleteNotif(notif)}
                      className="exit-button"
                    >
                      <ExitIcon></ExitIcon>
                    </button>
                  </div>
                </div>
              ) : null}
              {notif.notifType === "follow" ? (
                <div className="notification-container">
                  <Link
                    onClick={() => handleOpened(notif)}
                    className="notif-by follow-notif-link"
                    to={`/user/${notif.followedBy}`}
                  >
                    <div>
                      <img
                        src={
                          notif.likedByPhoto
                            ? notif.likedByPhoto
                            : "/blank-profile.jpg"
                        }
                        alt="liked"
                      />
                      <strong>{notif.followedBy}</strong>
                      <label>Started Following You!</label>
                    </div>
                  </Link>
                  <button
                    onClick={() => deleteNotif(notif)}
                    className="exit-button"
                  >
                    <ExitIcon></ExitIcon>
                  </button>
                </div>
              ) : null}
              {notif.notifType === "comment" ? (
                <div className="notification-container">
                  <Link
                    className="notif-by follow-notif-link"
                    to={`/user/${notif.commentedBy}`}
                  >
                    <div>
                      <img
                        src={
                          notif.commentedByPhoto
                            ? notif.commentedByPhoto
                            : "/blank-profile.jpg"
                        }
                        alt="liked"
                      />
                      <strong>{notif.commentedBy}</strong>
                      <label>Commented your photo</label>
                    </div>
                  </Link>
                  <div className="photo-and-exit">
                    <Link
                      onClick={() => handleOpened(notif)}
                      className="post-link-notif"
                      to={`/post/${notif.postCommented}`}
                    >
                      <img src={notif.postCommentedPhoto} alt="" />
                    </Link>
                    <button
                      onClick={() => deleteNotif(notif)}
                      className="exit-button"
                    >
                      <ExitIcon></ExitIcon>
                    </button>
                  </div>
                </div>
              ) : null}
            </li>
          )) :
          <div className="empty-notifications-div">
            <div className="empty-notifications-heart">
              <HeartIcon size={"45"}></HeartIcon>  
            </div>
            <span>Activity On Your Posts</span>
            <span>When someone likes or comments on one of your posts, you'll see it here.</span>
          </div>}
      </ul>

      <ul className={`dropdown-menu${searchDropdown ? " active" : ""}`}>
        <div className="search-box">
          <h1 className="notifications-heading">Search</h1>
          <input
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search"
            className="search-input"
            type="text"
          />
          <div className="hr"></div>
          <div className="search-result">
            {searchResults.map((result, index) => (
              <Link
                to={`/user/${result.userName}`}
                key={index}
                className="result-box"
              >
                <img src={result.pphoto} alt="" />
                <div className="result-names">
                  <span>{result.userName}</span>
                  <span>{result.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </ul>

      {createPost ? (
        <CreatePost
          createRef={createRef}
          userPhoto={userPhoto}
          userName={userName}
          setCreatePost={() => setCreatePost(false)}
        ></CreatePost>
      ) : null}
    </div>
  );
};

export default Navigation;
