import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { storage } from "../../config/firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { Link } from "react-router-dom";

const UserFollowList = ({ fetchType }) => {
  const { getUserByUsername } = useAuth();

  const param = useParams();
  const [user, setUser] = useState();
  const [followList, setFollowList] = useState();
  const [followersWithPictures, setFollowersWithPictures] = useState({});

  useEffect(() => {
    const fetchUserByUsername = async (username) => {
      const user = await getUserByUsername(username);
      setUser(user);
    };
    try {
      fetchUserByUsername(param.username);
    } catch (err) {
      console.error(err);
    }
  }, [param, getUserByUsername]);

  useEffect(() => {
    if (user) {
      fetchType === "followers"
        ? setFollowList(user.followers)
        : setFollowList(user.following);
    }
  }, [user, fetchType]);

  useEffect(() => {
    const fetchFollowers = async () => {
      const followersObject = {};

      const fetchFollowersPhoto = async (username) => {
        const user = await getUserByUsername(username);
        if (user.pphoto) {
          const url = await getDownloadURL(
            ref(storage, `profile_pictures/${user.pphoto}`),
          );
          followersObject[username] = url;
        } else {
          followersObject[username] = "/blank-profile.jpg";
        }
      };

      try {
        if (followList) {
          await Promise.all(
            followList.map((follower) => fetchFollowersPhoto(follower)),
          );
          setFollowersWithPictures(followersObject);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchFollowers();
  }, [followList, getUserByUsername]);

  return (
    <div className="mt-4 container">
      <h1 className="text-center mb-5">
        {fetchType === "followers" ? "User Followers" : "User Following"}
      </h1>

      <div className="row justify-content-center">
        {followersWithPictures &&
          Object.keys(followersWithPictures).map((follower) => (
            <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={follower}>
              <div className="card text-center">
                <div className="card-body">
                  <div className="profile-photo mx-auto">
                    <img
                      src={followersWithPictures[follower]}
                      alt="Profile"
                      className="rounded-circle"
                      style={{ width: "50px", height: "50px" }}
                    />
                  </div>
                  <h5 className="card-title mt-3">{follower}</h5>
                  <Link to={`/user/${follower}`} className="btn btn-primary">
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default UserFollowList;
