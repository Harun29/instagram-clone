import { useState, useContext, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import { addDoc, arrayUnion, collection } from "firebase/firestore";
import { db } from "../../config/firebase";
import { v4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { storage } from "../../config/firebase";
import { ref, uploadBytes } from "firebase/storage";

const CreatePost = () => {
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [imgName, setImgName] = useState(null);
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageUpload, setImageUpload] = useState(null);

  const navigate = useNavigate()

  const {currentUser} = useContext(AuthContext);
  const {postsUpdate} = useContext(AuthContext);

  const addData = async (data) => {
    setLoading(true)
    try {
      const docRef = await addDoc(collection(db, 'posts'), data);
      await postsUpdate(currentUser.email, arrayUnion(docRef.id));
      console.log('Document written with ID: ', docRef.id);
      navigate('/')
    } catch (e) {
      console.error('Error adding document: ', e);
      setLoading(false)
    } finally {
    }
  }

  const handleSubmit = async (e) => {
    const imageRef = ref(storage, `posts_pictures/${imgName}`);
    try{
      e.preventDefault();
      addData(post)
      await uploadBytes(imageRef, imageUpload);
    }catch(err){
      console.error(err)
    }
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      setImgName(e.target.files[0].name + v4());
      setImageUpload(e.target.files[0])
      reader.onload = (e) => {
        setPhoto(e.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  useEffect(() => {
    setPost({
      title: title,
      description: description,
      photo: imgName,
      user: currentUser.email
    })
  }, [title, description, imgName, currentUser])

  useEffect(() => {
    console.log(post)
  }, [post])

  return (
    <form 
    className="create-post container mb-4"
    onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h4 className="text-center">Create post</h4>
          <div className="form-group">
            <label htmlFor="title">Header</label>
            <input 
              type="text" 
              className="form-control"
              id="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}/>
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea 
              id="description"
              className="form-control"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}></textarea>
          </div>
          <div className="form-group mb-3">
            <label htmlFor="photo">Upload photo</label>
            <div className="input-group">
              <input 
                type="file" 
                className="form-control-file"
                id="photo"
                accept="image/*"
                onChange={handlePhotoChange}/>
              {photo && (
                <div className="input-group-prepend">
                  <div className="photo-preview">
                    <img src={photo} alt="preview" />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="text-center">
            <button disabled={loading} type="submit" className="btn btn-primary btn-instagram">Post</button>
          </div>
        </div>
      </div>
    </form>

  );

}

export default CreatePost;