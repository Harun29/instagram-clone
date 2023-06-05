import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";    
import {
  arrayUnion,
  arrayRemove } from "firebase/firestore";
import { storage } from "../../config/firebase";
import {
  ref,
  getDownloadURL
} from "firebase/storage";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";

const User = () => {

  const { currentUser } = useAuth();
  const { getUserByEmail } = useAuth();
  const { followersUpdate } = useAuth();
  const { followingUpdate } = useAuth();
  const { getUserByUsername } = useAuth();

  const param = useParams();
  const [user, setUser] = useState();
  const [userViewing, setUserViewing] = useState()

  const [currentProfilePhoto, setCurrentProfilePhoto] = useState(null);

  const [currentUserFollowing, setCurrentUserFollowing] = useState([]);
  const [userFollowers, setUserFollowers] = useState([]);
  const [followingStatus, setFollowingStatus] = useState(false);

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

  const handleFollow = async () => {
    const newUserFollowers = [...userFollowers, userViewing.userName]
    const newCurrentUserFollowing = [...currentUserFollowing, user.userName]
    try{
      setUserFollowers(newUserFollowers)
      setCurrentUserFollowing(newCurrentUserFollowing)
      await followersUpdate(user.email, arrayUnion(userViewing.userName))
      await followingUpdate(currentUser.email, arrayUnion(user.userName))
    }catch(err){
      console.error("error following user", err)
    }
  }

  const handleUnfollow = async () => {
    const newUserFollowers = userFollowers.filter(follower => follower !== userViewing.userName)
    const newCurrentUserFollowing = currentUserFollowing.filter(following => following !== user.userName)
    try{
      setUserFollowers(newUserFollowers)
      setCurrentUserFollowing(newCurrentUserFollowing)
      await followersUpdate(user.email, arrayRemove(userViewing.userName))
      await followingUpdate(currentUser.email, arrayRemove(user.userName))
    }catch(err){
      console.error("error unfollowing user", err)
    }
  }

  /* GETS INFO OF THE USER WHOSE PROFILE YOURE VIEWING */

  useEffect(() => {
    const fetchUserByUsername = async (username) => {
      const user = await getUserByUsername(username);
      setUser(user);
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
    <div className="container mt-4">
      {user ? (
        <div className="profile-container d-flex justify-content-center align-items-center shadow p-3 mb-5 bg-white rounded">
          <div className="d-flex flex-column align-items-center">
            <div className="mb-3">
              <img
                src={currentProfilePhoto || "/blank-profile.jpg"}
                alt=""
                className="rounded-circle"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
            </div>
            <h5 className="mb-3">{user.name}</h5>
            <p>{user.bio}</p>
            <div className="d-flex justify-content-center align-items-center">
              <div className="me-4">
                <strong>10</strong> posts
              </div>
              <div className="me-4">
                <Link to='followers'>
                  <strong>{userFollowers.length}</strong> 
                  followers
                </Link>
              </div>
              <div>
                <Link to='following'>
                  <strong>{user.following.length}</strong> 
                  following
                </Link>
              </div>
            </div>
            {!followingStatus ? 
            <Button onClick={handleFollow} variant="primary" className="mt-3">
              Follow
            </Button> :
            <Button onClick={handleUnfollow} variant="secondary" className="mt-3">
              Unfollow
            </Button> }
          </div>
        </div>
      ) : (
        <div className="d-flex justify-content-center align-items-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
    </div>
  );
}
 
export default User;