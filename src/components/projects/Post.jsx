import { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import {
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../config/firebase";
import { Link } from "react-router-dom";
import { collection, query, where, getDocs, addDoc, orderBy } from "firebase/firestore";
import MessageCircleIcon from "../../icons/MessageCircleIcon";
import ArrowForwardIcon from "../../icons/ArrowForwardIcon";
import { motion, AnimatePresence } from "framer-motion";
import ExitIcon from "../../icons/xIcon";

const Post = ({
  param,
  postRef,
  savedArray,
  postPhoto,
  userViewing,
  userViewingId,
  userViewingPhoto,
  setSeePost,
  userId
}) => {
  const [post, setPost] = useState();
  const [user, setUser] = useState();
  const [userPhoto, setUserPhoto] = useState();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

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
    if (post && !liked) {
      if (userViewing && post.likedby.includes(userViewing.email)) {
        setLiked(true);
      }
    }
  }, [userViewing, post, liked, saved]);

  useEffect(() => {
    if (post && !saved) {
      if (savedArray.includes(param)) {
        setSaved(true);
      }
    }
  }, [savedArray, post, param, saved]);

  const handleLike = async () => {
    const docRef = doc(db, "posts", param);
    const docUserRef = doc(db, "users", userViewingId);
    const docNotifRef = doc(db, "users", userId);

    const notifObject = (notifStatus) => {
      const object = {
        postLiked: param,
        postLikedPhoto: postPhoto,
        likedBy: userViewing.userName,
        likedByPhoto: userViewingPhoto,
        opened: notifStatus,
        notifRef: docNotifRef,
        notifType: "like",
        notifDate: new Date()
      };
      return object;
    };

    try {
      if (liked) {
        setLiked(false);
        document.getElementById(param).classList.remove("active");
        document.getElementById(param).setAttribute("fill", "none");
        await updateDoc(docRef, {
          likedby: arrayRemove(userViewing.email),
        });
        await updateDoc(docUserRef, {
          likedPosts: arrayRemove(param),
        });
        await updateDoc(docNotifRef, {
          notif: arrayRemove(notifObject(false)),
        });
        await updateDoc(docNotifRef, {
          notif: arrayRemove(notifObject(true)),
        });
      } else {
        setLiked(true);
        document.getElementById(param).classList.add("active");
        document.getElementById(param).setAttribute("fill", "red");
        await updateDoc(docRef, {
          likedby: arrayUnion(userViewing.email),
        });
        await updateDoc(docUserRef, {
          likedPosts: arrayUnion(param),
        });
        await updateDoc(docNotifRef, {
          notif: arrayUnion(notifObject(false)),
        });
      }
    } catch (err) {
      console.error("Error in handleLike: ", err);
    }
  };

  const handleSave = async () => {
    const docUserRef = doc(db, "users", userViewingId);
    const postid = param + "save";

    try {
      if (savedArray.includes(param)) {
        setSaved(false);
        savedArray.pop(param);
        document.getElementById(postid).setAttribute("fill", "none");
        await updateDoc(docUserRef, {
          saved: arrayRemove({
            postId: param,
            postPhoto: postPhoto,
          }),
        });
        await updateDoc(docUserRef, {
          savedIds: arrayRemove(param),
        });
      } else {
        setSaved(true);
        savedArray.push(param);
        document.getElementById(postid).setAttribute("fill", "full");
        await updateDoc(docUserRef, {
          saved: arrayUnion({
            postId: param,
            postPhoto: postPhoto,
          }),
        });
        await updateDoc(docUserRef, {
          savedIds: arrayUnion(param),
        });
      }
    } catch (err) {
      console.error("Error in handleSave: ", err);
    }
  };

  useEffect(() => {
    const fetchUserByEmail = async (email) => {
      const user = await getUserByEmailInPost(email);
      setUser(user.docs[0].data().userName);
      let userPhoto = "/blank-profile.jpg";
      if (user.docs[0].data().pphoto) {
        userPhoto = await getDownloadURL(
          ref(storage, `profile_pictures/${user.docs[0].data().pphoto}`),
        );
        setUserPhoto(userPhoto);
      } else {
        setUserPhoto(userPhoto);
      }
    };

    /* ERROR ON LOADING */
    try {
      if (post) {
        fetchUserByEmail(post.user);
      }
    } catch (err) {
      console.error(err);
    }
  }, [post]);

  useEffect(() => {
    try{
      const docRef = doc(db, "posts", param);
      const unsub = onSnapshot(collection(docRef, "comments"), (document) => {
        document.forEach((doc) => {
          if (!comments.includes(doc.data())){
            setComment((prevComments) => [...prevComments, doc.data()])
          }
        });
      })
      return () => unsub();
    }catch(err){
      console.error("error in fetching comments")
    }
  }, [param])

  useEffect(() => {
    try {
      const document = doc(db, "posts", param)
      setPost(document.data());
    } catch (err) {
      console.error("erron in post snapshot: ", err);
    }
  }, []);

  useEffect(() => {
    const fetchComments = async (id) => {
      const docRef = doc(db, "posts", id);
      const collectionRef = collection(docRef, "comments");
      const orderedQuery = query(collectionRef, orderBy('date', 'asc'));
      
      try {
        const commentsSnapshot = await getDocs(orderedQuery);
        const commentsData = [];
        
        commentsSnapshot.forEach((doc) => {
          commentsData.push(doc.data());
        });
  
        setComments(commentsData);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };
  
    try {
      fetchComments(param);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  }, [param]);
  

  const handleComment = async () => {
    const docRef = doc(db, "posts", param);
    console.log("userid: ", userId)
    const docNotifRef = doc(db, "users", userId);

    const notifObject = (notifStatus) => {
      const object = {
        postCommented: param,
        postCommentedPhoto: postPhoto,
        commentedBy: userViewing.userName,
        commentedByPhoto: userViewingPhoto,
        opened: notifStatus,
        notifRef: docNotifRef,
        notifType: "comment",
        notifDate: new Date()
      };
      return object;
    };

    try {
      await addDoc(collection(docRef, "comments"), {
        user: userViewing.email,
        comment: comment,
        userPhoto: userViewingPhoto,
        userName: userViewing.userName,
        date: new Date()
      })
      await updateDoc(docNotifRef, {
        notif: arrayUnion(notifObject(false)),
      });
      setComment("");
    } catch (err) {
      console.error("Error in handleComment: ", err);
    }
  };

  useEffect(() => {
    userId && console.log(userId)
  }, [userId])

  return (
    post &&
    postPhoto &&
    postRef &&
    userViewingPhoto && (
      <div className="post-background">
        <AnimatePresence>
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="card"
            ref={postRef}
          >
            <img src={postPhoto} alt="Post" className="card-img-top" />

            <div className="card-body">
              <div className="post-header in-post">
                <Link className="link-to-user" to={`/user/${user}`}>
                  <img
                    className="profile-photo"
                    src={userPhoto ? userPhoto : "blank-profile.jpg"}
                    alt="profile"
                  />
                  <label>{user}</label>
                </Link>
                <motion.div whileHover={{scale: 1.1}} whileTap={{scale: 1.2}} onClick={setSeePost}>
                  <ExitIcon size={"36"} stroke={"0.5"}></ExitIcon>
                </motion.div>
              </div>

              <div className="post-header-description">
                <Link className="link-to-user" to={`/user/${user}`}>
                  <img
                    className="profile-photo"
                    src={userPhoto ? userPhoto : "blank-profile.jpg"}
                    alt="profile"
                  />
                </Link>
                <p className="card-text">
                  <Link to={`/user/${user}`} className="bold">
                    {user}
                  </Link>{" "}
                  {post.title} {post.description}
                </p>
              </div>

              <div className="comments-in-post">
                {comments.map((comment) => (
                  <div className="comment">
                    <Link to={`/user/${comment.userName}`}>
                      <img
                        src={
                          comment.userPhoto
                            ? comment.userPhoto
                            : "blank-profile.jpg"
                        }
                        alt="commented by"
                      />
                    </Link>
                    <p>
                      <Link to={`/user/${comment.userName}`}>
                        {comment.userName}
                      </Link>{" "}
                      {comment.comment}
                    </p>
                  </div>
                ))}
              </div>

              <div className="interactions in-post">
                <div>
                  <div onClick={handleLike}>
                    <svg
                      id={param}
                      xmlns="http://www.w3.org/2000/svg"
                      class={`icon icon-tabler icon-tabler-heart icon-tabler-heart ${
                        liked ? "active" : ""
                      }`}
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      stroke-width="1"
                      stroke="currentColor"
                      fill={liked ? "red" : "none"}
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
                <div key={`${param}save`} onClick={handleSave}>
                  <svg
                    id={`${param}save`}
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon icon-tabler icon-tabler-bookmark"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    stroke-width="1"
                    stroke="currentColor"
                    fill={saved ? "full" : "none"}
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M18 7v14l-6 -4l-6 4v-14a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4z" />
                  </svg>
                </div>
              </div>

              <div className="add-comment-container in-post">
                <input
                  className="add-comment in-post"
                  placeholder="Add a comment..."
                  id={post.id + "comment"}
                  type="text"
                  onChange={(e) => setComment(e.target.value)}
                  value={comment}
                />
                <button
                  className="comment-button-in-post"
                  onClick={handleComment}
                >
                  post
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    )
  );
};

export default Post;
