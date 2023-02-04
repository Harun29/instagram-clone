import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { auth, googleProvider } from "../../config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";

const SignUp = ({signupForm, setSignupForm}) => {

  const [name, setName] = useState('')
  const [userName, setUserName] = useState('')
  const [age, setAge] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (err) {
      console.error(err);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form 
    className="login-signup-form"
    onSubmit={handleSubmit}>
      
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
        <button onClick={signInWithGoogle}>Sign In With Google</button>
      </div>

      <input type="submit" name="" id="" value="Signup"/>
      <div className="close-button" onClick={() => setSignupForm(!signupForm)}>
        <FontAwesomeIcon icon={faClose}></FontAwesomeIcon>
      </div>
    </form>
  );
}

export default SignUp;