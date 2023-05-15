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

  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(true);
  const [passwordUpdating, setPasswordUpdateing] = useState(false);

  const handleChanges = async () => {
    setLoading(true)
    try{
      await nameUpdate(user.email, name)
      await userNameUpdate(user.email, userName)
      await emailUpdate(user.email, email)
      // window.location.reload();
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
      <form 
        className="me-5"
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
          <input type="file" className="form-control" id="photo" />
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