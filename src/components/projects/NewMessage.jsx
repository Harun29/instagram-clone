import { useState, useEffect } from "react";
import { query, collection, or, where, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../config/firebase";
import { Link } from "react-router-dom";

const NewMessage = ({newMessageRef}) => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const fetchUsers = async (input) => {
      const q = query(
        collection(db, "users"),
        or(where("name", "==", input), or(where("userName", "==", input))),
      );
      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
          const newDocument = doc.data();
          let imgUrl = 'blank-profile.jpg'
          if(doc.data().pphoto){
            imgUrl = await getDownloadURL(
              ref(storage, `profile_pictures/${doc.data().pphoto}`),
            );
          }
          newDocument.pphoto = imgUrl;
          newDocument.userId = doc.id;
          let found = false;
          searchResults.forEach((result) => {
            if (result.userName === doc.data().userName) {
              found = true;
            }
          });
          !found &&
            setSearchResults((prevResults) => [...prevResults, newDocument]);
        });
      } catch (err) {
        console.error(err);
      }
    };
    try {
      fetchUsers(searchInput);
    } catch (err) {
      console.error(err);
    }
  }, [searchInput, searchResults]);

  useEffect(() => {
    console.log(searchResults)
  }, [searchResults])

  return (
    <div className="new-message-background">
      <div ref={newMessageRef} className="new-message">
        <div className="new-message-span">
          <span>New Message</span>
        </div>
        <div className="new-message-to">
          <label>To:</label>
          <input
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search"
            className="search-input"
            type="text"
          />
        </div>
        {searchResults.length > 0 && (
          <div className="search-result in-chat">
            {searchResults.map((result, index) => (
              <div>
                <Link
                  to={`/user/${result.userName}`}
                  key={index}
                  className="result-box in-chat"
                >
                  <img src={result.pphoto} alt="" />
                  <div className="result-names in-chat">
                    <span>{result.userName}</span>
                    <span>{result.name}</span>
                  </div>
                </Link>
                <Link to={`/messenger/${result.userId}`}>
                  <button className="follow-button">Chat</button>
                </Link>
              </div>
            ))}
          </div>
        )}
        {searchResults.length === 0 && (
          <div className="no-results">
            <span>No accounts found.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewMessage;
