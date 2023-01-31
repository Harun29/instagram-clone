import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
// import { useSelector } from "react-redux";
import { addPost } from "../../store/reducers/postReducer";

const CreatePost = () => {
  
  const [title, setTitle] = useState('');
  // const [postPicture, setPostPicture] = useState('');
  const [description, setDescription] = useState('');
  // const  { posts } = useSelector((state) => state.post);

  const dispatch = useDispatch()

  const [newPost, setNewPost] = useState({
    title: title,
    description: description
  });

  useEffect(() => {
    setNewPost({
      title:title,
      description: description
    })
  }, [title, description])

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addPost(newPost));
  }

  return (  
    <form 
    className="create-post"
    onSubmit={handleSubmit}>
      <h4>Create post</h4>
      <div className="input-wrapper create-post-inputs">
        <label>Header</label>
        <input 
        type="text" 
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}/>
      </div>
      <div className="input-wrapper create-post-inputs">
        <textarea 
        id="description"
        required
        value={description}
        onChange={(e) => setDescription(e.target.value)}></textarea>
      </div>
      <input type="submit" value='post'/>
    </form>
  );
}

export default CreatePost;