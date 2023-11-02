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

  const [name, setName] = useState('')
  const [userName, setUserName] = useState('')
  const [age, setAge] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [userNamesArray, setUserNamesArray] = useState([])
  const navigate = useNavigate()

  const {signup} = useAuth()
  
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
    const fetchUserNames = async() => {
      const users = await getDocs(collection(db, "users"))
      setUserNamesArray([])
      users.forEach(doc => {
        setUserNamesArray(userNames => [...userNames, doc.data().userName])
      })
    }
    try{
      fetchUserNames();
    }catch(err){
      console.error(err)
    }
  }, [])


  useEffect(() => {
    setUser({
      email: email,
      name: name,
      userName: userName,
      age: age,
      pphoto: '',
      bio: '',
      following: [],
      followers: [],
      posts: []
    });
  }, [email, name, userName, age])

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword){
      return setError('Passwords do not match')
    }
    try{
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
    <form
    className="form-container w-25 ms-auto me-auto mb-auto mt-5 col-10 col-md-8 col-lg-6" 
    onSubmit={handleSubmit}>
      
      <div className="form-outline mb-4">
        <input
        className="form-control"
        type="text" 
        required
        value={name}
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-outline mb-4">
        <input
        className="form-control" 
        type="text" 
        required
        value={userName}
        placeholder="User name"
        onChange={handleUserNameChange}
        />
      </div>

      <div className="form-outline mb-4">
        <input
        className="form-control"
        type="date" 
        required
        value={age}
        placeholder="Date of birth"
        onChange={(e) => setAge(e.target.value)}
        />
      </div>

      <div className="form-outline mb-4">
        <input
        className="form-control"
        type="email" 
        required
        value={email}
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}/>
      </div>

      <div className="form-outline mb-4">
        <input
        className="form-control"
        type="password" 
        required
        value={password}
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}/>
      </div>

      <div className="form-outline mb-4">
        <input
        className="form-control"
        type="password" 
        required
        value={confirmPassword}
        placeholder="Confirm password"
        onChange={(e) => setConfirmPassword(e.target.value)}/>
      </div>

      {/* <div className="google-signin-wrapper">
        <button 
        className="google-signin-button" 
        onClick={signInWithGoogle}>Sign In With Google
        <FontAwesomeIcon icon={faGoogle} size='2x'></FontAwesomeIcon>
        </button>
      </div> */}

      <input className="btn btn-primary btn-block mb-4" disabled={loading || userNamesArray.includes(userName)} type="submit" name="" id="" value="Signup"/>

      <div className="text-center">
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>

      {error && <p>{error}</p>}
    </form>
  );
}

export default SignUp;