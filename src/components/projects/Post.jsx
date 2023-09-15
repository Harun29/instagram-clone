import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../config/firebase";
import { getDoc, doc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../config/firebase";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Post = () => {
  
  const param = useParams();
  const [post, setPost] = useState();
  const [postPicture, setPostPicture] = useState();
  const [user, setUser] = useState();
  const { getUserByEmail } = useAuth();

  useEffect(() => {
    const fetchUserByEmail = async (email) => {
      const user = await getUserByEmail(email);
      setUser(user.userName);
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
      const docRef = doc(db, "posts", id)
      const post = await getDoc(docRef)
      setPost(post.data())
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
                  <small className="text-muted">Posted by:
                    <Link to={`/user/${user}`}>
                      {user}
                    </Link>
                  </small>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
 
export default Post;