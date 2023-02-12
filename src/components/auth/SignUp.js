import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { googleProvider } from "../../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { useAuth } from "../../context/AuthContext";
import { auth } from "../../config/firebase";
import { useNavigate } from "react-router-dom";


const SignUp = ({signupForm, setSignupForm}) => {

  // const [name, setName] = useState('')
  // const [userName, setUserName] = useState('')
  // const [age, setAge] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const {signup} = useAuth()
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword){
      return setError('Passwords do not match')
    }
    try{
      setError('');
      setLoading(true);
      await signup(email, password);
      navigate('/')
    } catch (err) {
      setLoading(false);
      setError('failed to create an accaunt')
      console.log(err);
    }

  };

  const signInWithGoogle = async (e) => {
    e.preventDefault();
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form 
    className="login-signup-form"
    onSubmit={handleSubmit}>
      
      {/* <div className="input-wrapper">
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
      </div> */}

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

      <div className="google-signin-wrapper">
        <button 
        className="google-signin-button" 
        onClick={signInWithGoogle}>Sign In With Google
        <FontAwesomeIcon icon={faGoogle} size='2x'></FontAwesomeIcon>
        </button>
      </div>

      <input disabled={loading} type="submit" name="" id="" value="Signup"/>
      <div className="close-button" onClick={() => setSignupForm(!signupForm)}>
        <FontAwesomeIcon icon={faClose}></FontAwesomeIcon>
      </div>

      {error && <p>{error}</p>}
    </form>
  );
}

export default SignUp;