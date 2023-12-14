import { useState, useContext, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import { addDoc, arrayUnion, collection } from "firebase/firestore";
import { db } from "../../config/firebase";
import { v4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { storage } from "../../config/firebase";
import { ref, uploadBytes } from "firebase/storage";
import PhotoIcon from "../../icons/PhotoIcon"

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [imgName, setImgName] = useState(null);
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageUpload, setImageUpload] = useState(null);

  const navigate = useNavigate();

  const { currentUser } = useContext(AuthContext);
  const { postsUpdate } = useContext(AuthContext);

  const addData = async (data) => {
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "posts"), data);
      await postsUpdate(currentUser.email, arrayUnion(docRef.id));
      console.log("Document written with ID: ", docRef.id);
      navigate("/");
    } catch (e) {
      console.error("Error adding document: ", e);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    const imageRef = ref(storage, `posts_pictures/${imgName}`);
    try {
      e.preventDefault();
      addData(post);
      await uploadBytes(imageRef, imageUpload);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      setImgName(e.target.files[0].name + v4());
      setImageUpload(e.target.files[0]);
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
      user: currentUser.email,
    });
  }, [title, description, imgName, currentUser]);

  useEffect(() => {
    console.log(post);
  }, [post]);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();

    const droppedFiles = e.dataTransfer.files;

    if (droppedFiles.length > 0) {
      const file = droppedFiles[0];
      setImgName(file.name + v4());
      setImageUpload(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setPhoto(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form
      className="create-post"
      onSubmit={handleSubmit}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="create-post-container">
        <h4 className="text-center">Create new post</h4>
        <div className="upload-photo">
          {!photo && 
          <div className="drag-info">
            <PhotoIcon></PhotoIcon>
            <p>Drag photos here</p>
          </div>}
          {!photo && (
            <div
              className="file-upload-container"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="photo"
                className="file-upload-input"
                accept="image/*"
                onChange={handlePhotoChange}
              />
              <label htmlFor="photo" className="file-upload-label">
                Select from computer
              </label>
            </div>
          )}
          {photo && 
          <div className="photo-preview">
            <img src={photo} alt="preview" />
          </div>
          }
        </div>
      </div>
      <p className="close-create">x</p>
    </form>
  );
};

export default CreatePost;
