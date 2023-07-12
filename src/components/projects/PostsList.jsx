import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

const PostsList = () => {

  const docRef = doc(db, 'posts', 'IxToa9xi2mFesn9ds7zY');
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }

  return (  
    <>
    </>
  );
}
 
export default PostsList;