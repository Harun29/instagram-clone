import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  arrayUnion,
  arrayRemove,
  doc,
  updateDoc,
  collection,
  query,
  getDocs,
  where,
} from "firebase/firestore";
import { storage, db } from "../../config/firebase";
import { ref, getDownloadURL } from "firebase/storage";
import Spinner from "react-bootstrap/Spinner";
import PostsList from "./PostsList";
import { useNavigate } from "react-router-dom";
import {} from "firebase/firestore";
import BorderAll from "../../icons/BorderAll";
import HeartIcon from "../../icons/HeartIcon";
import UserFollowList from "./UserFollowList";
import { motion } from "framer-motion";

const User = () => {
  const { currentUser } = useAuth();
  const { getUserByEmail } = useAuth();
  const { followersUpdate } = useAuth();
  const { followingUpdate } = useAuth();
  const { getUserByUsername } = useAuth();
  const navigate = useNavigate();

  const param = useParams();
  const [user, setUser] = useState();
  const [userId, setUserId] = useState();
  const [userViewing, setUserViewing] = useState();
  const [userViewingPhoto, setUserViewingPhoto] = useState("");

  const [currentProfilePhoto, setCurrentProfilePhoto] = useState(null);

  const [currentUserFollowing, setCurrentUserFollowing] = useState([]);
  const [userFollowers, setUserFollowers] = useState([]);
  const [followingStatus, setFollowingStatus] = useState(false);

  const [posts, setPosts] = useState(true);
  const [liked, setLiked] = useState(false);

  const [followers, setFollowers] = useState(false);
  const [following, setFollowing] = useState(false);
  const userRef = useRef(null);
  const [buttonClicked, setButtonClicked] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickInsidePost =
        userRef.current && userRef.current.contains(event.target);

      if (!isClickInsidePost && !buttonClicked) {
        setFollowers(false);
        setFollowing(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [followers, following, buttonClicked]);

  useEffect(() => {
    (followers || following) && setButtonClicked(false);
  }, [followers, following]);

  /* REDIRECTS CURRENT USER */

  useEffect(() => {
    if (user && currentUser && user.email === currentUser.email) {
      navigate("/profile");
    }
  }, [user, currentUser, navigate]);

  /* FATCHES USER WHO IS VIEWING THE PROFILE */

  useEffect(() => {
    const fetchUserByEmail = async (email) => {
      const user = await getUserByEmail(email);
      setUserViewing(user);
    };
    try {
      currentUser && fetchUserByEmail(currentUser.email);
    } catch (err) {
      console.error(err);
    }
  }, [currentUser, getUserByEmail]);

  /* SETS INITIAL FOLLOWING AND FOLLOWERS OF USER */

  useEffect(() => {
    if (user && userViewing) {
      setCurrentUserFollowing(userViewing.following);
      setUserFollowers(user.followers);
    }
  }, [user, userViewing]);

  useEffect(() => {
    if (
      user &&
      currentUserFollowing &&
      currentUserFollowing.includes(user.userName)
    ) {
      setFollowingStatus(true);
    } else {
      setFollowingStatus(false);
    }
  }, [user, currentUserFollowing]);

  /* HANDLES FOLLOW AND UNFOLLOW UPDATE */

  useEffect(() => {
    const fetchPhoto = async () => {
      const userViewingPhoto = await getDownloadURL(
        ref(storage, `profile_pictures/${userViewing.pphoto}`),
      );
      setUserViewingPhoto(userViewingPhoto);
    };
    try {
      userViewing.pphoto && fetchPhoto();
    } catch (err) {
      console.error(err);
    }
  }, [userViewing]);

  const notifObject = (notifStatus, notifRef) => {
    const object = {
      followedBy: userViewing.userName,
      likedByPhoto: userViewingPhoto,
      opened: notifStatus,
      notifRef: notifRef,
      notifType: "follow",
      notifDate: new Date()
    };
    return object;
  };

  const handleFollow = async () => {
    const newUserFollowers = [...userFollowers, userViewing.userName];
    const newCurrentUserFollowing = [...currentUserFollowing, user.userName];
    const docNotifRef = doc(db, "users", userId);
    try {
      setUserFollowers(newUserFollowers);
      setCurrentUserFollowing(newCurrentUserFollowing);
      await followersUpdate(user.email, arrayUnion(userViewing.userName));
      await followingUpdate(currentUser.email, arrayUnion(user.userName));
      await updateDoc(docNotifRef, {
        notif: arrayUnion(notifObject(false, docNotifRef)),
      });
    } catch (err) {
      console.error("error following user", err);
    }
  };

  const handleUnfollow = async () => {
    const docNotifRef = doc(db, "users", userId);
    try {
      setUserFollowers(prevUserFollowers => prevUserFollowers.filter((follower) => follower !== userViewing.userName));
      setCurrentUserFollowing(prevUserFollowers => prevUserFollowers.filter((follower) => follower !== user.userName));
      await followersUpdate(user.email, arrayRemove(userViewing.userName));
      await followingUpdate(currentUser.email, arrayRemove(user.userName));
      await updateDoc(docNotifRef, {
        notif: arrayRemove(notifObject(false, docNotifRef)),
      });
      await updateDoc(docNotifRef, {
        notif: arrayRemove(notifObject(true, docNotifRef)),
      });
    } catch (err) {
      console.error("error unfollowing user", err);
    }
  };

  /* GETS INFO OF THE USER WHOSE PROFILE YOURE VIEWING */
  const getUserByEmailInUser = async (email) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error("No matching documents for email:", email);
      return null;
    }
    const user = querySnapshot;
    return user;
  };

  useEffect(() => {
    const fetchUserByUsername = async (username) => {
      const userData = await getUserByUsername(username);
      console.log("user data: ", userData)
      const user = await getUserByEmailInUser(userData.email);
      setUser(userData);
      setUserId(user.docs[0].id);
    };
    try {
      fetchUserByUsername(param.username);
    } catch (err) {
      console.error(err);
    }
  }, [param, getUserByUsername]);

  /* GETS USERS PROFILE PHOTO */

  useEffect(() => {
    const getLink = async () => {
      if (user.pphoto) {
        const url = await getDownloadURL(
          ref(storage, `profile_pictures/${user.pphoto}`),
        );
        setCurrentProfilePhoto(url);
      }
    };
    if (user) {
      getLink();
    }
  }, [user]);

  const handlePosts = () => {
    setPosts(true);
    setLiked(false);
  };
  const handleLiked = () => {
    setLiked(true);
    setPosts(false);
  };

  const handleFollowers = () => {
    setButtonClicked(true)
    setFollowers(true);
    setFollowing(false);
  };
  const handleFollowing = () => {
    setButtonClicked(true)
    setFollowing(true);
    setFollowers(false);
  };

  return (
    <div className="main-profile-container">
      {user ? (
        <div className="profile-container">
          <div className="profile-data">
            <div className="profile-picture">
              <img
                src={currentProfilePhoto || "/blank-profile.jpg"}
                alt=""
                className="rounded-circle"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
            </div>

            <div className="main-data">
              <div className="username-edit">
                <h5>{user.userName}</h5>
                {!followingStatus ? (
                  <button
                    onClick={handleFollow}
                    variant="primary"
                    className="follow-button"
                  >
                    Follow
                  </button>
                ) : (
                  <button
                    onClick={handleUnfollow}
                    variant="secondary"
                    className="unfollow-button"
                  >
                    Unfollow
                  </button>
                )}
                <Link to={`/messenger/${userId}`}>
                  <button className="unfollow-button">Message</button>
                </Link>
              </div>

              <div>
                <div className="post-followers">
                  <div>
                    <strong>{user.posts.length}</strong>
                    <label>posts</label>
                  </div>
                  <div className="following-stats-button" onClick={handleFollowers}>
                    <strong>{userFollowers.length}</strong>
                    <label>followers</label>
                  </div>
                  <div className="following-stats-button" onClick={handleFollowing}>
                    <strong>{user.following.length}</strong>
                    <label>following</label>
                  </div>
                  {followers && (
                    <div className="post-background">
                      <UserFollowList
                        userRef={userRef}
                        userFollowers={userFollowers}
                        userViewingFollowers={userViewing.following}
                        fetchType={"followers"}
                        currentUserName={userViewing.userName}
                        userViewing={userViewing}
                        userViewingPhoto={userViewingPhoto}
                      ></UserFollowList>
                    </div>
                  )}
                  {following && (
                    <div className="post-background">
                      <UserFollowList
                        userRef={userRef}
                        userFollowers={user.following}
                        userViewingFollowers={userViewing.following}
                        fetchType={"following"}
                        currentUserName={userViewing.userName}
                        userViewing={userViewing}
                        userViewingPhoto={userViewingPhoto}
                      ></UserFollowList>
                    </div>
                  )}
                </div>
                <label className="profile-username">{user.name}</label>
                <p className="profile-bio">{user.bio}</p>
              </div>
            </div>
          </div>
          <div className="posts-border">
            <motion.div whileHover={{
                        scale: 1.1,
                      }}
                      whileTap={{
                        scale: 1.2,
                      }} onClick={handlePosts} className={posts && `active`}>
              <BorderAll></BorderAll>
              <p>POSTS</p>
            </motion.div>
            <motion.div whileHover={{
                        scale: 1.1,
                      }}
                      whileTap={{
                        scale: 1.2,
                      }} onClick={handleLiked} className={liked && `active`}>
              <HeartIcon size={"18"}></HeartIcon>
              <p>LIKED</p>
            </motion.div>
            <div className={`options-line line-user ${posts && " posts "}${liked && " liked "}`}></div>
          </div>
          {user && posts && <PostsList postsList={user.posts} />}
          {user && liked && <PostsList postsList={user.likedPosts} />}
        </div>
      ) : (
        <div>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
    </div>
  );
};

export default User;
