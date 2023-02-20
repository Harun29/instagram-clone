import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";


const UpdateProfile = () => {

  const [name, setName] = useState('')
  // const [userName, setUserName] = useState('')
  // const [age, setAge] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { currentUser, emailUpdate, passwordUpdate, nameUpdate } = useAuth()
  const navigate = useNavigate()
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword){
      return setError('Passwords do not match')
    }

    const promises = []
    setLoading(true)
    setError('')

    if (email !== currentUser.email){
      promises.push(emailUpdate(email))
    }
    if (password) {
      promises.push(passwordUpdate(password))
    }
    if (name) {
      promises.push(nameUpdate(currentUser.email, name))
    }

    Promise.all(promises).then(() => {
      navigate('/')
    }).catch((err) => {
      setError('Failed to update account')
      console.log(err)
    }).finally(() => {
      setLoading(false)
    })

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

      {/* <div className="input-wrapper">
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
        value={email}
        placeholder={currentUser.email}
        onChange={(e) => setEmail(e.target.value)}/>
      </div>

      <div className="input-wrapper">
        <label>New password: </label>
        <input 
        type="password"
        value={password}
        placeholder="leave blank to the same"
        onChange={(e) => setPassword(e.target.value)}/>
      </div>

      <div className="input-wrapper">
        <label>Confirm Password: </label>
        <input 
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}/>
      </div>

      <input disabled={loading} type="submit" name="" id="" value="Update"/>

      {error && <p>{error}</p>}
    </form>
  );
}

export default UpdateProfile;