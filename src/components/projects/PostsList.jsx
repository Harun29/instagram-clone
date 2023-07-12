import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

const PostsList = () => {
  
  const docRef = doc(db, 'posts', 'IxToa9xi2mFesn9ds7zY')
  const docSnap = getDoc(docRef)

  useEffect(() => {
    console.log(docSnap)
  }, [docSnap])

  return (  
    <>
    </>
  );
}
 
export default PostsList;