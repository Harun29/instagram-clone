import PostSummary from "./PostSummary";

const PostsList = ({posts}) => {
  return (  
    <div className="posts-list">

      {posts && posts.map(post => {
        return(
          <PostSummary />
        )
      })}

    </div>
  );
}
 
export default PostsList;