import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { 
  collection,
  query,
  where,
  getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

const User = () => {

  const param = useParams();
  const [user, setUser] = useState();

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

  return (  
    <div></div>
  );
}
 
export default User;