import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../config/firebase";

const PostsList = ({ postsList }) => {
  
  const [postsPhotos, setPostsPhotos] = useState()

  useEffect(() => {
    console.log("photos: ", postsPhotos)
  }, [postsPhotos])

  useEffect(() => { 
  const posts = [];

   const fetchPosts = async (postId) => {
      const docRef = doc(db, 'posts', postId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        posts.push(docSnap.data().photo)
      } else {
        console.log("No such document!");
      }
   }
   
   try{
    postsList.map((post) => {
      return fetchPosts(post)
    })
   }catch(err){
    console.error(err)
   }finally{
    setPostsPhotos(posts);
   }

  }, [postsList])

  return (  
    <>
    </>
  );
}
 
export default PostsList;