import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import Spinner from 'react-bootstrap/Spinner';

const UpdateProfile = () => {

  const { currentUser } = useAuth();
  const { getUserByEmail } = useAuth();
  const { nameUpdate } = useAuth();
  const { userNameUpdate } = useAuth();
  const { emailUpdate } = useAuth();
  const { passwordUpdate } = useAuth();
  const [user, setUser] = useState();

  const [name, setName] = useState();
  const [userName, setUserName] = useState();
  const [email, setEmail] = useState();

  const [currentPassword, setCurrentPassword] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleChanges = async () => {
    setLoading(true)

    await nameUpdate(user.email, name)
    await userNameUpdate(user.email, userName)
    await emailUpdate(user.email, email)

    window.location.reload();
    setLoading(false)
  }

  const handlePasswordChange = async () => {
    if(currentPassword === user.password){
      // await passwordUpdate(password)
      // setLoading(false)
      console.log("match")
    }
  }

  useEffect(() => {
    console.log(user)
  }, [user])

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
    if(user){
      setName(user.name)
      setUserName(user.userName)
      setEmail(user.email)
    }
  },[user])

  useEffect(() => {
    console.log(name, userName, email)
  }, [name, userName, email])

  return user ? (
    <div className="settings-container d-flex justify-content-center align-items-start shadow p-3 mb-5 bg-white rounded">
      <div className="me-5">
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
          <input type="file" className="form-control" id="photo" />
        </div>
        <button disabled={loading} onClick={handleChanges} type="submit" className="btn btn-primary">
          Save Changes
        </button>
      </div>

      {/* PASSWORD CHANGE */}

      <div>
        <h4 className="mb-3">Change Password</h4>
        <div className="mb-3">
          <label htmlFor="currentPassword" className="form-label">
            Current Password
          </label>
          <input onChange={(e) => {setCurrentPassword(e.target.value)}} type="password" className="form-control" id="currentPassword" />
        </div>
        <div className="mb-3">
          <label htmlFor="newPassword" className="form-label">
            New Password
          </label>
          <input onChange={(e) => {setPassword(e.target.value)}} type="password" className="form-control" id="newPassword" />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmNewPassword" className="form-label">
            Confirm New Password
          </label>
          <input onChange={(e) => {setConfirmPassword(e.target.value)}} type="password" className="form-control" id="confirmNewPassword" />
        </div>
        <button onClick={handlePasswordChange} disabled={passwordLoading} type="submit" className="btn btn-primary">
          Change Password
        </button>
      </div>
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