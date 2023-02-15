import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { auth, googleProvider } from "../../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const SignIn = ({loginForm, setLoginForm}) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const {login} = useAuth();
  const navigate = useNavigate();

  const signInWithGoogle = async (e) => {
    e.preventDefault();
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (err) {
      setLoading(false);
      setError('Failed to login')
      console.log(err);
    }

  };

  return (
    <form 
    className="login-signup-form"
    onSubmit={handleSubmit}>
    
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

      <div className="google-signin-wrapper">
        <button 
        className="google-signin-button" 
        onClick={signInWithGoogle}>Sign In With Google
        <FontAwesomeIcon icon={faGoogle} size='2x'></FontAwesomeIcon>
        </button>
      </div>

      <input disabled={loading} type="submit" name="" id="" value="Login"/>

      <div className="forgot-password-label">
        <Link to="/forgot-password">Forgot password?</Link>
      </div>

      {error && <p>{error}</p>}
      <div className="close-button" onClick={() => setLoginForm(!loginForm)}>
        <FontAwesomeIcon icon={faClose}></FontAwesomeIcon>
      </div>
    </form>
  );
}

export default SignIn;