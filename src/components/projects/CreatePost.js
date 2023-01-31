import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { createPost } from "../../store/actions/postActions";

const CreatePost = () => {
  
  const [title, setTitle] = useState('');
  // const [postPicture, setPostPicture] = useState('');
  const [description, setDescription] = useState('');

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
    createPost(newPost);
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

const mapDispatchToProps = (dispatch) => {
  return {
    createPost: (post) => dispatch(createPost(post))
  }
}

export default connect(null, mapDispatchToProps)(CreatePost);