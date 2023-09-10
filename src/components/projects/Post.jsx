import { useEffect } from "react";
import { useParams } from "react-router-dom";

const Post = () => {
  
  const param = useParams();

  useEffect(() => {
    console.log(param)
  },[param])
  
  return ( <></> );
}
 
export default Post;