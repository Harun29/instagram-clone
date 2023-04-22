import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner';

const UpdateProfile = () => {

  const { currentUser } = useAuth();
  const { getUserByEmail } = useAuth();
  const [user, setUser] = useState();

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

  // if(user){
  //   return (
  //     <div className="profile">
  //       <h5>Email: {user.email}
  //         <Link to="email-update" className="ms-3">Update</Link>
  //       </h5>
  //       <h5>Name: {user.name}
  //         <Link to="name-update" className="ms-3">Update</Link>
  //       </h5>
  //       <h5>Username: {user.userName}
  //         <Link to="username-update" className="ms-3">Update</Link>
  //       </h5>
  //       <h5>birth date: {user.age}
  //         <Link to="birthday-update" className="ms-3">Update</Link>
  //       </h5>
  //       <Link to="password-update" className="ms-3">Update password</Link>
  //     </div>
  //   );
  // } else {
  //   return(
  //     <div className="loading">Loading...</div>
  //   )
  // }
  
  return user ? (
    <div className="settings-container d-flex justify-content-center align-items-start shadow p-3 mb-5 bg-white rounded">
      <div className="me-5">
        <h3 className="mb-3">Settings</h3>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input type="text" className="form-control" id="name" defaultValue={user.name} />
        </div>
        <div className="mb-3">
          <label htmlFor="userName" className="form-label">
            Username
          </label>
          <input type="text" className="form-control" id="userName" defaultValue={user.userName} />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input type="email" className="form-control" id="email" defaultValue={user.email} />
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
        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
      </div>
      <div>
        <h4 className="mb-3">Change Password</h4>
        <div className="mb-3">
          <label htmlFor="currentPassword" className="form-label">
            Current Password
          </label>
          <input type="password" className="form-control" id="currentPassword" />
        </div>
        <div className="mb-3">
          <label htmlFor="newPassword" className="form-label">
            New Password
          </label>
          <input type="password" className="form-control" id="newPassword" />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmNewPassword" className="form-label">
            Confirm New Password
          </label>
          <input type="password" className="form-control" id="confirmNewPassword" />
        </div>
        <button type="submit" className="btn btn-primary">
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