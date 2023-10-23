import { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { getDownloadURL } from "firebase/storage";
import { storage } from "../../config/firebase";
import { ref } from "firebase/storage";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Home = () => {

const [posts, setPosts] = useState()
const {getUserByEmail} = useAuth()

useEffect(() => {
  const fetchPosts = async () => {
    const postsRef = collection(db, "posts");
    const snapshot = await getDocs(postsRef);

    const postsData = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const user = await getUserByEmail(doc.data().user)
        const nick = user.userName
        const photoUrl = await getDownloadURL(
          ref(storage, `posts_pictures/${doc.data().photo}`)
        );

        return {
          id: doc.id,
          title: doc.data().title,
          photo: photoUrl,
          user: nick,
        };
      })
    );

    setPosts(postsData);
  };

  fetchPosts();
}, [getUserByEmail]);

useEffect(() => {
  console.log(posts)
}, [posts])


return (
  <div className="home container">
    <div className="row">
      {posts ? posts.map((post) => (
        <div key={post.id} className="col-md-4 mb-4">
          <div className="card">
            <Link to={`/post/${post.id}`}>
            <img
              src={post.photo}
              className="card-img-top"
              alt="Post"
            />
            </Link>
            <div className="card-body">
              <h5 className="card-title">{post.title}</h5>
              <p className="card-text">User:
              <Link className="ms-3" to={`/user/${post.user}`}>
                {post.user}
              </Link> 
              </p>
            </div>
          </div>
        </div>
      )) : 
      <div>
      Loading...  
      </div>}
    </div>
  </div>
);
}
 
export default Home;



