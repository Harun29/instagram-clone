import { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { getDoc, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../config/firebase";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { collection, query, where, getDocs } from "firebase/firestore";
import MessageCircleIcon from "../../icons/MessageCircleIcon";
import ArrowForwardIcon from "../../icons/ArrowForwardIcon";
import SaveIcon from "../../icons/SaveIcon";


const Post = ({param}) => {

  const { currentUser } = useAuth();
  const [userViewing, setUserViewing] = useState();
  const [userViewingPhoto, setUserViewingPhoto] = useState('');
  const [userViewingId, setUserViewingId] = useState();
  const [post, setPost] = useState();
  const [postPicture, setPostPicture] = useState();
  const [user, setUser] = useState();
  const [userId, setUserId] = useState();
  const [userPhoto, setUserPhoto] = useState();
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    currentUser && console.log(currentUser.email)
  }, [currentUser])

  const getUserByEmailInPost = async (email) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error('No matching documents for email:', email);
      return null;
    }
    const user = querySnapshot;
    return user;
  }

  useEffect(() => {
    if (post) {
      if (userViewing && post.likedby.includes(userViewing.email)) {
        setLiked(true)
      }
    }
  }, [userViewing, post])


  useEffect(() => {
    const fetchUserByEmail = async (email) => {
      const user = await getUserByEmailInPost(email);
      setUserViewing(user.docs[0].data());
      setUserViewingId(user.docs[0].id);
      console.log(user)
    }
    try {
      currentUser && fetchUserByEmail(currentUser.email)
    }
    catch (err) {
      console.error(err)
    }
  }, [currentUser])

  useEffect(() => {
    const fetchPhoto = async () => {
      const userViewingPhoto = await getDownloadURL(ref(storage, `profile_pictures/${userViewing.pphoto}`))
      setUserViewingPhoto(userViewingPhoto);
    }
    try {
      userViewing.pphoto && fetchPhoto()
    } catch (err) {
      console.error(err)
    }
  }, [userViewing])

  useEffect(() => {
    const fetchPostPhoto = async () => {
      const docRef = doc(db, 'posts', param);
      const docSnap = await getDoc(docRef)
      const docImg = await getDownloadURL(ref(storage, `posts_pictures/${docSnap.data().photo}`))
      setPostPicture(docImg);
    }

    try {
      param && fetchPostPhoto();
    } catch (err) {
      console.error(err)
    }
  }, [param])

  const handleLike = async () => {
    setLiked((prevLiked) => !prevLiked);
    const docRef = doc(db, "posts", param);
    const docUserRef = doc(db, "users", userViewingId);
    const docNotifRef = doc(db, "users", userId);

    const notifObject = (notifStatus) => {
      const object = {
        postLiked: param,
        postLikedPhoto: postPicture,
        likedBy: userViewing.userName,
        likedByPhoto: userViewingPhoto,
        opened: notifStatus,
        notifRef: docNotifRef,
        notifType: "like"
      }
      return object
    }

    try {
      if (!liked) {
        await updateDoc(docRef, {
          likedby: arrayUnion(userViewing.email)
        });
        await updateDoc(docUserRef, {
          likedPosts: arrayUnion(param)
        });
        await updateDoc(docNotifRef, {
          notif: arrayUnion(notifObject(false))
        });
      } else {
        await updateDoc(docRef, {
          likedby: arrayRemove(userViewing.email)
        });
        await updateDoc(docUserRef, {
          likedPosts: arrayRemove(param)
        });
        await updateDoc(docNotifRef, {
          notif: arrayRemove(notifObject(false))
        });
        await updateDoc(docNotifRef, {
          notif: arrayRemove(notifObject(true))
        });
      }
    } catch (err) {
      console.error("Error in handleLike: ", err);
    }
  };

  useEffect(() => {
    const fetchUserByEmail = async (email) => {
      const user = await getUserByEmailInPost(email);
      setUser(user.docs[0].data().userName);
      let userPhoto = '/blank-profile.jpg';
      if (user.docs[0].data().pphoto) {
        userPhoto = await getDownloadURL(ref(storage, `profile_pictures/${user.docs[0].data().pphoto}`));
        setUserPhoto(userPhoto);
      } else {
        setUserPhoto(userPhoto);
      }
      setUserId(user.docs[0].id)
    }

    /* ERROR ON LOADING */
    try {
      if (post.user) {
        fetchUserByEmail(post.user)
      }
    }
    catch (err) {
      console.error(err)
    }
  }, [post])

  useEffect(() => {
    const fetchPost = async (id) => {
      const docRef = doc(db, "posts", id);
      const post = await getDoc(docRef);
      setPost(post.data());
    }

    try {
      fetchPost(param);
    } catch (err) {
      console.error("error: ", err)
    }

  }, [param])

  useEffect(() => {
    const fetchPicture = async (photoName) => {
      const postPicture = await getDownloadURL(
        ref(storage, `posts_pictures/${photoName}`)
      );
      setPostPicture(postPicture);
    }
    /* ERROR ON LOADING */
    try {
      if (post.photo) {
        fetchPicture(post.photo)
      }
    } catch (err) {
      console.error(err)
    }
  }, [post])

  useEffect(() => {
    post && console.log("post: ", post)
  }, [post])

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
        notifType: "comment"
      }
      return object
    }

    try {
      await updateDoc(docRef, {
        comments: arrayUnion({
          user: userViewing.email,
          comment: comment
        }
        )
      });
      await updateDoc(docNotifRef, {
        notif: arrayUnion(notifObject(false))
      });
    } catch (err) {
      console.error("Error in handleComment: ", err);
    }
  };

  return (
    <div className="post-background">
      {!post ? (
        <p>Loading...</p>
      ) : (
        <div className="card">
          <img src={postPicture} alt="Post" className="card-img-top" />

          <div className="card-body">

              <div className="post-header in-post">
                <Link className="link-to-user" to={`/user/${user}`}>
                  <img className="profile-photo" src={userPhoto} alt="profile" />
                  <label>{user}</label>
                </Link>
                <FontAwesomeIcon icon={faEllipsis}></FontAwesomeIcon>
              </div>

              <div className="post-header-description">
                <Link className="link-to-user" to={`/user/${user}`}>
                  <p className="card-text">
                    <img className="profile-photo" src={userPhoto} alt="profile" />
                    {user} {" "}
                    {post.title} {" "}
                    {post.description}
                  </p>
                </Link>
              </div>

              <div className="comments-in-post">
                <p>comment</p>
              </div>

              <div className="interactions in-post">
                <div>
                  <div onClick={handleLike}>
                    <svg id={post.id} xmlns="http://www.w3.org/2000/svg" class={`icon icon-tabler icon-tabler-heart icon-tabler-heart ${post.likedby.includes(currentUser.email) ? "active" : ""}`} width="30" height="30" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill={post.likedby.includes(userViewing.email) ? "red" : "none"} stroke-linecap="round" stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                    </svg>
                  </div>
                  <MessageCircleIcon></MessageCircleIcon>
                  <ArrowForwardIcon></ArrowForwardIcon>
                </div>
                <SaveIcon></SaveIcon>
              </div>

              <div className="add-comment-container in-post">
                <input className="add-comment in-post" placeholder="Add a comment..." id={post.id + "comment"} type="text" />
                <button className="comment-button-in-post" onClick={() => handleComment(post.id, post.photo, post.userId, document.getElementById(post.id + "comment").value)}>post</button>
              </div>
            </div>

        </div>
      )}
    </div>
  );
}

export default Post;