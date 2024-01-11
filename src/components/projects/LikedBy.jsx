import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../config/firebase";
import { motion, AnimatePresence } from "framer-motion";

const LikedBy = ({likedby, likedByRef}) => {

  const {getUserByEmail} = useAuth();
  const [likedByArray, setLikedByArray] = useState([]);

  useEffect(() => {
    setLikedByArray([])
    const fetchUsers = async(email) => {
      const user = await getUserByEmail(email);
      let userPhoto = 'blank-profile.jpg';
      if (user.pphoto) {
        userPhoto = await getDownloadURL(ref(storage, `profile_pictures/${user.pphoto}`))
      }
      user.pphoto = userPhoto;
      setLikedByArray((prevLikedBy) => [...prevLikedBy, user])
    }

    try{
      likedby && Promise.all(likedby.map(likedEmail => fetchUsers(likedEmail)))
    }catch(err){
      console.error("error fetching user in liked by: ", err)
    }
  }, [likedby])

  useEffect(() => {
    console.log(likedByArray)
  }, [likedByArray])

  return ( 
    <div className="liked-by-background">
      <AnimatePresence>
      <motion.div initial={{scale: 1.1, opacity: 0}} animate={{scale: 1, opacity: 1}} ref={likedByRef} className="likes">
        <div className="liked-by-header">Likes</div>
        <div className="liked-by-list-container">
        {likedByArray && likedByArray.map(likedby => (
          <div className="liked-by-from-array">
            <div>
              <img src={likedby.pphoto} alt="user" />
              <div>
                <span>{likedby.userName}</span>
                <span>{likedby.name}</span>
              </div>
            </div>
            <div className="follow-button">Follow</div>
          </div>
        ))}
        </div>
      </motion.div>
      </AnimatePresence>
    </div>
   );
}
 
export default LikedBy;