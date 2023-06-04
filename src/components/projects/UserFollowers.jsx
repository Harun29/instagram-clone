import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

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
      followersObject[username] = user.pphoto;
      console.log(followersObject)
    }

    if(followers){
      followers.map(follower => fetchFollowersPhoto(follower))
    }


  }, [followers, getUserByUsername])

  return ( 
    <>
    </>
  );
}
 
export default UserFollowers;