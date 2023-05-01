import { useEffect, useState } from "react";
// import { faGoogle } from "@fortawesome/free-brands-svg-icons";
// import { googleProvider } from "../../config/firebase";
// import { signInWithPopup } from "firebase/auth";
// import { auth } from "../../config/firebase";

import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../config/firebase"


const SignUp = () => {

  const [name, setName] = useState('')
  const [userName, setUserName] = useState('')
  const [age, setAge] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
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
    setUser({
      email: email,
      name: name,
      userName: userName,
      age: age
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

  return (
    <form onSubmit={handleSubmit}>
      
      <div className="input-wrapper">
        <label>Name: </label>
        <input 
        type="text" 
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="input-wrapper">
        <label>Username: </label>
        <input 
        type="text" 
        required
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        />
      </div>

      <div className="input-wrapper">
        <label>Age: </label>
        <input 
        type="date" 
        required
        value={age}
        onChange={(e) => setAge(e.target.value)}
        />
      </div>

      <div className="input-wrapper">
        <label>Email: </label>
        <input 
        type="email" 
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}/>
      </div>

      <div className="input-wrapper">
        <label>Password: </label>
        <input 
        type="password" 
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}/>
      </div>

      <div className="input-wrapper">
        <label>Confirm Password: </label>
        <input 
        type="password" 
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}/>
      </div>

      {/* <div className="google-signin-wrapper">
        <button 
        className="google-signin-button" 
        onClick={signInWithGoogle}>Sign In With Google
        <FontAwesomeIcon icon={faGoogle} size='2x'></FontAwesomeIcon>
        </button>
      </div> */}

      <input disabled={loading} type="submit" name="" id="" value="Signup"/>

      {error && <p>{error}</p>}
    </form>
  );
}

export default SignUp;