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

const Profile = () => {

  const { currentUser } = useAuth();
  const { getUserByEmail } = useAuth();
  const [user, setUser] = useState();
  const [currentProfilePhoto, setCurrentProfilePhoto] = useState(null);

  useEffect(() => {
    const fetchUserByEmail = async (email) => {
      const user = await getUserByEmail(email);
      setUser(user);
    }
    try{
      currentUser && fetchUserByEmail(currentUser.email)
    }
    catch(err){
      console.error(err)
    }
  }, [currentUser, getUserByEmail])

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
                <Link to={`${user.userName}/followers`}>
                  <strong>{user.followers.length}</strong> 
                  followers
                </Link>
              </div>
              <div>
                <Link to={`${user.userName}/following`}>
                  <strong>{user.following.length}</strong> 
                  following
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="d-flex justify-content-center align-items-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
      {user ? (<PostsList postsList={user.posts}/>) : <>Loading...</>}
    </div>
  );

}
 
export default Profile;