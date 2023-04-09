import { useState, useContext } from "react";
import PostContext from "../../context/PostContext";

const CreatePost = () => {
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const {addToPosts} = useContext(PostContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    addToPosts(title, description);
  };

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