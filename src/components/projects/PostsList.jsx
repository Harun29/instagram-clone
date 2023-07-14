import { doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { db } from "../../config/firebase";

const PostsList = ({ user }) => {

  useEffect(() => {

   const fetchPosts = async (postId) => {
      const docRef = doc(db, 'posts', postId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data().photo);
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
   }
   
   try{
    fetchPosts('IxToa9xi2mFesn9ds7zY');
    console.log("user: ", user)
   }catch(err){
    console.error(err)
   }
  }, [user])

  return (  
    <>
    </>
  );
}
 
export default PostsList;