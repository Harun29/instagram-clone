import PostSummary from "./PostSummary";
import { useContext } from "react";
import PostContext from "../../context/PostContext";

const PostsList = () => {

  const { posts } = useContext(PostContext);

  return (  
    <div className="posts-list">

      {posts && posts.map(post => {
        return(
          <PostSummary header={post.header} description={post.description}/>
        )
      })}

    </div>
  );
}
 
export default PostsList;