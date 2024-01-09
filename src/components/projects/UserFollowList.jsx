import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getDownloadURL, ref } from "firebase/storage";
import { storage, db } from "../../config/firebase";
import {
  arrayRemove,
  arrayUnion,
  updateDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const UserFollowList = ({
  userRef,
  userFollowers,
  userViewingFollowers,
  fetchType,
  currentUserName,
  userViewing,
  userViewingPhoto,
}) => {

  const [followers, setFollowers] = useState([]);
  const { currentUser } = useAuth();
  const { getUserByUsername } = useAuth();
  const { followersUpdate } = useAuth();
  const { followingUpdate } = useAuth();

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
    userFollowers && console.log(userFollowers)
  }, [userFollowers])

  const notifObject = (notifStatus, notifRef) => {
    const object = {
      followedBy: userViewing.userName,
      likedByPhoto: userViewingPhoto,
      opened: notifStatus,
      notifRef: notifRef,
      notifType: "follow",
    };
    return object;
  };

  const handleFollow = async (email, username, e) => {
    e.stopPropagation();
    const newObject = followers.map((follower) => {
      if (follower.username === username) {
        follower.followState = true;
        return follower;
      } else {
        return follower;
      }
    });
    setFollowers(newObject);
    const user = await getUserByEmailInPost(email);
    const userId = user.docs[0].id;
    const docNotifRef = doc(db, "users", userId);
    try {
      await followersUpdate(email, arrayUnion(userViewing.userName));
      await followingUpdate(currentUser.email, arrayUnion(username));
      await updateDoc(docNotifRef, {
        notif: arrayUnion(notifObject(false, docNotifRef)),
      });
    } catch (err) {
      console.error("error following user", err);
    }
  };

  const handleUnfollow = async (email, username, e) => {
    e.stopPropagation();
    const newObject = followers.map((follower) => {
      if (follower.username === username) {
        follower.followState = false;
        return follower;
      } else {
        return follower;
      }
    });
    setFollowers(newObject);
    const user = await getUserByEmailInPost(email);
    const userId = user.docs[0].id;
    const docNotifRef = doc(db, "users", userId);
    try {
      await followersUpdate(email, arrayRemove(userViewing.userName));
      await followingUpdate(currentUser.email, arrayRemove(username));
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

  useEffect(() => {
    setFollowers([]);
    const fetchFollowers = async (username) => {
      const newFollower = await getUserByUsername(username);
      let userPhoto = "/blank-profile.jpg";
      console.log(userPhoto)
      if (newFollower.pphoto)
      userPhoto = await getDownloadURL(
        ref(storage, `profile_pictures/${newFollower.pphoto}`),
      );
      console.log(userPhoto)
      const followState = userViewingFollowers.includes(newFollower.userName);
      const email = newFollower.email;
      const object = {
        email,
        username,
        name: newFollower.name,
        userPhoto,
        followState,
      };
      console.log(object)
      setFollowers((prevFollowers) => [...prevFollowers, object]);
    };

    try {
      Promise.all(userFollowers.map((follower) => fetchFollowers(follower)));
    } catch (err) {
      console.error(err);
    }
  }, [userFollowers, userViewingFollowers, getUserByUsername]);

  useEffect(() => {
    userViewing && console.log("user viewing: ", userViewing)
  }, [userViewing])
  useEffect(() => {
    userFollowers && console.log("user followers: ", userFollowers)
  }, [userFollowers])

  return (
    <div ref={userRef} className="followers">
      <h1 className="followers-header">
        {fetchType === "followers" ? "User Followers" : "User Following"}
      </h1>
      {followers &&
        followers.map((follower) => (
          <div className="follower-in-list" key={follower}>
            <Link to={`/user/${follower.username}`} className="btn btn-primary">
              <img
                src={follower.userPhoto}
                alt="profile"
                className="rounded-circle"
                style={{ width: "50px", height: "50px" }}
              />
              <div>
                <h5 className="card-title mt-3">{follower.username}</h5>
                <span>{follower.name}</span>
              </div>
            </Link>
            {!follower.followState && follower.username !== currentUserName && (
              <button
                onClick={(e) =>
                  handleFollow(follower.email, follower.username, e)
                }
                className="follow-button"
              >
                follow
              </button>
            )}
            {follower.followState && follower.username !== currentUserName && (
              <button
                onClick={(e) =>
                  handleUnfollow(follower.email, follower.username, e)
                }
                className="unfollow-button"
              >
                following
              </button>
            )}
          </div>
        ))}
    </div>
  );
};

export default UserFollowList;
