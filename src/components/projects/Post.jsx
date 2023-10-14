import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../config/firebase";
import { getDoc, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../config/firebase";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faHeartBroken } from '@fortawesome/free-solid-svg-icons';

const Post = () => {
  
  const param = useParams();
  const [post, setPost] = useState();
  const [postPicture, setPostPicture] = useState();
  const [user, setUser] = useState();
  const [userEmail, setUserEmail] = useState();
  const { getUserByEmail } = useAuth();
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    setLiked((prevLiked) => !prevLiked);
    const docRef = doc(db, "posts", param.postid);

    try {
      if (!liked) {
        await updateDoc(docRef, {
          likedby: arrayUnion(userEmail)
        });
      } else {
        await updateDoc(docRef, {
          likedby: arrayRemove(userEmail)
        });
      }
    } catch (err) {
      console.error("Error in handleLike: ", err);
    }
  };

  useEffect(() => {
    const fetchUserByEmail = async (email) => {
      const user = await getUserByEmail(email);
      setUser(user.userName);
      setUserEmail(user.email);
    }

    /* ERROR ON LOADING */
    try{
      if (post.user){
        fetchUserByEmail(post.user)
      }
    }
    catch(err){
      console.error(err)
    }
  }, [post, getUserByEmail])

  useEffect(() => {
    const fetchPost = async(id) => {
      const docRef = doc(db, "posts", id);
      const post = await getDoc(docRef);
      setPost(post.data());
    }

    try{
      fetchPost(param.postid);
    }catch(err){
      console.error("error: ", err)
    }

  },[param])

  useEffect(() => {
    const fetchPicture = async(photoName) => {
      const postPicture = await getDownloadURL(
      ref(storage, `posts_pictures/${photoName}`)
      );
      setPostPicture(postPicture);
    }
    /* ERROR ON LOADING */
    try{
      if (post.photo){
        fetchPicture(post.photo)
      }
    }catch(err){
      console.error(err)
    }
  }, [post])
  

return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          {!post ? ( 
            <p>Loading...</p>
          ) : (
            <div className="card">
              <img src={postPicture} alt="Post" className="card-img-top" />
              <div className="card-body">
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text">{post.description}</p>
                <p className="card-text">
                  <small className="text-muted">
                    Posted by:
                    <Link to={`/user/${user}`}>
                      {user}
                    </Link>
                  </small>
                </p>
                <button className="btn btn-link" onClick={handleLike}>
                  <FontAwesomeIcon size="xl" icon={!liked ? faHeart : faHeartBroken} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
 
export default Post;