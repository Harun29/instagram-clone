import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

import { storage } from "../../config/firebase";
import {
  ref,
  getDownloadURL
} from "firebase/storage";

const UserFollowers = () => {

  const { getUserByUsername } = useAuth();

  const param = useParams();
  const [user, setUser] = useState();
  const [followers, setFollowers] = useState();

  const [followersWithPictures, setFollowersWithPictures] = useState();
  

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

  useEffect(() => {
    if (user){
      setFollowers(user.followers)
    }
  }, [user])

  useEffect(() => {
    const followersObject = {};

    const fetchFollowersPhoto = async (username) => {
      const user = await getUserByUsername(username);
      if(user.pphoto){
        const url = await getDownloadURL(ref(storage, `profile_pictures/${user.pphoto}`));
        followersObject[username] = url;
      }else{
        followersObject[username] = "/blank-profile.jpg"
      }
    }
    try{
      if(followers){ followers.map(follower => fetchFollowersPhoto(follower)) }
    }catch(err){
      console.error(err)
    }finally{
      if(followers){ setFollowersWithPictures(followersObject) }
    }

  }, [followers, getUserByUsername])

  useEffect(()=> {
    console.log(followersWithPictures)
  }, [followersWithPictures])

  return (

      <div className="mt-4 container">
        <h1>User Followers</h1>
        <div className="row">

          {followersWithPictures &&
            Object.keys(followersWithPictures).map((follower) => (
              <div className="col-lg-3 col-md-4 col-sm-6" key={follower}>
                <div className="card">
                  <img
                    src={followersWithPictures[follower]}
                    alt="Profile"
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <p className="card-text">{follower}</p>
                  </div>
                </div>
              </div>
            ))}

        </div>
      </div>
    );
    
}
 
export default UserFollowers;