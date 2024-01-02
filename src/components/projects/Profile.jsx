import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import Spinner from 'react-bootstrap/Spinner';
import { storage } from "../../config/firebase";
import {
  ref,
  getDownloadURL
} from "firebase/storage";
import { Link } from "react-router-dom";
import PostsList from "./PostsList";
import BorderAll from "../../icons/BorderAll";
import HeartIcon from "../../icons/HeartIcon";
import SaveIcon from "../../icons/SaveIcon";

const Profile = () => {

  const { currentUser } = useAuth();
  const { getUserByEmail } = useAuth();
  const [user, setUser] = useState();
  const [currentProfilePhoto, setCurrentProfilePhoto] = useState(null);
  const [posts, setPosts] = useState(true);
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchUserByEmail = async (email) => {
      const user = await getUserByEmail(email);
      setUser(user);
    }
    try {
      currentUser && fetchUserByEmail(currentUser.email)
    }
    catch (err) {
      console.error(err)
    }
  }, [currentUser, getUserByEmail])

  useEffect(() => {
    const getLink = async () => {
      if (user.pphoto) {
        const url = await getDownloadURL(ref(storage, `profile_pictures/${user.pphoto}`));
        setCurrentProfilePhoto(url)
      }
    }
    if (user) {
      getLink();
    }
  }, [user])

  const handleSaved = () => {
    setSaved(true)
    setPosts(false)
    setLiked(false)
  }
  const handlePosts = () => {
    setPosts(true)
    setSaved(false)
    setLiked(false)
  }
  const handleLiked = () => {
    setLiked(true)
    setPosts(false)
    setSaved(false)
  }

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
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
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
                  <Link to={`${user.userName}/followers`}>
                    <strong>{user.followers.length}</strong>
                    followers
                  </Link>
                  <Link to={`${user.userName}/following`}>
                    <strong>{user.following.length}</strong>
                    following
                  </Link>
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
          { (user && posts) && (<PostsList postsList={user.posts} />)}
          { (user && saved) && (<PostsList postsList={user.savedIds} />)}
          { (user && liked) && (<PostsList postsList={user.likedPosts} />)}
        </div>
  ) : (
    <div>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  )
}
    </div >
  );

}

export default Profile;


