import { useEffect, useState } from "react";
import Messenger from "./Messenger";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import MessageCircleIcon from "../../icons/MessageCircleIcon"
import { doc, getDoc, collection, query, where, getDocs, updateDoc, arrayUnion, setDoc, onSnapshot } from "firebase/firestore";
import { db, storage } from "../../config/firebase";

const Chats = () => {

  const { currentUser } = useAuth();
  const param = useParams();
  const { getUserByEmail } = useAuth();
  const [userName, setUserName] = useState();
  const [chats, setChats] = useState();
  const [userId, setUserId] = useState();

  
  useEffect(() => {
    try{
      if (userId) {
        const unsubscribe = onSnapshot(doc(db, 'users', userId), (doc) => {
          const chatsRef = doc.data()?.chats || [];
          const lastIndex = chatsRef.length - 1;
          if (lastIndex >= 0 && !chats[lastIndex].chatId === chatsRef[lastIndex].chatId) {
            setChats((prevChat) => [...prevChat, chatsRef[lastIndex]]);
          }
        });
  
        return () => unsubscribe();
      }
    }catch(err){
      console.error(err);
    }
  }, [userId]);

  const getUserByEmailInPost = async (email) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
  
    if (querySnapshot.empty) {
      console.error('No matching documents for email:', email);
      return null;
    }
    const user = querySnapshot;
    return user;
  }

  useEffect(() => {
    try{
      const fetchUser = async () => {
        const user = await getUserByEmailInPost(currentUser.email)
        const userName = user.docs[0].data().userName;
        setUserId(user.docs[0].id)
        setUserName(userName);
        setChats(user.docs[0].data().chats);
      }
      currentUser && fetchUser()
    }catch(err){
      console.error(err)
    }
  }, [currentUser, getUserByEmail])

  return (
      <ul className="dropdown-menu active chat-box">
        <div className="search-box chats-box">
          <h1 className="chats-heading">
            {userName}
          </h1>
          <span className="chats-span">Messages</span>
          <div className="chats">
            {chats && chats.map(chat => (
              <Link to={chat.friendsId} className="chat">
                <img className="friends-photo" src={chat.friendsPhoto} alt="" />
                <div className="friends-info">
                  <span>{chat.friendsUserName}</span>
                  <span>last message</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      {param.userid ? <Messenger user={param} />:
      <div className="empty-messages">
        <MessageCircleIcon></MessageCircleIcon>
        <span>Your chats</span>
        <p>Send private chats to a friend</p>
        <button className="follow-button">Send message</button>
      </div>}
      </ul>
  );
}

export default Chats;