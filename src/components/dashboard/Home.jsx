import { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { getDownloadURL } from "firebase/storage";
import { storage } from "../../config/firebase";
import { ref } from "firebase/storage";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { faHeart, faComment, faShare, faSave, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

          if(user.pphoto){
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

  return (
    <div className="home-container">
      <div className="row">
        <div className="stories"></div>
        {posts ? posts.map((post) => (
          <div className="post">

            <div className="post-header">
              <Link to={`/profile/${post.user}`}>
                <img className="profile-photo" src={post.userPhoto} alt="profile" />
                <label>{post.user}</label>
              </Link>
              <FontAwesomeIcon icon={faEllipsis}></FontAwesomeIcon>
            </div>

            <img className="post-photo" src={post.photo} alt="couldnt load image" />

            <div className="interactions">
              <div>
                <FontAwesomeIcon size="xl" icon={faHeart}></FontAwesomeIcon>
                <FontAwesomeIcon size="xl" icon={faComment}></FontAwesomeIcon>
                <FontAwesomeIcon size="xl" icon={faShare}></FontAwesomeIcon>
              </div>
              <FontAwesomeIcon size="xl" icon={faSave}></FontAwesomeIcon>
            </div>

            <div className="post-description">
              <h4>{post.title}</h4>
              <p>{post.description}</p>
            </div>

          </div>
        )) :
          <div>
            Loading...
          </div>}
      </div>
      <div className="quick-message">

      </div>
    </div>
  );
}

export default Home;



