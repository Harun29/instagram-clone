import { useEffect, useState, useRef } from "react";
import Messenger from "./Messenger";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import MessageCircleIcon from "../../icons/MessageCircleIcon";
import MessageCirclePlusIcon from "../../icons/MessageCirclePlus";
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
import NewMessage from "./NewMessage";

const Chats = () => {
  const { currentUser } = useAuth();
  const param = useParams();
  const { getUserByEmail } = useAuth();
  const [userName, setUserName] = useState();
  const [chats, setChats] = useState([]);
  const [userId, setUserId] = useState();
  const [loadingChats, setLoadingChats] = useState(true);
  const [newMessage, setNewMessage] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const newMessageRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickInsidePost =
        newMessageRef.current && newMessageRef.current.contains(event.target);

      if (!isClickInsidePost && !buttonClicked) {
        setNewMessage(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [newMessage, buttonClicked]);

  useEffect(() => {
    newMessage && setButtonClicked(false);
  }, [newMessage]);

  // useEffect(() => {
  //   try {
  //     if (userId && !loadingChats) {
  //       const unsubscribe = onSnapshot(
  //         doc(db, "users", userId),
  //         async (document) => {
  //           const chatsRef = document.data()?.chats || [];
  //           const lastIndex = chatsRef.length - 1;
  //           console.log(chats[lastIndex].chatId)
  //           console.log(chatsRef[lastIndex].chatId)
  //           const chatSnap = await getDoc(
  //             doc(db, "chats", chatsRef[lastIndex].chatId),
  //           );
  //           if (
  //             lastIndex >= 0 &&
  //             chats[lastIndex].chatId !== chatsRef[lastIndex].chatId &&
  //             chatSnap.data().messages[0]
  //           ) {
  //             setChats((prevChat) => [chatsRef[lastIndex], ...prevChat]);
  //           }
  //         },
  //       );

  //       return () => unsubscribe();
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }, [userId, loadingChats]);

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
      if (chats) {
        const unsub = onSnapshot(doc(db, "users", userId), (user) => {
          setChats(user.data()?.chats.reverse());
        });
        return () => unsub();
      }
    } catch (err) {
      console.error(err);
    }
  }, [userId]);

  useEffect(() => {
    setChats([]);
    try {
      const fetchUser = async () => {
        const user = await getUserByEmailInPost(currentUser.email);
        const userName = user.docs[0].data().userName;
        setUserId(user.docs[0].id);
        setUserName(userName);
        Promise.all(
          user.docs[0].data().chats.map(async (chat) => {
            const object = chat;
            const chatSnap = await getDoc(doc(db, "chats", chat.chatId));
            console.log(chatSnap.data());
              // if (chatSnap.data().seenBy === userName) {
              //   object.seen = true;
              // } else {
              //   object.seen = false;
              // }
            console.log(object);
            chatSnap.data()?.messages[0] &&
              setChats((prevChat) => [object, ...prevChat]);
          })
        );
      };
      currentUser && fetchUser();
      setLoadingChats(false);
    } catch (err) {
      console.error(err);
    }
  }, [currentUser, getUserByEmail]);

  const handleNewMessage = () => {
    setButtonClicked(true);
    setNewMessage(true);
  };

  useEffect(() => {
    chats && console.log(chats);
  }, [chats]);

  return (
    <ul
      className={`dropdown-menu active chat-box ${
        newMessage && "new-message-z-index"
      }`}
    >
      {newMessage && <NewMessage newMessageRef={newMessageRef} />}
      <div className="search-box chats-box">
        <h1 className="chats-heading">
          <span>{userName}</span>
          <button onClick={handleNewMessage}>
            <MessageCirclePlusIcon />
          </button>
        </h1>
        <span className="chats-span">Messages</span>
        {chats.length > 0 && (
          <div className="chats">
            {chats.map((chat) => (
              <Link
                to={`/messenger/${chat.friendsId}`}
                className={`chat`}
              >
                <img className="friends-photo" src={chat.friendsPhoto} alt="" />
                <div className="friends-info">
                  <span>{chat.friendsUserName}</span>
                  <span>{chat.lastMessage}</span>
                </div>
                {/* {!chat.seen && <div className="not-seen-dot"></div>} */}
              </Link>
            ))}
          </div>
        )}
        {chats.length === 0 && (
          <div className="empty-chats">
            <span>No messages found.</span>
          </div>
        )}
      </div>
      {param.userid ? (
        <Messenger user={param} />
      ) : (
        <div className="empty-messages">
          <MessageCircleIcon></MessageCircleIcon>
          <span>Your chats</span>
          <p>Send private chats to a friend</p>
          <button onClick={handleNewMessage} className="follow-button">
            Send message
          </button>
        </div>
      )}
    </ul>
  );
};

export default Chats;
