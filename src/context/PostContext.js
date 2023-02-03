import { createContext, useState } from "react";

const PostContext = createContext();

export function PostsProvider({childer}) {

  const [posts, setPosts] = useState([]);

  const addToPosts = (header, description) => {
    setPosts((prevState) => [...prevState, {header, description}])
    console.log(posts);
  }

  return (
    <PostContext.Provider value={{posts, addToPosts}}>{childer}</PostContext.Provider>
  )
}

export default PostContext;