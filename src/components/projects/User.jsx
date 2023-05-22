import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { 
  collection,
  query,
  where,
  getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import Spinner from "react-bootstrap/Spinner";
import { storage } from "../../config/firebase";
import {
  ref,
  getDownloadURL
} from "firebase/storage";

const User = () => {

  const param = useParams();
  const [user, setUser] = useState();
  const [currentProfilePhoto, setCurrentProfilePhoto] = useState(null);

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
                src={currentProfilePhoto ? currentProfilePhoto : "blank-profile.jpg"}
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
                <strong>20</strong> followers
              </div>
              <div>
                <strong>30</strong> following
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
    </div>
  );
}
 
export default User;