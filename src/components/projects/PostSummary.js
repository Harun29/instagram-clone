// import { PostsProvider } from "../../context/PostContext";
// import { useContext } from "react";

const PostSummary = () => {

  return (  
  <div className="post-summary">
    <h3>Naslov posta</h3>
    <div><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-Jcpp8c3cW4zOfy2Zwhd_XS-pHGdGxGt4Rp_mTCID&s" alt="" /></div>
    <div className="description">
      <h4>Username: </h4>
      <h5>Likes: </h5>
      <p>Opis posta</p>
    </div>
  </div>
  );
}
 
export default PostSummary;