import { useEffect, useState } from "react";
import Messenger from "./Messenger";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import MessageCircleIcon from "../../icons/MessageCircleIcon"

const Chats = () => {

  const { currentUser } = useAuth();
  const param = useParams();
  const { getUserByEmail } = useAuth();
  const [userName, setUserName] = useState();
  const [chats, setChats] = useState();


  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserByEmail(currentUser.email)
      const userName = user.userName;
      setUserName(userName);
      setChats(user.chats);
    }
    currentUser && fetchUser()
  }, [currentUser, getUserByEmail])

  return (
      <ul className="dropdown-menu active chat-box">
        <div className="search-box chats-box">
          <h1 className="messages-heading">
            {userName}
          </h1>
          <span className="messages-span">Messages</span>
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
        <span>Your messages</span>
        <p>Send private messages to a friend</p>
        <button className="follow-button">Send message</button>
      </div>}
      </ul>
  );
}

export default Chats;