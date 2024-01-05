import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../config/firebase";

const UserFollowList = ({
  userRef,
  userFollowers,
  userViewingFollowers,
  fetchType,
  currentUserName,
}) => {
  const [followers, setFollowers] = useState([]);
  const { getUserByUsername } = useAuth();

  useEffect(() => {
    setFollowers([]);
    const fetchFollowers = async (username) => {
      const newFollower = await getUserByUsername(username);
      let userPhoto = "blank-profile.jpg";
      if (newFollower.pphoto)
        userPhoto = await getDownloadURL(
          ref(storage, `profile_pictures/${newFollower.pphoto}`),
        );
      console.log("photo:", userPhoto, newFollower.userName);
      const object = {
        username,
        name: newFollower.name,
        userPhoto,
      };
      setFollowers((prevFollowers) => [...prevFollowers, object]);
    };

    try {
      Promise.all(userFollowers.map((follower) => fetchFollowers(follower)));
    } catch (err) {
      console.error(err);
    }
  }, [userFollowers]);

  useEffect(() => {
    console.log(currentUserName);
  }, [followers]);

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
                alt="Profile"
                className="rounded-circle"
                style={{ width: "50px", height: "50px" }}
              />
              <div>
                <h5 className="card-title mt-3">{follower.username}</h5>
                <span>{follower.name}</span>
              </div>
            </Link>
            {!userViewingFollowers.includes(follower.username) &&
              follower.username !== currentUserName && (
                <button className="follow-button">follow</button>
              )}
            {userViewingFollowers.includes(follower.username) &&
              follower.username !== currentUserName && (
                <button className="unfollow-button">following</button>
              )}
          </div>
        ))}
    </div>
  );
};

export default UserFollowList;
