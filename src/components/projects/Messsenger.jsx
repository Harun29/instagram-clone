import { useParams } from "react-router-dom";
import Chats from "./Chats";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc, collection, query, where, getDocs, updateDoc, arrayUnion, setDoc } from "firebase/firestore";
import { db, storage } from "../../config/firebase";
import { getDownloadURL, ref } from "firebase/storage";

const Messenger = () => {

  const param = useParams()
  const [userData, setUserData] = useState();

  const { currentUser } = useAuth();
  const [userViewing, setUserViewing] = useState();
  const [userViewingPhoto, setUserViewingPhoto] = useState();
  const [chatId, setChatId] = useState();

  useEffect(() => {
    if(userViewing){
      if(userViewing.docs[0].id > param.userid){
        setChatId(userViewing.docs[0].id + param.userid)
      }else{
        setChatId(param.userid + userViewing.docs[0].id)
      }
    }
  }, [param.userid])

  /* STUFF FROM POST */

  const getUserByEmailInPost = async (email) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error('No matching documents for email:', email);
      return null;
    }
    const user = querySnapshot;
    setUserViewing(user);
    let userViewingPhoto = 'blank-profile.jpg';
    if(user.docs[0].data().pphoto){
      userViewingPhoto = await getDownloadURL(ref(storage, `profile_pictures/${user.docs[0].data().pphoto}`));
      setUserViewingPhoto(userViewingPhoto);
    }else{
      setUserViewingPhoto(userViewingPhoto);
    }
  }

  useEffect(() => {
    const fetchUserPhoto = async() => {
      const userRef = doc(db, "users", param.userid)
      const user = await getDoc(userRef)
      let userPhoto = 'blank-profile.jpg';
      if(user.data().pphoto){
        userPhoto = await getDownloadURL(ref(storage, `profile_pictures/${user.docs[0].data().pphoto}`));
        setUserData({
          userPhoto,
          userName: user.data().userName
        })
      }else{
        setUserData({
          userPhoto,
          userName: user.data().userName
        })
      }
    }
    getUserByEmailInPost(currentUser.email)
    fetchUserPhoto();
  }, [currentUser.email])


  useEffect(() => {
    const checkChatExists = async () => {
      const chatRef = doc(db, "chats", chatId);
      try {
        const chatSnap = await getDoc(chatRef);
        if (!chatSnap.exists()) {
          const userViewingRef = doc(db, "users", userViewing.docs[0].id)
          const userRef = doc(db, "users", param.userid)
          await setDoc(doc(db, "chats", chatId), {
            messages: []
          })
          await updateDoc(userViewingRef, {
            chats: arrayUnion({
              chatId,
              myPhoto: userViewingPhoto,
              myUserName: userViewing.docs[0].data().userName,
              friendsPhoto: userData.userPhoto,
              friendsUserName: userData.userName
            })
          });
          await updateDoc(userRef, {
            chats: arrayUnion({
              chatId,
              myPhoto: userData.userPhoto,
              myUserName: userData.userName,
              friendsPhoto: userViewingPhoto,
              friendsUserName: userViewing.docs[0].data().userName
            })
          });
        }

      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    chatId && checkChatExists();
  }, [chatId, param, userViewing]);

  return (
    <div className="messenger">
      <Chats />
      <div className="chat-container">
      </div>
    </div>
  );
}

export default Messenger;