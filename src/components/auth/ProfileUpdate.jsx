import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";

const EmailUpdate = () => {

  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const { currentUser } = useAuth()
  const [status, setStatus] = useState('')
  const {emailUpdate} = useAuth()
  const [loading, setLoading] = useState(false)


  // const [name, setName] = useState('')
  // const [userName, setUserName] = useState('')
  // const [age, setAge] = useState('')
  // const [password, setPassword] = useState('')
  // const [confirmPassword, setConfirmPassword] = useState('')
  // const { emailUpdate, passwordUpdate, nameUpdate, userNameUpdate, birthdayUpdate } = useAuth()
  
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

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (password !== confirmPassword){
  //     return setError('Passwords do not match')
  //   }

  //   const promises = []
  //   setLoading(true)
  //   setError('')

  //   if (email !== currentUser.email){
  //     promises.push(emailUpdate(email))
  //   }
  //   if (password) {
  //     promises.push(passwordUpdate(password))
  //   }
  //   if (name) {
  //     promises.push(nameUpdate(currentUser.email, name))
  //   }
  //   if (userName) {
  //     promises.push(userNameUpdate(currentUser.email, userName))
  //   }
  //   if (age) {
  //     promises.push(birthdayUpdate(currentUser.email, age))
  //   }

  //   Promise.all(promises).then(() => {
  //     navigate('/')
  //   }).catch((err) => {
  //     setError('Failed to update account')
  //     console.log(err)
  //   }).finally(() => {
  //     setLoading(false)
  //   })

  // };

  

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

      {/* <div className="input-wrapper">
        <label>Username: </label>
        <input 
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        />
      </div>

      <div className="input-wrapper">
        <label>Age: </label>
        <input 
        type="date"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        />
      </div>

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
      </div> */}

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

export default EmailUpdate;