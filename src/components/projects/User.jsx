import { useEffect, useState } from "react";
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
  where
} from "firebase/firestore";
import { storage, db } from "../../config/firebase";
import {
  ref,
  getDownloadURL
} from "firebase/storage";
import Spinner from "react-bootstrap/Spinner";
import PostsList from "./PostsList";
import { useNavigate } from "react-router-dom";
import {  } from "firebase/firestore";
import BorderAll from "../../icons/BorderAll";
import HeartIcon from "../../icons/HeartIcon";

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
  const [userViewingPhoto, setUserViewingPhoto] = useState('');

  const [currentProfilePhoto, setCurrentProfilePhoto] = useState(null);

  const [currentUserFollowing, setCurrentUserFollowing] = useState([]);
  const [userFollowers, setUserFollowers] = useState([]);
  const [followingStatus, setFollowingStatus] = useState(false);

/* REDIRECTS CURRENT USER */

useEffect(() => {
  if (user && currentUser && user.email === currentUser.email){
    navigate('/profile')
  }
}, [user, currentUser, navigate])

/* FATCHES USER WHO IS VIEWING THE PROFILE */

  useEffect(() => {
    const fetchUserByEmail = async (email) => {
      const user = await getUserByEmail(email);
      setUserViewing(user);
    }
    try{
      currentUser && fetchUserByEmail(currentUser.email)
    }
    catch(err){
      console.error(err)
    }
  }, [currentUser, getUserByEmail])

/* SETS INITIAL FOLLOWING AND FOLLOWERS OF USER */

  useEffect(() => {
    if(user && userViewing){
      setCurrentUserFollowing(userViewing.following)
      setUserFollowers(user.followers)
    }
  }, [user, userViewing])

  useEffect(() => {
    if(user && currentUserFollowing && currentUserFollowing.includes(user.userName)){
      setFollowingStatus(true)
    }else{
      setFollowingStatus(false)
    }
  }, [user, currentUserFollowing])

/* HANDLES FOLLOW AND UNFOLLOW UPDATE */

  useEffect(() => {
    const fetchPhoto = async () => {
      const userViewingPhoto = await getDownloadURL(ref(storage, `profile_pictures/${userViewing.pphoto}`))
      setUserViewingPhoto(userViewingPhoto);
    }
    try {
      userViewing.pphoto && fetchPhoto()
    } catch (err) {
      console.error(err)
    }
  }, [userViewing])

  const notifObject = (notifStatus, notifRef) => {
    const object = {
      followedBy: userViewing.userName,
      likedByPhoto: userViewingPhoto,
      opened: notifStatus,
      notifRef: notifRef,
      notifType: "follow"
    }
    return object
  }

  const handleFollow = async () => {
    const newUserFollowers = [...userFollowers, userViewing.userName]
    const newCurrentUserFollowing = [...currentUserFollowing, user.userName]
    const docNotifRef = doc(db, "users", userId);
    try{
      setUserFollowers(newUserFollowers)
      setCurrentUserFollowing(newCurrentUserFollowing)
      await followersUpdate(user.email, arrayUnion(userViewing.userName))
      await followingUpdate(currentUser.email, arrayUnion(user.userName))
      await updateDoc(docNotifRef, {
        notif: arrayUnion(notifObject(false, docNotifRef))
      });
    }catch(err){
      console.error("error following user", err)
    }

  }

  const handleUnfollow = async () => {
    const newUserFollowers = userFollowers.filter(follower => follower !== userViewing.userName)
    const newCurrentUserFollowing = currentUserFollowing.filter(following => following !== user.userName)
    const docNotifRef = doc(db, "users", userId);
    try{
      setUserFollowers(newUserFollowers)
      setCurrentUserFollowing(newCurrentUserFollowing)
      await followersUpdate(user.email, arrayRemove(userViewing.userName))
      await followingUpdate(currentUser.email, arrayRemove(user.userName))
      await updateDoc(docNotifRef, {
        notif: arrayRemove(notifObject(false, docNotifRef))
      });
      await updateDoc(docNotifRef, {
        notif: arrayRemove(notifObject(true, docNotifRef))
      });
    }catch(err){
      console.error("error unfollowing user", err)
    }
  }

  /* GETS INFO OF THE USER WHOSE PROFILE YOURE VIEWING */
  const getUserByEmailInUser = async (email) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
  
    if (querySnapshot.empty) {
      console.error('No matching documents for email:', email);
      return null;
    }
    const user = querySnapshot;
    return user;
  }

  useEffect(() => {
    const fetchUserByUsername = async (username) => {
      const userData = await getUserByUsername(username);
      const user = await getUserByEmailInUser(userData.email);
      setUser(userData);
      setUserId(user.docs[0].id);
    }
    try{
      fetchUserByUsername(param.username)
    }
    catch(err){
      console.error(err)
    }
  }, [param, getUserByUsername])

/* GETS USERS PROFILE PHOTO */

  useEffect(() => {
    const getLink = async() => {
      if(user.pphoto){
        const url = await getDownloadURL(ref(storage, `profile_pictures/${user.pphoto}`));
        setCurrentProfilePhoto(url)
      }
    }
    if(user){
      getLink();
    }
  }, [user])

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
                {!followingStatus ? 
                <button onClick={handleFollow} variant="primary" className="follow-button">
                  Follow
                </button> :
                <button onClick={handleUnfollow} variant="secondary" className="unfollow-button">
                  Unfollow
                </button> }
                <Link to={`/messenger/${userId}`}>
                  <button className="unfollow-button">
                      Message
                  </button>
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
            <div>
              <BorderAll></BorderAll>
              <p>POSTS</p>
            </div>
            <div>
              <HeartIcon size={"18"}></HeartIcon>
              <p>LIKED</p>
            </div>
          </div>
          { user ? (<PostsList postsList={user.posts} />) : <>Loading...</> }
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

export default User;
