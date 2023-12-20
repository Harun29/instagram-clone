import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc, collection, query, where, getDocs, updateDoc, arrayUnion, setDoc, onSnapshot } from "firebase/firestore";
import { db, storage } from "../../config/firebase";
import { getDownloadURL, ref } from "firebase/storage";

const Messenger = ({ user }) => {

  const param = user;
  const [userData, setUserData] = useState();
  const { currentUser } = useAuth();
  const [userViewing, setUserViewing] = useState();
  const [userViewingPhoto, setUserViewingPhoto] = useState();
  const [chatId, setChatId] = useState();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    try{
      if (chatId) {
        const unsubscribe = onSnapshot(doc(db, 'chats', chatId), (doc) => {
          const messages = doc.data()?.messages || [];
          const lastIndex = messages.length - 1;
          if (lastIndex >= 0) {
            setChat((prevChat) => [...prevChat, messages[lastIndex]]);
          }
        });
  
        return () => unsubscribe();
      }
    }catch(err){
      console.error(err);
    }
  }, [chatId]);

  useEffect(() => {
    const fetchChats = async () => {
      const chatDoc = doc(db, "chats", chatId);
      const chatRef = await getDoc(chatDoc)
      if(chatRef.exists()){
        setChat(chatRef.data().messages)
      }
    }
    try{
      chatId && fetchChats()
    }catch(err){
      console.error(err)
    }
  }, [chatId])

  useEffect(() => {
    if (userViewing) {
      if (userViewing.docs[0].id > param.userid) {
        setChatId(userViewing.docs[0].id + param.userid)
      } else {
        setChatId(param.userid + userViewing.docs[0].id)
      }
    }
  }, [param.userid, userViewing])

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
    let userViewingPhoto = '/blank-profile.jpg';
    if (user.docs[0].data().pphoto) {
      userViewingPhoto = await getDownloadURL(ref(storage, `profile_pictures/${user.docs[0].data().pphoto}`));
      setUserViewingPhoto(userViewingPhoto);
    } else {
      setUserViewingPhoto(userViewingPhoto);
    }
  }

  useEffect(() => {
    const fetchUserPhoto = async () => {
      const userRef = doc(db, "users", param.userid)
      const user = await getDoc(userRef)
      let userPhoto = '/blank-profile.jpg';
      if (user.data().pphoto) {
        userPhoto = await getDownloadURL(ref(storage, `profile_pictures/${user.data().pphoto}`));
        setUserData({
          userPhoto,
          userName: user.data().userName
        })
      } else {
        setUserData({
          userPhoto,
          userName: user.data().userName
        })
      }
    }
    getUserByEmailInPost(currentUser.email)
    fetchUserPhoto();
  }, [currentUser.email, param.userid])


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
              friendsId: param.userid,
              friendsPhoto: userData.userPhoto,
              friendsUserName: userData.userName
            })
          });
          await updateDoc(userRef, {
            chats: arrayUnion({
              chatId,
              myPhoto: userData.userPhoto,
              myUserName: userData.userName,
              friendsId: userViewing.docs[0].id,
              friendsPhoto: userViewingPhoto,
              friendsUserName: userViewing.docs[0].data().userName
            })
          });
        }

      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    if (userViewing && chatId && userData && param) {
      checkChatExists();
    }
  }, [chatId, param, userViewing, userViewingPhoto, userData]);

  const handleSend = async () => {
    const messageToSend = message;
    setMessage("");
    const docRef = doc(db, "chats", chatId);
    message && await updateDoc(docRef, {
      messages: arrayUnion({
        message: messageToSend,
        sentBy: userViewing.docs[0].data().userName,
        time: new Date()
      })
    })
  }

  return (
    <div className="messenger">
      <div className="friend-info">
        <img src={userData && userData.userPhoto} alt="friend" />
        <span>{userData && userData.userName}</span>
      </div>
      <div className="messages-container">
        {chat[0] && chat.map((message, index) => (
          message.sentBy === userViewing.docs[0].data().userName ? (
            <div className="my-message-container message" key={index}>
              <div className="my-message">
              {message.message}
              </div>
            </div>
          ) :
          (<div className="friends-message-container message" key={index}>
          <div className="friends-message">
          {message.message}
          </div>
        </div>)
        ))}
      </div>
      <div className="send-message">
        <input value={message} onChange={e => setMessage(e.target.value)} placeholder="Message..." type="text" />
        <span onClick={handleSend} className="send-button">Send</span>
      </div>
    </div>
  );
}

export default Messenger;