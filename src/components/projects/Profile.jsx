import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";

const Profile = () => {

  const { currentUser } = useAuth();
  const { getUserByEmail } = useAuth();
  const [user, setUser] = useState();

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

  if(user){
    return (
      <div className="profile">
        <h5>Email: {user.email}</h5>
        <h5>Name: {user.name}</h5>
        <h5>Username: {user.userName}</h5>
        <h5>birth date: {user.age}</h5>
      </div>
    );
  } else {
    return(
      <div className="loading">Loading...</div>
    )
  }
}
 
export default Profile;