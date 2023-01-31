import PostsList from "../projects/PostsList";
import { useSelector } from "react-redux";

const Home = () => {

  const { posts } = useSelector((state) => state.post)
  console.log(posts);

  return (  
    <div className="home">
      <PostsList posts={ posts }/>
    </div>
  );
}
 
export default Home;



