import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import Spinner from 'react-bootstrap/Spinner';
import { storage } from "../../config/firebase";
import { v4 } from "uuid";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "firebase/storage";

const UpdateProfile = () => {

  const { currentUser } = useAuth();
  const { getUserByEmail } = useAuth();
  const { nameUpdate } = useAuth();
  const { userNameUpdate } = useAuth();
  const { emailUpdate } = useAuth();
  const { passwordUpdate } = useAuth();
  const { resetPassword } = useAuth();
  const { profilePhotoUpdate } = useAuth();
  const [user, setUser] = useState();

  const [name, setName] = useState();
  const [userName, setUserName] = useState();
  const [email, setEmail] = useState();
  
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(true);
  const [passwordUpdating, setPasswordUpdateing] = useState(false);
  const [confirmation, setConfirmation] = useState();
  
  const [imageUpload, setImageUpload] = useState(null);
  const [imgName, setImgName] = useState('')
  const [selectedImage, setSelectedImage] = useState(null);

  const [currentProfilePhoto, setCurrentProfilePhoto] = useState(null);
  const [currentPhotoName, setCurrentPhotoName] = useState();

  /* Changing profile picture */

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageUpload(file);
      setImgName(file.name + v4());
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const updatePhoto = async () => {
    try {
      if (imageUpload == null) return;
      const imageRef = ref(storage, `profile_pictures/${imgName}`);
      console.log(currentPhotoName)
      if(currentPhotoName){
        await deleteObject(ref(storage, 'profile_pictures/' + currentPhotoName))
      }
      await uploadBytes(imageRef, imageUpload);
      await profilePhotoUpdate(user.email, imgName)
    } catch (err){
      console.error('Error adding image: ', err);
    }
  };

  /* ----- */ 

  const handleChanges = async (e) => {
    e.preventDefault();
    setLoading(true)
    try{
      await nameUpdate(user.email, name);
      await userNameUpdate(user.email, userName);
      await emailUpdate(user.email, email);
      if(imageUpload){
        await updatePhoto();
      }
      window.location.reload();
    }catch(err){
      console.error(err)
    }finally{
      setLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    setPasswordUpdateing(true)
    try{
      await passwordUpdate(password)
      setPasswordUpdateing(false)
    }catch(err){
      console.error(err)
    }
  }

  const handlePasswordEmail = async (e) => {
    e.preventDefault();
    try{
      await resetPassword(user.email)
      setConfirmation(true)
    }catch(err){
      console.error(err)
    }
  }

  useEffect(() => {
    if ((confirmPassword === password) || !password || !confirmPassword){
      setPasswordLoading(false)
    }else{
      setPasswordLoading(true)
    }
  }, [confirmPassword, password])

  useEffect(() => {
    const fetchUserByEmail = async (email) => {
      const user = await getUserByEmail(email);
      setUser(user);
    }
    try{
      currentUser && fetchUserByEmail(currentUser.email)
    }
    catch(err){
      console.error(err)
    }
  }, [currentUser, getUserByEmail])

  useEffect(() => {
    const getLink = async() => {
      const url = await getDownloadURL(ref(storage, `profile_pictures/${user.pphoto}`));
      setCurrentProfilePhoto(url)
    }
    if(user){
      getLink();
      setName(user.name)
      setUserName(user.userName)
      setEmail(user.email)
      setCurrentPhotoName(user.pphoto)
    }
  }, [user, ])

  return user ? (
    <div className="settings-container d-flex justify-content-center align-items-start shadow p-3 mb-5 bg-white rounded">
      <form 
        className="me-5 profile-setting-form"
        onSubmit={handleChanges}>
        <h3 className="mb-3">Settings</h3>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input onChange={(e) => setName(e.target.value)} type="text" className="form-control" id="name" defaultValue={user.name} />
        </div>
        <div className="mb-3">
          <label htmlFor="userName" className="form-label">
            Username
          </label>
          <input onChange={(e) => setUserName(e.target.value)} type="text" className="form-control" id="userName" defaultValue={user.userName} />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input onChange={(e) => setEmail(e.target.value)} type="email" className="form-control" id="email" defaultValue={user.email} />
        </div>
        <div className="mb-3">
          <label htmlFor="bio" className="form-label">
            Bio
          </label>
          <textarea className="form-control" id="bio" rows="3" defaultValue={user.bio}></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="photo" className="form-label">
            Profile Photo
          </label>
          <input 
          type="file" 
          className="form-control" 
          id="photo"
          accept="image/*"
          onChange={handleImageChange} 
          />

          {selectedImage ?
           <img src={selectedImage} alt="Selected" className="profile-picture-settings mt-3"/>
          : <img src={currentProfilePhoto} alt="Selected" className="profile-picture-settings mt-3"/>}
          
        </div>
        <button disabled={loading} type="submit" className="btn btn-primary">
          Save Changes
        </button>
      </form>

      {/* PASSWORD CHANGE */}

      <form
      onSubmit={handlePasswordChange}>
        <h4 className="mb-3">Change Password</h4>
        <div className="mb-3">
          <label htmlFor="newPassword" className="form-label">
            New Password
          </label>
          <input required onChange={(e) => {setPassword(e.target.value)}} type="password" className="form-control" id="newPassword" />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmNewPassword" className="form-label">
            Confirm New Password
          </label>
          <input 
            required 
            onChange={(e) => {setConfirmPassword(e.target.value)}} 
            type="password"
            className={`form-control ${passwordLoading ? " is-invalid" : ""} ${confirmPassword && !passwordLoading ? " is-valid" : ""}`} 
            id="confirmNewPassword" />
        </div>
        {!confirmation ?
          <div className="text-center">
            <button onClick={handlePasswordEmail} className="btn btn-link mb-3">Send password reset email</button>
          </div> :
          <p className="d-flex align-items-center">Check your email. Dont see the email: 
            <button onClick={handlePasswordEmail} className="btn btn-link py-0">resend</button>
          </p>
        }
        <button disabled={passwordLoading || passwordUpdating} type="submit" className="btn btn-primary">
          Change Password
        </button>
      </form>
    </div>
  ) : (
    <div className="d-flex justify-content-center align-items-center">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
  
}
 
export default UpdateProfile;