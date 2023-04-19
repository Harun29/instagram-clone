import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const EmailUpdate = () => {

  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const { currentUser } = useAuth()
  const [status, setStatus] = useState('')
  const {emailUpdate} = useAuth()
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true)
    setError('')
    setStatus('')

    async function updateEmail(){
      if (email !== currentUser.email){
        try{
          await emailUpdate(currentUser.email, email);
          setStatus("Email updated!")
        }
        catch(err){
          setError("Failed to update email!")
          setStatus('')
          console.log('errorcina')
          console.log("error: ", err)
          setLoading(false)
        }
        finally{
          setLoading(false)
        }
      }
    }

    updateEmail();

  };

  return (
    <form 
    className="login-signup-form mt-3"
    onSubmit={handleSubmit}>
      
      <div className="input-wrapper">
        <input 
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <input disabled={loading} type="submit" name="" id="" value="Update"/>

      {error && <p>{error}</p>}
      {status && 
      <div>
        <p>
          {status}
        </p>
        <Link to="/">
          Back to home page
        </Link>
      </div>}
      
    </form>
  );
}

const PasswordUpdate = () => {

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const {passwordUpdate} = useAuth()
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true)
    setError('')
    setStatus('')

    async function updatePassword(){
      if (password === confirmPassword){
        try{
          await passwordUpdate(password);
          setStatus("Password updated!")
        }
        catch(err){
          setError("Failed to update password!")
          setStatus('')
          console.log('errorcina')
          console.log("error: ", err)
          setLoading(false)
        }
        finally{
          setLoading(false)
        }
      } else {
        setError("Passwords do not match!")
      }
    }

    updatePassword();

  };

  return (
    <form 
    className="login-signup-form mt-3"
    onSubmit={handleSubmit}>
      
      <div className="input-wrapper">
        <input 
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="input-wrapper">
        <input 
        type="password"
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <input disabled={loading} type="submit" name="" id="" value="Update"/>

      {error && <p>{error}</p>}
      {status && 
      <div>
        <p>
          {status}
        </p>
        <Link to="/">
          Back to home page
        </Link>
      </div>}
      
    </form>
  );
}

const NameUpdate = () => {

  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const {nameUpdate} = useAuth()
  const [loading, setLoading] = useState(false)
  const {currentUser} = useAuth();
  
  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true)
    setError('')
    setStatus('')

    async function updateName(){

      try{
        await nameUpdate(currentUser.email, name);
        setStatus("Name updated!")
      }
      catch(err){
        setError("Failed to update name!")
        setStatus('')
        console.log('errorcina')
        console.log("error: ", err)
        setLoading(false)
      }
      finally{
        setLoading(false)
      }
    }

    updateName();

    }

    return (
      <form 
      className="login-signup-form mt-3"
      onSubmit={handleSubmit}>
        
        <div className="input-wrapper">
          <input 
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          />
        </div>
  
        <input disabled={loading} type="submit" name="" id="" value="Update"/>
  
        {error && <p>{error}</p>}
        {status && 
        <div>
          <p>
            {status}
          </p>
          <Link to="/">
            Back to home page
          </Link>
        </div>}
        
      </form>
    );
}

const UserNameUpdate = () => {

  const [userName, setUserName] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const {userNameUpdate} = useAuth()
  const [loading, setLoading] = useState(false)
  const {currentUser} = useAuth();
  
  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true)
    setError('')
    setStatus('')

    async function updateUserName(){

      try{
        await userNameUpdate(currentUser.email, userName);
        setStatus("Username updated!")
      }
      catch(err){
        setError("Failed to update username!")
        setStatus('')
        console.log('errorcina')
        console.log("error: ", err)
        setLoading(false)
      }
      finally{
        setLoading(false)
      }
    }

    updateUserName();

    }

    return (
      <form 
      className="login-signup-form mt-3"
      onSubmit={handleSubmit}>
        
        <div className="input-wrapper">
          <input 
          type="text"
          required
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          />
        </div>
  
        <input disabled={loading} type="submit" name="" id="" value="Update"/>
  
        {error && <p>{error}</p>}
        {status && 
        <div>
          <p>
            {status}
          </p>
          <Link to="/">
            Back to home page
          </Link>
        </div>}
        
      </form>
    );
}

const BirthdayUpdate = () => {

  const [birthday, setBirthday] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const {birthdayUpdate} = useAuth()
  const [loading, setLoading] = useState(false)
  const {currentUser} = useAuth();
  
  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true)
    setError('')
    setStatus('')

    async function updateBirthday(){

      try{
        await birthdayUpdate(currentUser.email, birthday);
        setStatus("Birthday updated!")
      }
      catch(err){
        setError("Failed to update birthday!")
        setStatus('')
        console.log('errorcina')
        console.log("error: ", err)
        setLoading(false)
      }
      finally{
        setLoading(false)
      }
    }

    updateBirthday();

    }

    return (
      <form 
      className="login-signup-form mt-3"
      onSubmit={handleSubmit}>
        
        <div className="input-wrapper">
          <input 
          type="date"
          required
          value={birthday} 
          onChange={(e) => setBirthday(e.target.value)}
          />
        </div>
  
        <input disabled={loading} type="submit" name="" id="" value="Update"/>
  
        {error && <p>{error}</p>}
        {status && 
        <div>
          <p>
            {status}
          </p>
          <Link to="/">
            Back to home page
          </Link>
        </div>}
        
      </form>
    );
}

export {EmailUpdate, PasswordUpdate, NameUpdate, UserNameUpdate, BirthdayUpdate}