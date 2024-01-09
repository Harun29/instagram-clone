import { useEffect, useState } from "react";
import { db, storage } from "../../config/firebase";
import {
  getDocs,
  collection,
  limit,
  query,
  where,
  arrayRemove,
  arrayUnion,
  updateDoc,
  doc,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import { getDownloadURL } from "firebase/storage";
import { useAuth } from "../../context/AuthContext";
import { ref } from "firebase/storage";

const Suggested = () => {
  const [users, setUsers] = useState([]);
  const { currentUser } = useAuth();
  const { getUserByEmail } = useAuth();
  const { followersUpdate } = useAuth();
  const { followingUpdate } = useAuth();
  const [userFollowing, setUserFollowing] = useState();
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentUserPhoto, setCurrentUserPhoto] = useState("");

  const getUserByEmailInPost = async (email) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error("No matching documents for email:", email);
      return null;
    }
    const user = querySnapshot;
    return user;
  };

  useEffect(() => {
    const fetchUserFollowing = async () => {
      const user = await getUserByEmail(currentUser.email);
      const userFollowingList = user.following;
      userFollowingList.push(user.userName);
      setUserFollowing(userFollowingList);
      setCurrentUserName(user.userName);
      let userPhoto = "blank-profile.jpg";
      if (user.pphoto) {
        userPhoto = await getDownloadURL(
          ref(storage, `profile_pictures/${user.pphoto}`),
        );
      }
      setCurrentUserPhoto(currentUserPhoto);
    };
    try {
      currentUser && fetchUserFollowing(currentUser.email);
    } catch (err) {
      console.error(err);
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersRef = query(
        collection(db, "users"),
        where("userName", "not-in", userFollowing),
        limit(5),
      );
      const users = await getDocs(usersRef);
      users.forEach(async (user) => {
        const object = user.data();
        let userPhoto = "blank-profile.jpg";
        if (user.data().pphoto) {
          userPhoto = await getDownloadURL(
            ref(storage, `profile_pictures/${user.data().pphoto}`),
          );
        }
        object.pphoto = userPhoto;
        object.following = false;
        console.log(user.id);
        setUsers((prevUsers) => [...prevUsers, object]);
      });
    };
    try {
      userFollowing && fetchUsers();
    } catch (err) {
      console.error(err);
    }
  }, [userFollowing]);

  const notifObject = (notifStatus, notifRef) => {
    const object = {
      followedBy: currentUserName,
      likedByPhoto: currentUserPhoto,
      opened: notifStatus,
      notifRef: notifRef,
      notifType: "follow",
    };
    return object;
  };

  const handleFollow = async (email, userName) => {
    const newObject = users.map((user) => {
      if (user.userName === userName) {
        user.following = true;
        return user;
      } else {
        return user;
      }
    });
    setUsers(newObject);
    const user = await getUserByEmailInPost(email);
    const userId = user.docs[0].id;
    const docNotifRef = doc(db, "users", userId);

    try {
      await followersUpdate(email, arrayUnion(currentUserName));
      await followingUpdate(currentUser.email, arrayUnion(userName));
      await updateDoc(docNotifRef, {
        notif: arrayUnion(notifObject(false, docNotifRef)),
      });
    } catch (err) {
      console.error("error following user", err);
    }
  };

  const handleUnfollow = async (email, userName) => {
    const newObject = users.map((user) => {
      if (user.userName === userName) {
        user.following = false;
        return user;
      } else {
        return user;
      }
    });
    setUsers(newObject);
    const user = await getUserByEmailInPost(email);
    const userId = user.docs[0].id;
    const docNotifRef = doc(db, "users", userId);
    try {
      await followersUpdate(email, arrayRemove(currentUserName));
      await followingUpdate(currentUser.email, arrayRemove(userName));
      await updateDoc(docNotifRef, {
        notif: arrayRemove(notifObject(false, docNotifRef)),
      });
      await updateDoc(docNotifRef, {
        notif: arrayRemove(notifObject(true, docNotifRef)),
      });
    } catch (err) {
      console.error("error unfollowing user", err);
    }
  };

  return (
    <div className="suggested-people">
      <span>Suggested for you</span>
      {users &&
        users.map((user, index) => (
          <div key={index} className="suggestion">
            <Link to={`/user/${user.userName}`}>
              <img src={user.pphoto} alt="" />
              <span>{user.userName}</span>
            </Link>
            {user.following === false ? (
              <button onClick={() => handleFollow(user.email, user.userName)}>
                follow
              </button>
            ) : (
              <button className="unfollow" onClick={() => handleUnfollow(user.email, user.userName)}>
                unfollow
              </button>
            )}
          </div>
        ))}
      <span className="signature">
        2024 INSTAGRAM CLONE BY{" "}
        <Link to="https://github.com/Harun29">HARUN</Link>
      </span>
    </div>
  );
};

export default Suggested;
