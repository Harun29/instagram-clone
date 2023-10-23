import { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { collection, getDocs } from "firebase/firestore";

const Home = () => {

const [posts, setPosts] = useState()

useEffect(() => {
  const fetchPosts = async () => {
    const postsRef = collection(db, "posts");
    const snapshot = await getDocs(postsRef);

    const postsIds = []
    snapshot.forEach((doc) => {
      postsIds.push({
        id: doc.id,
        title: doc.data().title,
        photo: doc.data().photo,
        user: doc.data().user
      })
    })
    setPosts(postsIds)
  }
  fetchPosts()
}, [])

useEffect(() => {
  console.log(posts)
}, [posts])


return (
  <div className="home container">
    <div className="row">
      {posts ? posts.map((post) => (
        <div key={post.id} className="col-md-4 mb-4">
          <div className="card">
            {/* Assuming `photo`, `user`, and `title` are properties of the `data` object */}
            <img
              src={post.photo}
              className="card-img-top"
              alt="Post"
            />
            <div className="card-body">
              <h5 className="card-title">{post.title}</h5>
              <p className="card-text">User: {post.user}</p>
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



