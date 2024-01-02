import { useEffect, useState } from "react";
// import { faGoogle } from "@fortawesome/free-brands-svg-icons";
// import { googleProvider } from "../../config/firebase";
// import { signInWithPopup } from "firebase/auth";
// import { auth } from "../../config/firebase";

import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase"
import { Link } from "react-router-dom";

const SignUp = () => {

  const {currentUser} = useAuth();
  const [name, setName] = useState('')
  const [userName, setUserName] = useState('')
  // const [age, setAge] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [userNamesArray, setUserNamesArray] = useState([])
  const navigate = useNavigate()

  const { signup } = useAuth()

  const [user, setUser] = useState({})

  const addData = async (data) => {
    try {
      const docRef = await addDoc(collection(db, 'users'), data);
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }

  useEffect(() => {
    currentUser && navigate('/')
  }, [currentUser, navigate])

  useEffect(() => {
    const fetchUserNames = async () => {
      const users = await getDocs(collection(db, "users"))
      setUserNamesArray([])
      users.forEach(doc => {
        setUserNamesArray(userNames => [...userNames, doc.data().userName])
      })
    }
    try {
      fetchUserNames();
    } catch (err) {
      console.error(err)
    }
  }, [])


  useEffect(() => {
    setUser({
      email: email,
      name: name,
      userName: userName,
      // age: age,
      pphoto: '',
      bio: '',
      following: [],
      followers: [],
      posts: [],
      chats: [],
      saved: []
    });
  }, [email, name, userName])

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('Passwords do not match')
    }
    try {
      setError('');
      setLoading(true);
      await signup(email, password);
      await addData(user);
      navigate('/')
    } catch (err) {
      setLoading(false);
      setError('failed to create an accaunt')
      console.error(err);
    }
  };

  // const signInWithGoogle = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await signInWithPopup(auth, googleProvider);
  //     navigate('/');
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const handleUserNameChange = (e) => {
    const value = e.target.value;
    const replacedValue = value.replace(/\s/g, "_"); // Replace spaces with low lines (_)
    setUserName(replacedValue);
  };

  return (
    <div className="signup-container">
    <form
      className="form-container"
      onSubmit={handleSubmit}>

      <h1 className="brand-logo-on-signup" style={{ fontFamily: 'Oleo Script' }}>igclone</h1>
      <p>Signup to see photos from your friends.</p>

      <div className="form-outline">
        <input
          className="form-control"
          type="email"
          required
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div className="form-outline">
        <input
          className="form-control"
          type="text"
          required
          value={name}
          placeholder="Full Name"
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-outline">
        <input
          className={`form-control ${userNamesArray.includes(userName) ? 'invalid-input' : ''}`}
          type="text"
          required
          value={userName}
          placeholder="Username"
          onChange={handleUserNameChange}
        />
        {userNamesArray.includes(userName) && (
          <div className="error-message">This username is already taken</div>
        )}
      </div>

      {/* <div className="form-outline mb-4">
        <input
        className="form-control"
        type="date" 
        required
        value={age}
        placeholder="Date of birth"
        onChange={(e) => setAge(e.target.value)}
        />
      </div> */}

      <div className="form-outline">
        <input
          className="form-control"
          type="password"
          required
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)} />
      </div>

      <div className="form-outline">
        <input
          className="form-control"
          type="password"
          required
          value={confirmPassword}
          placeholder="Confirm Password"
          onChange={(e) => setConfirmPassword(e.target.value)} />
      </div>

      {/* <div className="google-signin-wrapper">
        <button 
        className="google-signin-button" 
        onClick={signInWithGoogle}>Sign In With Google
        <FontAwesomeIcon icon={faGoogle} size='2x'></FontAwesomeIcon>
        </button>
      </div> */}
      
      <input className="form-control signup-button" disabled={loading || userNamesArray.includes(userName)} type="submit" name="" id="" value="Sign up" />
      
      {error && <p className="login-error">{error}</p>}

    </form>
    <div className="form-container alt-login">
      <p>Have an account? <Link to="/login">Login</Link></p>
    </div>
    </div>
  );
}

export default SignUp;