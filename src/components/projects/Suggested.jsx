import { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { getDocs, collection, limit, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import { getDownloadURL } from "firebase/storage";

const Suggested = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersRef = query(collection(db, "users"), limit(5));
      const users = await getDocs(usersRef);
      users.forEach((user) => {
        setUsers((prevUsers) => [...prevUsers, user.data()]);
      });
    };
    try {
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    users && console.log(users);
  }, [users]);

  return (
    <div>
      {users.map((user) => {
        <div>
          <Link to={`/user/${user.userName}`}>
            <img src="user.pphoto" alt="" />
            <span>{user.userName}</span>
          </Link>
          <button>follow</button>
        </div>;
      })}
    </div>
  );
};

export default Suggested;
