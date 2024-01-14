import { useAuth } from "../../context/AuthContext";
import { useEffect, useRef, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import { storage } from "../../config/firebase";
import { v4 } from "uuid";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { motion, AnimatePresence } from "framer-motion";

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
    birthdayUpdate,
  } = useAuth();

  const [user, setUser] = useState();

  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [initialName, setInitialName] = useState("");
  const [initialUserName, setInitialUserName] = useState("");
  const [email, setEmail] = useState();

  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  // const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(true);
  const [passwordUpdating, setPasswordUpdateing] = useState(false);
  const [confirmation, setConfirmation] = useState();

  const [imageUpload, setImageUpload] = useState(null);
  const [imgName, setImgName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const [currentProfilePhoto, setCurrentProfilePhoto] = useState(null);
  const [currentPhotoName, setCurrentPhotoName] = useState();

  const [bio, setBio] = useState();

  const [birthday, setBirthday] = useState();

  const [changePhoto, setChangePhoto] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const changePhotoRef = useRef(null)

  /* Changing profile picture */

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickInsidePost =
        changePhotoRef.current && changePhotoRef.current.contains(event.target);

      if (!isClickInsidePost && !buttonClicked) {
        setChangePhoto(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [changePhoto, buttonClicked]);

  useEffect(() => {
    changePhoto && setButtonClicked(false);
  }, [changePhoto]);

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
      console.log("Before uploadBytes 1");
      if (imageUpload == null) return;
  
      const imageRef = ref(storage, `profile_pictures/${imgName}`); // Specify the file path
  
      // Check for the current photo name in case the person does not have a profile photo
      if (currentPhotoName) {
        await deleteObject(ref(storage, `profile_pictures/${currentPhotoName}`));
      }
  
      console.log("Before uploadBytes");
      await uploadBytes(imageRef, imageUpload);
      console.log("Before profilePhotoUpdate");
      await profilePhotoUpdate(user.email, imgName);
      console.log("After profilePhotoUpdate");
    } catch (err) {
      console.error("Error adding image: ", err);
    }
  };
  
  

  /* ----- */

  const handleChanges = async (e) => {
    e.preventDefault();
    try {
      name && await nameUpdate(user.email, name);
      userName && await userNameUpdate(user.email, userName);
      email && await emailUpdate(user.email, email);
      bio && await bioUpdate(user.email, bio);
      birthday && await birthdayUpdate(user.email, birthday);
      imageUpload && await updatePhoto();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordUpdateing(true);
    try {
      await passwordUpdate(password);
      setPasswordUpdateing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePasswordEmail = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(user.email);
      setConfirmation(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (confirmPassword === password || !password || !confirmPassword) {
      setPasswordLoading(false);
    } else {
      setPasswordLoading(true);
    }
  }, [confirmPassword, password]);

  useEffect(() => {
    const fetchUserByEmail = async (email) => {
      const user = await getUserByEmail(email);
      setUser(user);
    };
    try {
      currentUser && fetchUserByEmail(currentUser.email);
    } catch (err) {
      console.error(err);
    }
  }, [currentUser, getUserByEmail]);

  useEffect(() => {
    const getLink = async () => {
      if (user.pphoto) {
        const url = await getDownloadURL(
          ref(storage, `profile_pictures/${user.pphoto}`),
        );
        setCurrentProfilePhoto(url);
      }
    };

    if (user) {
      getLink();
      setName(user.name);
      setUserName(user.userName);
      setEmail(user.email);
      setCurrentPhotoName(user.pphoto);
      setBio(user.bio);
      setBirthday(user.age);
      setInitialName(user.name);
      setInitialUserName(user.userName);
    }
  }, [user]);

  const handleUserNameChange = (e) => {
    const value = e.target.value;
    const replacedValue = value.replace(/\s/g, "_"); // Replace spaces with low lines (_)
    setUserName(replacedValue);
  };

  const handleChangePhoto = () => {
    setButtonClicked(true)
    setChangePhoto(!changePhoto)
  }

  useEffect(() => {
    imageUpload && console.log(imageUpload)
  }, [imageUpload])

  return user ? (
    <div className="settings-container">
      <form onSubmit={handleChanges}>
        <h2 className="edit-profile">Edit profile</h2>
        <div className="picture-update">
          <div>
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Selected"
                className="profile-picture-settings"
              />
            ) : (
              <img
                src={currentProfilePhoto || "/blank-profile.jpg"}
                alt="Selected"
                className="profile-picture-settings"
              />
            )}

            <div className="picture-update-spans">
              <span>{initialUserName}</span>
              <span>{initialName}</span>
            </div>
          </div>

          <button onClick={handleChangePhoto} className="follow-button">
            Change photo
          </button>

          {changePhoto && (
            <AnimatePresence>
            <motion.div initial={{scale: 1.1, opacity: 0}} animate={{scale: 1, opacity: 1}} className="new-message-background">
              <div ref={changePhotoRef} className="change-photo-container">
                <div>Changle Profile Photo</div>
                <label htmlFor="photo">
                <input
                  type="file"
                  className="form-control"
                  id="photo"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                Upload Photo
                </label>
                <div onClick={handleChangePhoto}>Cancel</div>
              </div>
            </motion.div>
            </AnimatePresence>
          )}
        </div>

        <div className="update-form">
          <label htmlFor="name">Name</label>
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            id="name"
            defaultValue={user.name}
          />
        </div>

        <div className="update-form">
          <label htmlFor="userName">Username</label>
          <input
            onChange={handleUserNameChange}
            type="text"
            id="userName"
            value={userName}
          />
        </div>

        <div className="update-form">
          <label htmlFor="email">Email</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            id="email"
            defaultValue={user.email}
          />
        </div>

        <div className="update-form">
          <label htmlFor="bio">Bio</label>
          <textarea
            onChange={(e) => setBio(e.target.value)}
            id="bio"
            rows="3"
            defaultValue={user.bio}
          ></textarea>
        </div>

        <div className="update-form">
          <label htmlFor="bio">Birthday</label>
          <input
            type="date"
            onChange={(e) => setBirthday(e.target.value)}
            className="form-control"
            id="birthday"
            rows="3"
            defaultValue={user.age}
          ></input>
        </div>

        <button className="update-submit" type="submit">
          Submit
        </button>
      </form>

      {/* PASSWORD CHANGE */}

      <form onSubmit={handlePasswordChange}>
        <h2 className="edit-profile">Change Password</h2>

        <div className="update-form">
          <label htmlFor="newPassword">New Password</label>
          <input
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            id="newPassword"
          />
        </div>

        <div className="update-form">
          <label htmlFor="confirmNewPassword">Confirm New Password</label>
          <input
            required
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            type="password"
            className={`form-control ${passwordLoading ? " is-invalid" : ""} ${
              confirmPassword && !passwordLoading ? " is-valid" : ""
            }`}
            id="confirmNewPassword"
          />
        </div>

        {!confirmation ? (
          <div>
            <button
              onClick={handlePasswordEmail}
              className="send-password-button follow-button"
            >
              Send password reset email
            </button>
          </div>
        ) : (
          <p className="resend-email">
            Check your email. Dont see the email?
            <button onClick={handlePasswordEmail}>Resend</button>
          </p>
        )}

        <button
          className="follow-button"
          disabled={passwordLoading || passwordUpdating}
          type="submit"
        >
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
};

export default UpdateProfile;
