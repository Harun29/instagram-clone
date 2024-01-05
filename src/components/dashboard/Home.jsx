import { useEffect, useRef, useState } from "react";
import { db } from "../../config/firebase";
import { getDownloadURL } from "firebase/storage";
import { storage } from "../../config/firebase";
import { ref } from "firebase/storage";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HeartIcon from "../../icons/HeartIcon";
import MessageCircleIcon from "../../icons/MessageCircleIcon";
import ArrowForwardIcon from "../../icons/ArrowForwardIcon";
import SaveIcon from "../../icons/SaveIcon";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Post from "../projects/Post";
import Suggested from "../projects/Suggested";

const Home = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState();
  const { getUserByEmail } = useAuth();
  const { currentUser } = useAuth();
  const [userViewing, setUserViewing] = useState();
  const [userViewingPhoto, setUserViewingPhoto] = useState("");
  const [userViewingId, setUserViewingId] = useState();
  const [likedByArray, setLikeByArray] = useState([]);
  const [savedArray, setSavedArray] = useState([]);
  const [postid, setPostid] = useState();
  const [seePost, setSeePost] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const postRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickInsidePost =
        postRef.current && postRef.current.contains(event.target);

      if (!isClickInsidePost && !buttonClicked) {
        setSeePost(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [seePost, buttonClicked]);

  useEffect(() => {
    seePost && setButtonClicked(false);
  }, [seePost]);

  useEffect(() => {
    if (!currentUser) {
      navigate("/signup");
    }
  }, [currentUser, navigate]);

  /* STUFF FROM POST */

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
    const fetchUserByEmail = async (email) => {
      const user = await getUserByEmailInPost(email);
      setUserViewing(user.docs[0].data());
      setUserViewingId(user.docs[0].id);
      setSavedArray(user.docs[0].data().savedIds);
      console.log(user);
    };
    try {
      currentUser && fetchUserByEmail(currentUser.email);
    } catch (err) {
      console.error(err);
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchPhoto = async () => {
      const userViewingPhoto = await getDownloadURL(
        ref(storage, `profile_pictures/${userViewing.pphoto}`),
      );
      setUserViewingPhoto(userViewingPhoto);
    };
    try {
      userViewing.pphoto && fetchPhoto();
    } catch (err) {
      console.error(err);
    }
  }, [userViewing]);

  /* ------------------------------------------------- */

  useEffect(() => {
    const fetchPosts = async () => {
      const postsRef = collection(db, "posts");
      const snapshot = await getDocs(postsRef);

      const postsData = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const user = await getUserByEmail(doc.data().user);
          const nick = user.userName;
          const userIdSnap = await getUserByEmailInPost(user.email);
          const userId = userIdSnap.docs[0].id;
          const photoUrl = await getDownloadURL(
            ref(storage, `posts_pictures/${doc.data().photo}`),
          );

          const getLikedByUsername = async () => {
            if (doc.data().likedby[0]) {
              const likedBy = await getUserByEmail(doc.data().likedby[0]);
              return likedBy.userName;
            } else {
              return null;
            }
          };

          const getLikedByPhoto = async () => {
            if (doc.data().likedby[0]) {
              const likedBy = await getUserByEmail(doc.data().likedby[0]);
              if (likedBy.pphoto) {
                const likedByPhoto = await getDownloadURL(
                  ref(storage, `profile_pictures/${likedBy.pphoto}`),
                );
                return likedByPhoto;
              } else {
                const likedByPhotoBlank = "/blank-profile.jpg";
                return likedByPhotoBlank;
              }
            }
          };

          setLikeByArray((prevLikedByArray) => [
            ...prevLikedByArray,
            { postid: doc.id, likedBy: doc.data().likedby },
          ]);

          if (user.pphoto) {
            const userPhotoUrl = await getDownloadURL(
              ref(storage, `profile_pictures/${user.pphoto}`),
            );
            return {
              id: doc.id,
              title: doc.data().title,
              description: doc.data().description,
              likedBy: doc.data().likedby ? doc.data().likedby : [],
              likedByPhoto: await getLikedByPhoto(),
              likedByUsername: await getLikedByUsername(),
              comments: doc.data().comments,
              photo: photoUrl,
              user: nick,
              userId: userId,
              userPhoto: userPhotoUrl,
            };
          } else {
            return {
              id: doc.id,
              title: doc.data().title,
              description: doc.data().description,
              likedBy: doc.data().likedby ? doc.data().likedby : [],
              likedByPhoto: await getLikedByPhoto(),
              likedByUsername: await getLikedByUsername(),
              comments: doc.data().comments,
              photo: photoUrl,
              user: nick,
              userId: userId,
              userPhoto: "/blank-profile.jpg",
            };
          }
        }),
      );

      setPosts(postsData);
    };

    fetchPosts();
  }, [getUserByEmail]);

  const handleComment = async (postid, postPhoto, userId, comment) => {
    const docRef = doc(db, "posts", postid);
    const docNotifRef = doc(db, "users", userId);

    const notifObject = (notifStatus) => {
      const object = {
        postCommented: postid,
        postCommentedPhoto: postPhoto,
        commentedBy: userViewing.userName,
        commentedByPhoto: userViewingPhoto,
        opened: notifStatus,
        notifRef: docNotifRef,
        notifType: "comment",
      };
      return object;
    };

    try {
      await updateDoc(docRef, {
        comments: arrayUnion({
          user: userViewing.email,
          comment: comment,
          userPhoto: userViewingPhoto,
          userName: userViewing.userName,
        }),
      });
      await updateDoc(docNotifRef, {
        notif: arrayUnion(notifObject(false)),
      });
    } catch (err) {
      console.error("Error in handleComment: ", err);
    }
  };

  const handleLike = async (postid, postPhoto, userId, index) => {
    const docRef = doc(db, "posts", postid);
    const docUserRef = doc(db, "users", userViewingId);
    const docNotifRef = doc(db, "users", userId);

    const notifObject = (notifStatus) => {
      const object = {
        postLiked: postid,
        postLikedPhoto: postPhoto,
        likedBy: userViewing.userName,
        likedByPhoto: userViewingPhoto,
        opened: notifStatus,
        notifRef: docNotifRef,
        notifType: "like",
      };
      return object;
    };

    try {
      if (likedByArray[index].likedBy.includes(userViewing.email)) {
        likedByArray[index].likedBy.pop(currentUser.email);
        document.getElementById(postid).classList.remove("active");
        document.getElementById(postid).setAttribute("fill", "none");
        await updateDoc(docRef, {
          likedby: arrayRemove(userViewing.email),
        });
        await updateDoc(docUserRef, {
          likedPosts: arrayRemove(postid),
        });
        await updateDoc(docNotifRef, {
          notif: arrayRemove(notifObject(false)),
        });
        await updateDoc(docNotifRef, {
          notif: arrayRemove(notifObject(true)),
        });
      } else {
        likedByArray[index].likedBy.push(currentUser.email);
        document.getElementById(postid).classList.add("active");
        document.getElementById(postid).setAttribute("fill", "red");
        await updateDoc(docRef, {
          likedby: arrayUnion(userViewing.email),
        });
        await updateDoc(docUserRef, {
          likedPosts: arrayUnion(postid),
        });
        await updateDoc(docNotifRef, {
          notif: arrayUnion(notifObject(false)),
        });
      }
    } catch (err) {
      console.error("Error in handleLike: ", err);
    }
  };

  useEffect(() => {
    console.log(savedArray);
  }, [savedArray]);

  const handleSave = async (postId, postPhoto) => {
    const docUserRef = doc(db, "users", userViewingId);
    const postid = postId + "save";

    try {
      if (savedArray.includes(postId)) {
        savedArray.pop(postId);
        document.getElementById(postid).setAttribute("fill", "none");
        await updateDoc(docUserRef, {
          saved: arrayRemove({
            postId,
            postPhoto,
          }),
        });
        await updateDoc(docUserRef, {
          savedIds: arrayRemove(postId),
        });
      } else {
        console.log("im here");
        savedArray.push(postId);
        document.getElementById(postid).setAttribute("fill", "full");
        await updateDoc(docUserRef, {
          saved: arrayUnion({
            postId,
            postPhoto,
          }),
        });
        await updateDoc(docUserRef, {
          savedIds: arrayUnion(postId),
        });
      }
    } catch (err) {
      console.error("Error in handleSave: ", err);
    }
  };

  const handleMore = (postid) => {
    const id = postid + "description";
    const buttonId = postid + "button";
    if (document.getElementById(id).classList.contains("more")) {
      document.getElementById(id).classList.remove("more");
      document.getElementById(buttonId).innerHTML = "more";
    } else {
      document.getElementById(id).classList.add("more");
      document.getElementById(buttonId).innerHTML = "less";
    }
  };

  const handleSeePost = (postid) => {
    setPostid(postid);
    setSeePost(true);
    setButtonClicked(true);
  };

  

  return (
    <div className="home-container">
      <div className="row">
        {posts ? (
          posts.map((post) => (
            <div id="post" className="post">
              <div className="post-header">
                <Link className="link-to-user" to={`/user/${post.user}`}>
                  <img
                    className="profile-photo"
                    src={post.userPhoto}
                    alt="profile"
                  />
                  <label>{post.user}</label>
                </Link>
                <FontAwesomeIcon icon={faEllipsis}></FontAwesomeIcon>
              </div>

              <img className="post-photo" src={post.photo} alt="post" />

              <div className="interactions">
                <div>
                  <div
                    key={posts.indexOf(post)}
                    onClick={() =>
                      handleLike(
                        post.id,
                        post.photo,
                        post.userId,
                        posts.indexOf(post),
                      )
                    }
                  >
                    <svg
                      id={post.id}
                      xmlns="http://www.w3.org/2000/svg"
                      class={`icon icon-tabler icon-tabler-heart icon-tabler-heart ${
                        post.likedBy.includes(userViewing.email) ? "active" : ""
                      }`}
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      stroke-width="1"
                      stroke="currentColor"
                      fill={
                        post.likedBy.includes(userViewing.email)
                          ? "red"
                          : "none"
                      }
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                    </svg>
                  </div>
                  <MessageCircleIcon></MessageCircleIcon>
                  <ArrowForwardIcon></ArrowForwardIcon>
                </div>
                <div
                  key={`${posts.indexOf(post)}save`}
                  onClick={() =>
                    handleSave(post.id, post.photo, posts.indexOf(post))
                  }
                >
                  <svg
                    id={`${post.id}save`}
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon icon-tabler icon-tabler-bookmark"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    stroke-width="1"
                    stroke="currentColor"
                    fill={savedArray.includes(post.id) ? "full" : "none"}
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M18 7v14l-6 -4l-6 4v-14a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4z" />
                  </svg>
                </div>
              </div>

              {post.likedBy.length !== 0 && (
                <div className="liked-by">
                  <Link to={`/user/${post.likedByUsername}`}>
                    <img src={post.likedByPhoto} alt="user" />
                  </Link>
                  <p>Liked by</p>
                  <Link to={`/user/${post.likedByUsername}`}>
                    {post.likedByUsername}
                  </Link>
                  <p>and</p>
                  <Link to="">others</Link>
                </div>
              )}

              <div className="post-description">
                <h4>{post.title}</h4>
                <p
                  id={post.id + "description"}
                  className="description-paragraph"
                >
                  {post.description}
                </p>
                <button
                  id={post.id + "button"}
                  onClick={() => handleMore(post.id)}
                  className="more-button"
                >
                  more
                </button>
              </div>

              {post.comments ? (
                <div
                  onClick={() => handleSeePost(post.id)}
                  className="view-all-comments"
                >
                  <p>View all {post.comments.length} comments</p>
                </div>
              ) : null}

              <div className="add-comment-container">
                <input
                  className="add-comment"
                  placeholder="Add a comment..."
                  id={post.id + "comment"}
                  type="text"
                />
                <button
                  onClick={() =>
                    handleComment(
                      post.id,
                      post.photo,
                      post.userId,
                      document.getElementById(post.id + "comment").value,
                    )
                  }
                >
                  post
                </button>
              </div>

              {seePost && (
                <div className="show-post">
                  <div className="post-background">
                    <Post param={postid} postRef={postRef}></Post>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="post loading">
            <div className="post-header loading">
              <Link className="link-to-user loading" to="">
                <div className="profile-photo loading"></div>
                <label className="loading">-------</label>
              </Link>
              <FontAwesomeIcon icon={faEllipsis}></FontAwesomeIcon>
            </div>

            <div className="post-photo loading"></div>

            <div className="interactions loading">
              <div>
                <HeartIcon></HeartIcon>
                <MessageCircleIcon></MessageCircleIcon>
                <ArrowForwardIcon></ArrowForwardIcon>
              </div>
              <SaveIcon></SaveIcon>
            </div>

            <div className="post-description loading">
              <h4 className="loading">--------------</h4>
              <p className="loading">
                -------------------------------------------------
                ----------------------------- ---------------------
              </p>
            </div>
          </div>
        )}
      </div>
      <Suggested></Suggested>
    </div>
  );
};

export default Home;
