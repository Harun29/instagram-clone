import { createContext, useState } from "react";

const PostContext = createContext();

export function PostsProvider({children}) {

  const [posts, setPosts] = useState([]);

  const addToPosts = (header, description) => {
    setPosts((prevState) => [...prevState, {header, description}]);
  }

  return (
    <PostContext.Provider value={{posts, addToPosts}}>
      {children}
    </PostContext.Provider>
  )
};

export default PostContext;




