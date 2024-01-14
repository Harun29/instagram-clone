import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { db, storage } from "../../config/firebase";
import { getDownloadURL, ref } from "firebase/storage";

const Messenger = ({ user }) => {
  const param = user;
  const [userData, setUserData] = useState();
  const { currentUser } = useAuth();
  const [userViewing, setUserViewing] = useState();
  const [userViewingPhoto, setUserViewingPhoto] = useState();
  const [userViewingUserName, setUserViewingUserName] = useState();
  const [chatId, setChatId] = useState();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [lastMessage, setLastMessage] = useState("");
  const [seenBy, setSeenBy] = useState();
  const [addedDoc, setAddedDoc] = useState(false);

  useEffect(() => {
    const messagesContainer = document.getElementsByClassName("messages-container")[0];
    
    if (messagesContainer) {
      const lastMessage = messagesContainer.lastElementChild;
      chat && lastMessage && lastMessage.scrollIntoView();
    }
  }, [chat]);
  
  useEffect(() => {
    try {
      if (chatId && chat) {
        const unsubscribe = onSnapshot(doc(db, "chats", chatId), (document) => {
          const messages = document.data()?.messages || [];
          const lastIndex = messages.length - 1;
          setSeenBy(document.data()?.seenBy);
          if (messages[lastIndex]) {
            setLastMessage(messages[lastIndex].message);
          } else {
            setLastMessage("");
          }
          if (lastIndex >= 0 && chat.length !== messages.length) {
            setChat((prevChat) => [...prevChat, messages[lastIndex]]);
          }
        });
        return () => unsubscribe();
      }
    } catch (err) {
      console.error(err);
    }
  }, [chatId, chat]);

  useEffect(() => {
    const updateSeen = async () => {
      const docRef = doc(db, "chats", chatId);
      userViewingUserName && setSeenBy(userViewingUserName);
      await updateDoc(docRef, {
        seenBy: userViewingUserName,
      });
    };
    try {
      userViewingUserName &&
        userData &&
        addedDoc &&
        updateSeen();
    } catch (err) {
      console.error(err);
    }
  }, [chat, chatId, userViewingUserName, userData, addedDoc]);

  useEffect(() => {
    const fetchChats = async () => {
      const chatDoc = doc(db, "chats", chatId);
      const chatRef = await getDoc(chatDoc);
      if (chatRef.exists()) {
        setChat(chatRef.data().messages);
        setSeenBy(chatRef.data().seenBy);
      }
    };
    try {
      chatId && fetchChats();
    } catch (err) {
      console.error(err);
    }
  }, [chatId]);

  useEffect(() => {
    if (userViewing) {
      if (userViewing.docs[0].id > param.userid) {
        setChatId(userViewing.docs[0].id + param.userid);
      } else {
        setChatId(param.userid + userViewing.docs[0].id);
      }
    }
  }, [param.userid, userViewing]);

  const getUserByEmailInPost = async (email) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error("No matching documents for email:", email);
      return null;
    }
    const user = querySnapshot;
    setUserViewing(user);
    let userViewingPhoto = "/blank-profile.jpg";
    if (user.docs[0].data().pphoto) {
      userViewingPhoto = await getDownloadURL(
        ref(storage, `profile_pictures/${user.docs[0].data().pphoto}`),
      );
      setUserViewingPhoto(userViewingPhoto);
    } else {
      setUserViewingPhoto(userViewingPhoto);
    }
    setUserViewingUserName(user.docs[0].data().userName);
  };

  useEffect(() => {
    const fetchUserPhoto = async () => {
      const userRef = doc(db, "users", param.userid);
      const user = await getDoc(userRef);
      let userPhoto = "/blank-profile.jpg";
      if (user.data().pphoto) {
        userPhoto = await getDownloadURL(
          ref(storage, `profile_pictures/${user.data().pphoto}`),
        );
        setUserData({
          userPhoto,
          userName: user.data().userName,
        });
      } else {
        setUserData({
          userPhoto,
          userName: user.data().userName,
        });
      }
    };
    getUserByEmailInPost(currentUser.email);
    fetchUserPhoto();
  }, [currentUser.email, param.userid]);

  useEffect(() => {
    const checkChatExists = async () => {
      const chatRef = doc(db, "chats", chatId);
      try {
        const chatSnap = await getDoc(chatRef);
        if (!chatSnap.exists()) {
          const userViewingRef = doc(db, "users", userViewing.docs[0].id);
          const userRef = doc(db, "users", param.userid);
          await setDoc(doc(db, "chats", chatId), {
            messages: [],
            seenBy: ""
          });
          setAddedDoc(true);
          await updateDoc(userViewingRef, {
            chats: arrayUnion({
              chatId,
              myPhoto: userViewingPhoto,
              myUserName: userViewing.docs[0].data().userName,
              friendsId: param.userid,
              friendsPhoto: userData.userPhoto,
              friendsUserName: userData.userName,
              lastMessage: "",
            }),
          });
          await updateDoc(userRef, {
            chats: arrayUnion({
              chatId,
              myPhoto: userData.userPhoto,
              myUserName: userData.userName,
              friendsId: userViewing.docs[0].id,
              friendsPhoto: userViewingPhoto,
              friendsUserName: userViewing.docs[0].data().userName,
              lastMessage: "",
            }),
          });
        }else{
          setAddedDoc(true);
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };
    try{
      if (userViewing && chatId && userData && param) {
        checkChatExists();
      }
    }catch(err){
      console.error("error in checking if chat exists: ", err)
    }
  }, [chatId, param, userViewing, userViewingPhoto, userData, seenBy]);

  const handleSend = async () => {
    const messageToSend = message;
    setMessage("");
    const docRef = doc(db, "chats", chatId);
    const userViewingRef = doc(db, "users", userViewing.docs[0].id);
    const userRef = doc(db, "users", param.userid);

    await updateDoc(docRef, {
      messages: arrayUnion({
        message: messageToSend,
        sentBy: userViewing.docs[0].data().userName,
        time: new Date(),
      }),
      seenBy: userViewingUserName,
    });

    setSeenBy(userViewingUserName);

    await updateDoc(userRef, {
      chats: arrayUnion({
        chatId,
        myPhoto: userData.userPhoto,
        myUserName: userData.userName,
        friendsId: userViewing.docs[0].id,
        friendsPhoto: userViewingPhoto,
        friendsUserName: userViewing.docs[0].data().userName,
        lastMessage: messageToSend,
      }),
    });
    await updateDoc(userRef, {
      chats: arrayRemove({
        chatId,
        myPhoto: userData.userPhoto,
        myUserName: userData.userName,
        friendsId: userViewing.docs[0].id,
        friendsPhoto: userViewingPhoto,
        friendsUserName: userViewing.docs[0].data().userName,
        lastMessage,
      }),
    });
    await updateDoc(userViewingRef, {
      chats: arrayUnion({
        chatId,
        myPhoto: userViewingPhoto,
        myUserName: userViewing.docs[0].data().userName,
        friendsId: param.userid,
        friendsPhoto: userData.userPhoto,
        friendsUserName: userData.userName,
        lastMessage: messageToSend,
      }),
    });
    await updateDoc(userViewingRef, {
      chats: arrayRemove({
        chatId,
        myPhoto: userViewingPhoto,
        myUserName: userViewing.docs[0].data().userName,
        friendsId: param.userid,
        friendsPhoto: userData.userPhoto,
        friendsUserName: userData.userName,
        lastMessage,
      }),
    });
  };

  return (
    <div className="messenger">
      <div className="friend-info">
        <img src={userData && userData.userPhoto} alt="friend" />
        <span>{userData && userData.userName}</span>
      </div>
      <div className="messages-container">
        {chat &&
          chat.map((message, index) =>
            message.sentBy === userViewingUserName ? (
              <div className="my-message-container message" key={index}>
                <div className="my-message">{message.message}</div>
                {index === chat.length - 1 && (
                  <div className="seen-status">
                    {seenBy === message.sentBy ? (
                      <div>Sent</div>
                      ) : (
                      <div>Seen</div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="friends-message-container message" key={index}>
                <div className="friends-message">{message.message}</div>
              </div>
            ),
          )}
      </div>
      <div className="send-message">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message..."
          type="text"
        />
        <span onClick={handleSend} className="send-button">
          Send
        </span>
      </div>
    </div>
  );
};

export default Messenger;
