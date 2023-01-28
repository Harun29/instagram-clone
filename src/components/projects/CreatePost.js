import { useEffect, useState } from "react";

const CreatePost = () => {
  
  const [title, setTitle] = useState('');
  // const [postPicture, setPostPicture] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    console.log(title, description)
  }, [title]);

  return (  
    <form>
      <h4>Create post</h4>
      <div className="input-wrapper">
        <label>Header</label>
        <input 
        type="text" 
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}/>
      </div>
      <div className="input-wrapper">
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