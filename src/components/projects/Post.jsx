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
import { collection, query, where, getDocs} from "firebase/firestore";


const Post = () => {
  
  const { currentUser } = useAuth();
  const [userViewing, setUserViewing] = useState();
  const [userViewingId, setUserViewingId] = useState();
  const param = useParams();
  const [post, setPost] = useState();
  const [postPicture, setPostPicture] = useState();
  const [user, setUser] = useState();
  const [liked, setLiked] = useState(false);

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
    if(post){
      if(userViewing && post.likedby.includes(userViewing.email)){
        setLiked(true)
      }
    }
  },[userViewing, post])


  useEffect(() => {
    const fetchUserByEmail = async (email) => {
      const user = await getUserByEmailInPost(email);
      setUserViewing(user.docs[0].data());
      setUserViewingId(user.docs[0].id);
    }
    try{
      currentUser && fetchUserByEmail(currentUser.email)
    }
    catch(err){
      console.error(err)
    }
  }, [currentUser])

  const handleLike = async () => {
      // const likedby = post.likedby
    setLiked((prevLiked) => !prevLiked);
    const docRef = doc(db, "posts", param.postid);
    const docUserRef = doc(db, "users", userViewingId);

    try {
      if (!liked) {
        await updateDoc(docRef, {
          likedby: arrayUnion(userViewing.email)
        });
        await updateDoc(docUserRef, {
          likedPosts: arrayUnion(param.postid)
        });
      } else {
        await updateDoc(docRef, {
          likedby: arrayRemove(userViewing.email)
        });
        await updateDoc(docUserRef, {
          likedPosts: arrayRemove(param.postid)
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
  }, [post])

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