import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";    
import { 
  collection,
  query,
  where,
  getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { storage } from "../../config/firebase";
import {
  ref,
  getDownloadURL
} from "firebase/storage";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";

const User = () => {

  const { currentUser } = useAuth();
  const { followersUpdate } = useAuth();
  const { followingUpdate } = useAuth();

  const param = useParams();
  const [user, setUser] = useState();
  const [currentProfilePhoto, setCurrentProfilePhoto] = useState(null);
  const [currentUserFollowing, setCurrentUserFollowing] = useState();
  const [userFollowers, setUserFollowers] = useState([]);
  const [followingStatus, setFollowingStatus] = useState(false);

  useEffect(() => {
    if(user && currentUser){
      setCurrentUserFollowing(currentUser.following)
      setUserFollowers(user.followers)
    }
  }, [user, currentUser])

  useEffect(() => {
    if(currentUserFollowing && currentUserFollowing.includes(user.userName)){
      setFollowingStatus(true)
    }else{
      setFollowingStatus(false)
    }
  }, [user, currentUserFollowing])

  const handleFollow = async () => {
    try{
      await followersUpdate(user.email, [...userFollowers, currentUser.userName])
      await followingUpdate(currentUser.email, [...currentUserFollowing, user.userName])
    }catch(err){
      console.error("error following user", err)
    }
  }

  const handleUnfollow = async () => {
    try{
      await followersUpdate(user.email, userFollowers.filter(follower => follower !== currentUser.userName))
      await followingUpdate(currentUser.email, currentUserFollowing.filter(following => following !== user.userName))
    }catch(err){
      console.error("error unfollowing user", err)
    }
  }

  const getUserByUsername = async (username) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('userName', '==', username));
    const querySnapshot = await getDocs(q);
  
    if (querySnapshot.empty) {
      console.error('No matching documents for username:', username);
      return null;
    }
  
    const user = querySnapshot.docs[0].data();
    return user;
  }

  useEffect(() => {
    const fetchUserByUsername = async (username) => {
      const user = await getUserByUsername(username);
      setUser(user);
    }
    console.log(param.username)
    try{
      fetchUserByUsername(param.username)
    }
    catch(err){
      console.error(err)
    }
  }, [param])

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

  useEffect(() => {
    console.log(currentProfilePhoto)
  }, [currentProfilePhoto])

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
                <strong>{user.followers.length}</strong> followers
              </div>
              <div>
                <strong>{user.following.length}</strong> following
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