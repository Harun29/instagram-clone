import { useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faGoogle } from "@fortawesome/free-brands-svg-icons";
// import { auth, googleProvider } from "../../config/firebase";
// import { signInWithPopup } from "firebase/auth";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const SignIn = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const {login} = useAuth();
  const navigate = useNavigate();

  // const signInWithGoogle = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await signInWithPopup(auth, googleProvider);
  //     navigate('/');
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  //a little commit comment
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
    <div className="signup-container">
    <form 
    className="form-container"
    onSubmit={handleSubmit}>
      <h1 className="brand-logo-on-signup" style={{ fontFamily: 'Oleo Script' }}>igclone</h1>
      <p>Sign in to see photos from your friends.</p>
    
      <div className="form-outline mb-4">
        <input 
        className="form-control"
        type="email"
        required
        value={email}
        placeholder="Email address"
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

      {/* <div className="google-signin-wrapper">
        <button 
        className="google-signin-button" 
        onClick={signInWithGoogle}>Sign In With Google
        <FontAwesomeIcon icon={faGoogle} size='2x'></FontAwesomeIcon>
        </button>
      </div> */}

      <input className="form-control signup-button" disabled={loading} type="submit" name="" id="" value="Login"/>
      
      <div className="mb-4">
        <Link to="/forgot-password">Forgot password?</Link>
      </div>


      {error && <p>{error}</p>}
    </form>
    <div className="form-container alt-login">
      <p>Not a member? <Link to="/signup">Register</Link></p>
    </div>
    </div>
  );
}

export default SignIn;