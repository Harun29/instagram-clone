import { useParams } from "react-router-dom";

const PostDetails = () => {
  
  const params = useParams();

  return (  
    <div className="post-details">
      
      <div className="card">
        <h1 className="post-title">Post title - {params.id}</h1>
        <div className="card-image-container">
          <img src="" alt="" />
        </div>
        <div className="card-content">
          <span className="card-title"></span>
          <p className="about"></p>
        </div>
      </div>

      <div className="post-author-details-and-likes">
        <h4 className="author">author</h4>
        <h4 className="number-of-likes">likes</h4>
      </div>
    </div>
  );
}
 
export default PostDetails;