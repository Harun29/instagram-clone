import { useEffect, useState } from "react";
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
import HeartIconRed from "../../icons/HeartIconRed";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";


const Home = () => {

  const [posts, setPosts] = useState();
  const { getUserByEmail } = useAuth();
  const { currentUser } = useAuth();
  const [userViewing, setUserViewing] = useState();
  const [userViewingPhoto, setUserViewingPhoto] = useState('');
  const [userViewingId, setUserViewingId] = useState();


  useEffect(() => {
    console.log("posts: ", posts);
  })

  useEffect(() => {
    console.log(currentUser.email)
  }, [userViewing])

  /* STUFF FROM POST */

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

  /* ------------------------------------------------- */

  useEffect(() => {
    const fetchPosts = async () => {
      const postsRef = collection(db, "posts");
      const snapshot = await getDocs(postsRef);

      const postsData = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const user = await getUserByEmail(doc.data().user)
          const nick = user.userName
          const userIdSnap = await getUserByEmailInPost(user.email);
          const userId = userIdSnap.docs[0].id;
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
              likedBy: doc.data().likedby ? doc.data().likedby : [],
              photo: photoUrl,
              user: nick,
              userId: userId,
              userPhoto: userPhotoUrl
            };
          } else {
            return {
              id: doc.id,
              title: doc.data().title,
              description: doc.data().description,
              likedBy: doc.data().likedby ? doc.data().likedby : [],
              photo: photoUrl,
              user: nick,
              userId: userId,
              userPhoto: '/blank-profile.jpg'
            };
          }
        })
      );

      setPosts(postsData);
    };

    fetchPosts();

  }, [getUserByEmail]);


  const handleLike = async (postid, postPhoto, userId, likedBy) => {   
    // const likedby = post.likedby
    // setLiked((prevLiked) => !prevLiked);
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
        notifType: "like"
      }
      return object
    }

    try {
      if (likedBy.includes(userViewing.email)) {
        await updateDoc(docRef, {
          likedby: arrayRemove(userViewing.email)
        });
        await updateDoc(docUserRef, {
          likedPosts: arrayRemove(postid)
        });
        await updateDoc(docNotifRef, {
          notif: arrayRemove(notifObject(false))
        });
        await updateDoc(docNotifRef, {
          notif: arrayRemove(notifObject(true))
        });
        
      } else {
        await updateDoc(docRef, {
          likedby: arrayUnion(userViewing.email)
        });
        await updateDoc(docUserRef, {
          likedPosts: arrayUnion(postid)
        });
        await updateDoc(docNotifRef, {
          notif: arrayUnion(notifObject(false))
        });
      }
      console.log(likedBy);
      //likeby uvijek ostaje isto od pocetka montiranja home pagea
      if(likedBy.includes(userViewing.email)){
        document.getElementById(postid).classList.remove('active');
        document.getElementById(postid).setAttribute("fill", "none");
      }else{
        document.getElementById(postid).classList.add('active');
        document.getElementById(postid).setAttribute("fill", "red");
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
                <div onClick={() => handleLike(post.id, post.photo, post.userId, post.likedBy)}>
                  <svg id={post.id} xmlns="http://www.w3.org/2000/svg" class={`icon icon-tabler icon-tabler-heart icon-tabler-heart ${post.likedBy.includes(userViewing.email) ? "active" : ""}`} width="30" height="30" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill={post.likedBy.includes(userViewing.email) ? "red" : "none"} stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                  </svg>
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



