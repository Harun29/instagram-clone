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

  const { 
    currentUser, 
    getUserByEmail, 
    nameUpdate, 
    userNameUpdate, 
    emailUpdate, 
    passwordUpdate, 
    resetPassword, 
    profilePhotoUpdate, 
    bioUpdate, 
    birthdayUpdate } = useAuth();

  const [user, setUser] = useState();

  const [name, setName] = useState();
  const [userName, setUserName] = useState("");
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

  const [bio, setBio] = useState();

  const [birthday, setBirthday] = useState();

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

      // we check for current photo name in case the person does not have profile photo
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
      await bioUpdate(user.email, bio);
      await birthdayUpdate(user.email, birthday);
      /* we chack for imageUpload so it does not delete current photo every
      time we save changes */
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
      if(user.pphoto){
        const url = await getDownloadURL(ref(storage, `profile_pictures/${user.pphoto}`));
        setCurrentProfilePhoto(url)
      }
    }
    
    if(user){
      getLink();
      setName(user.name)
      setUserName(user.userName)
      setEmail(user.email)
      setCurrentPhotoName(user.pphoto)
      setBio(user.bio)
      setBirthday(user.age)
    }
  }, [user])

  const handleUserNameChange = (e) => {
    const value = e.target.value;
    const replacedValue = value.replace(/\s/g, "_"); // Replace spaces with low lines (_)
    setUserName(replacedValue);
  };

  return user ? (
    <div className="settings-container">
      <form 
        onSubmit={handleChanges}>

      <h2 className="edit-profile">Edit profile</h2>
        <div className="picture-update">
          <div>
            {selectedImage ?
            <img src={selectedImage} alt="Selected" className="profile-picture-settings"/>
            : <img src={currentProfilePhoto || "/blank-profile.jpg"} alt="Selected" className="profile-picture-settings"/>}
            
            <div className="picture-update-spans">
              <span>{userName}</span>
              <span>{name}</span>
            </div>
          </div>

          <button className="follow-button">Change photo</button>

          {/* <input 
          type="file" 
          className="form-control" 
          id="photo"
          accept="image/*"
          onChange={handleImageChange}
          /> */}

          
        </div>

        <div className="update-form">
          <label htmlFor="name">
            Name
          </label>
          <input onChange={(e) => setName(e.target.value)} type="text" id="name" defaultValue={user.name} />
        </div>

        <div className="update-form">
          <label htmlFor="userName">
            Username
          </label>
          <input onChange={handleUserNameChange} type="text" id="userName" value={userName}/>
        </div>

        <div className="update-form">
          <label htmlFor="email">
            Email
          </label>
          <input onChange={(e) => setEmail(e.target.value)} type="email" id="email" defaultValue={user.email} />
        </div>

        <div className="update-form">
          <label htmlFor="bio">
            Bio
          </label>
          <textarea onChange={(e) => setBio(e.target.value)} id="bio" rows="3" defaultValue={user.bio}></textarea>
        </div>

        <div className="update-form">
          <label htmlFor="bio">
            Birthday
          </label>
          <input type="date" onChange={(e) => setBirthday(e.target.value)} className="form-control" id="birthday" rows="3" defaultValue={user.age}></input>
        </div>

        <button className="update-submit" disabled={loading} type="submit">
          Submit
        </button>
      </form>

      {/* PASSWORD CHANGE */}

      <form
      onSubmit={handlePasswordChange}>
        <h2 className="edit-profile">Change Password</h2>

        <div className="update-form">
          <label htmlFor="newPassword">
            New Password
          </label>
          <input required onChange={(e) => {setPassword(e.target.value)}} type="password" id="newPassword" />
        </div>

        <div className="update-form">
          <label htmlFor="confirmNewPassword">
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
          <div>
            <button onClick={handlePasswordEmail} className="send-password-button follow-button">Send password reset email</button>
          </div> :
          <p className="resend-email">Check your email. Dont see the email? 
            <button onClick={handlePasswordEmail}>Resend</button>
          </p>
        }

        <button className="follow-button" disabled={passwordLoading || passwordUpdating} type="submit">
          Change Password
        </button>
      </form>
    </div>
  ) : (
    <div>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
  
}
 
export default UpdateProfile;