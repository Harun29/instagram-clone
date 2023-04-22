import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import Spinner from 'react-bootstrap/Spinner';

const Profile = () => {

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

  return user ? (
    <div className="profile-container d-flex justify-content-center align-items-center shadow p-3 mb-5 bg-white rounded">
      <div className="d-flex flex-column align-items-center">
        <div className="mb-3">
          <img
            src={user.photo || 'https://via.placeholder.com/150'}
            alt="Profile"
            className="rounded-circle"
            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
          />
        </div>
        <h5 className="mb-3">{user.name}</h5>
        <div className="d-flex justify-content-center align-items-center">
          <div className="me-4">
            <strong>10</strong> posts
          </div>
          <div className="me-4">
            <strong>20</strong> followers
          </div>
          <div>
            <strong>30</strong> following
          </div>
        </div>
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
 
export default Profile;