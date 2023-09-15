import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../config/firebase";
import { getDoc, doc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../config/firebase";

const Post = () => {
  
  const param = useParams();
  const [post, setPost] = useState([]);
  const [postPicture, setPostPicture] = useState();

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
      console.log(postPicture)
      setPostPicture(postPicture);
    }
    try{
      if (post){
        fetchPicture(post.photo)
      }
    }catch(err){
      console.error(err)
    }

  }, [post])
  

  return ( <></> );
}
 
export default Post;