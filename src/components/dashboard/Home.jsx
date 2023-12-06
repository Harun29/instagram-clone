import { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { collection, getDocs } from "firebase/firestore";
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

const Home = () => {

  const [posts, setPosts] = useState()
  const { getUserByEmail } = useAuth()

  useEffect(() => {
    const fetchPosts = async () => {
      const postsRef = collection(db, "posts");
      const snapshot = await getDocs(postsRef);

      const postsData = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const user = await getUserByEmail(doc.data().user)
          const nick = user.userName
          const photoUrl = await getDownloadURL(
            ref(storage, `posts_pictures/${doc.data().photo}`)
          );

          if (user.pphoto) {
            const userPhotoUrl = await getDownloadURL(
              ref(storage, `profile_pictures/${user.pphoto}`)
            );
            return {
              id: doc.id,
              title: doc.data().title,
              description: doc.data().description,
              photo: photoUrl,
              user: nick,
              userPhoto: userPhotoUrl
            };
          } else {
            return {
              id: doc.id,
              title: doc.data().title,
              description: doc.data().description,
              photo: photoUrl,
              user: nick,
              userPhoto: '/blank-profile.jpg'
            };
          }
        })
      );

      setPosts(postsData);
    };

    fetchPosts();

  }, [getUserByEmail]);

  const handleLike = async (postid) => {
    // const likedby = post.likedby
  setLiked((prevLiked) => !prevLiked);
  const docRef = doc(db, "posts", postid);
  const docUserRef = doc(db, "users", userViewingId);
  const docNotifRef = doc(db, "users", userId);

  const notifObject = (notifStatus) => {
    const object = {
      postLiked: param.postid,
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
        likedPosts: arrayUnion(param.postid)
      });
      await updateDoc(docNotifRef, {
        notif: arrayUnion(notifObject(false))
      });
    } else {
      await updateDoc(docRef, {
        likedby: arrayRemove(userViewing.email)
      });
      await updateDoc(docUserRef, {
        likedPosts: arrayRemove(param.postid)
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

  return (
    <div className="home-container">
      <div className="row">
        <div className="stories"></div>
        {posts ? posts.map((post) => (
          <div className="post">

            <div className="post-header">
              <Link className="link-to-user" to={`/profile/${post.user}`}>
                <img className="profile-photo" src={post.userPhoto} alt="profile" />
                <label>{post.user}</label>
              </Link>
              <FontAwesomeIcon icon={faEllipsis}></FontAwesomeIcon>
            </div>

            <img className="post-photo" src={post.photo} alt="couldnt load image" />

            <div className="interactions">
              <div>
                <div onClick={() => console.log(post.id)}>
                  <HeartIcon></HeartIcon>
                </div>
                <MessageCircleIcon></MessageCircleIcon>
                <ArrowForwardIcon></ArrowForwardIcon>
              </div>
              <SaveIcon></SaveIcon>
            </div>

            <div className="post-description">
              <h4>{post.title}</h4>
              <p>{post.description}</p>
            </div>

          </div>
        )) :
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
              <p className="loading">-------------------------------------------------
                ----------------------------- ---------------------</p>
            </div>
          </div>}

      </div>
      <div className="quick-message">

      </div>
    </div>
  );
}

export default Home;



