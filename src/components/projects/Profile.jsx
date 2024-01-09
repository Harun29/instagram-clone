import { useAuth } from "../../context/AuthContext";
import { useEffect, useState, useRef } from "react";
import Spinner from "react-bootstrap/Spinner";
import { storage } from "../../config/firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { Link } from "react-router-dom";
import PostsList from "./PostsList";
import BorderAll from "../../icons/BorderAll";
import HeartIcon from "../../icons/HeartIcon";
import SaveIcon from "../../icons/SaveIcon";
import UserFollowList from "./UserFollowList";

const Profile = () => {
  const { currentUser } = useAuth();
  const { getUserByEmail } = useAuth();
  const [user, setUser] = useState();
  const [currentProfilePhoto, setCurrentProfilePhoto] = useState(null);
  const [posts, setPosts] = useState(true);
  const [saved, setSaved] = useState(false);
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

  useEffect(() => {
    const fetchUserByEmail = async (email) => {
      const user = await getUserByEmail(email);
      setUser(user);
    };
    try {
      currentUser && fetchUserByEmail(currentUser.email);
    } catch (err) {
      console.error(err);
    }
  }, [currentUser, getUserByEmail]);

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

  const handleSaved = () => {
    setSaved(true);
    setPosts(false);
    setLiked(false);
  };
  const handlePosts = () => {
    setPosts(true);
    setSaved(false);
    setLiked(false);
  };
  const handleLiked = () => {
    setLiked(true);
    setPosts(false);
    setSaved(false);
  };

  const handleFollowers = () => {
    setButtonClicked(true);
    setFollowers(true);
    setFollowing(false);
  };
  const handleFollowing = () => {
    setButtonClicked(true);
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
                <Link className="edit-button" to="/settings">
                  Edit Profile
                </Link>
              </div>

              <div>
                <div className="post-followers">
                  <div>
                    <strong>{user.posts.length}</strong>
                    <label>posts</label>
                  </div>
                  <div className="following-stats-button" onClick={handleFollowers}>
                    <strong>{user.followers.length}</strong>
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
                        userFollowers={user.followers}
                        userViewingFollowers={user.following}
                        fetchType={"followers"}
                        currentUserName={user.userName}
                        userViewing={user}
                        userViewingPhoto={currentProfilePhoto}
                      ></UserFollowList>
                    </div>
                  )}
                  {following && (
                    <div className="post-background">
                      <UserFollowList
                        userRef={userRef}
                        userFollowers={user.following}
                        userViewingFollowers={user.following}
                        fetchType={"following"}
                        currentUserName={user.userName}
                        userViewing={user}
                        userViewingPhoto={currentProfilePhoto}
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
            <div onClick={handlePosts} className={posts && `active`}>
              <BorderAll></BorderAll>
              <p>POSTS</p>
            </div>
            <div onClick={handleLiked} className={liked && `active`}>
              <HeartIcon size={"18"}></HeartIcon>
              <p>LIKED</p>
            </div>
            <div onClick={handleSaved} className={saved && `active`}>
              <SaveIcon size={"18"}></SaveIcon>
              <p>SAVED</p>
            </div>
          </div>
          {user && posts && <PostsList postsList={user.posts} />}
          {user && saved && <PostsList postsList={user.savedIds} />}
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

export default Profile;
