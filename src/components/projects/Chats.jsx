import { useEffect, useState } from "react";
import Messenger from "./Messenger";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import MessageCircleIcon from "../../icons/MessageCircleIcon";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../config/firebase";

const Chats = () => {
  const { currentUser } = useAuth();
  const param = useParams();
  const { getUserByEmail } = useAuth();
  const [userName, setUserName] = useState();
  const [chats, setChats] = useState([]);
  const [userId, setUserId] = useState();
  const [loadingChats, setLoadingChats] = useState(true);

  useEffect(() => {
    try {
      if (userId && loadingChats) {
        const unsubscribe = onSnapshot(
          doc(db, "users", userId),
          async (document) => {
            const chatsRef = document.data()?.chats || [];
            const lastIndex = chatsRef.length - 1;
            const chatSnap = await getDoc(
              doc(db, "chats", chatsRef[lastIndex].chatId),
            );
            console.log(chats[lastIndex]);
            console.log(chatsRef[lastIndex]);
            if (
              lastIndex >= 0 &&
              !chats[lastIndex].chatId === chatsRef[lastIndex].chatId &&
              chatSnap.data().messages[0]
            ) {
              setChats((prevChat) => [...prevChat, chatsRef[lastIndex]]);
            }
          },
        );

        return () => unsubscribe();
      }
    } catch (err) {
      console.error(err);
    }
  }, [userId, chats, loadingChats]);

  const getUserByEmailInPost = async (email) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error("No matching documents for email:", email);
      return null;
    }
    const user = querySnapshot;
    return user;
  };

  useEffect(() => {
    try {
      const fetchUser = async () => {
        const user = await getUserByEmailInPost(currentUser.email);
        const userName = user.docs[0].data().userName;
        setUserId(user.docs[0].id);
        setUserName(userName);
        user.docs[0].data().chats.map(async (chat) => {
          const chatSnap = await getDoc(doc(db, "chats", chat.chatId));
          console.log(chatSnap.data());
          chatSnap.data()?.messages[0] &&
            setChats((prevChat) => [...prevChat, chat]);
        });
        setLoadingChats(false);
      };
      currentUser && fetchUser();
    } catch (err) {
      console.error(err);
    }
  }, [currentUser, getUserByEmail]);

  return (
    <ul className="dropdown-menu active chat-box">
      <div className="search-box chats-box">
        <h1 className="chats-heading">{userName}</h1>
        <span className="chats-span">Messages</span>
        <div className="chats">
          {chats &&
            chats.map((chat) => (
              <Link to={`/messenger/${chat.friendsId}`} className="chat">
                <img className="friends-photo" src={chat.friendsPhoto} alt="" />
                <div className="friends-info">
                  <span>{chat.friendsUserName}</span>
                  <span>last message</span>
                </div>
              </Link>
            ))}
        </div>
      </div>
      {param.userid ? (
        <Messenger user={param} />
      ) : (
        <div className="empty-messages">
          <MessageCircleIcon></MessageCircleIcon>
          <span>Your chats</span>
          <p>Send private chats to a friend</p>
          <button className="follow-button">Send message</button>
        </div>
      )}
    </ul>
  );
};

export default Chats;
