import { useState } from "react";

const SignIn = ({loginForm, setLoginForm}) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form 
    className="login-signup-form">

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

      <input type="submit" name="" id="" value="Login"/>
      <div className="close-button" onClick={() => setLoginForm(!loginForm)}>X</div>
    </form>
  );
}

export default SignIn;