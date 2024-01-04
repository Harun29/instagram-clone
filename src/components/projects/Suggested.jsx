import { useEffect, useState } from "react";
import { db, storage } from "../../config/firebase";
import { getDocs, collection, limit, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import { getDownloadURL } from "firebase/storage";
import { useAuth } from "../../context/AuthContext";
import { ref } from "firebase/storage";

const Suggested = () => {
  const [users, setUsers] = useState([]);
  const {currentUser} = useAuth();
  const {getUserByEmail} = useAuth();
  const [userFollowing, setUserFollowing] = useState();

  useEffect(() => {
    const fetchUserFollowing = async() => {
      const user = await getUserByEmail(currentUser.email)
      const userFollowingList = user.following
      setUserFollowing(userFollowingList);
    }
    try{
      currentUser && fetchUserFollowing(currentUser.email)
    }catch(err){
      console.error(err)
    }
  }, [currentUser])


  useEffect(() => {
    const fetchUsers = async () => {
      const usersRef = query(collection(db, "users"),where("userName", "not-in", userFollowing), limit(5));
      const users = await getDocs(usersRef);
      users.forEach(async(user) => {
        const object = user.data();
        let userPhoto = 'blank-profile.jpg'
        if(user.data().pphoto){
          userPhoto = await getDownloadURL(ref(storage, `profile_pictures/${user.data().pphoto}`))
        }
        object.pphoto = userPhoto
        setUsers((prevUsers) => [...prevUsers, object]);
      });
    };
    try {
      userFollowing && fetchUsers();
    } catch (err) {
      console.error(err);
    }
  }, [userFollowing]);

  useEffect(() => {
    users && console.log(users);
  }, [users]);

  return (
    <div className="suggested-people">
      <span>Suggested for you</span>
      {users && users.map((user, index) => (
        <div key={index} className="suggestion">
          <Link to={`/user/${user.userName}`}>
            <img src={user.pphoto} alt="" />
            <span>{user.userName}</span>
          </Link>
          <button>follow</button>
        </div>
      ))}
      <span className="signature">2024 INSTAGRAM CLONE BY <Link to="https://github.com/Harun29">HARUN</Link></span>
    </div>
  );
};

export default Suggested;
