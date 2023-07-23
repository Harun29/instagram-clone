import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../config/firebase";

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
      const postPicture = await getDownloadURL(ref(storage, `posts_pictures/${docSnap.data().photo}`))

      if (docSnap.exists()) {
        posts.push(
          {picture: postPicture,
          link: docSnap.id}
          )
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