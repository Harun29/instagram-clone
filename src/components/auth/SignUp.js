const SignUp = ({signupForm, setSignupForm}) => {

  return (
    <form className="login-signup-form">
      
      <div className="input-wrapper">
        <label>Name: </label>
        <input type="text" />
      </div>

      <div className="input-wrapper">
        <label>Username: </label>
        <input type="text" />
      </div>

      <div className="input-wrapper">
        <label>Age: </label>
        <input type="date" />
      </div>

      <div className="input-wrapper">
        <label>Email: </label>
        <input type="email" />
      </div>

      <div className="input-wrapper">
        <label>Password: </label>
        <input type="password" />
      </div>

      <input type="submit" name="" id="" value="Signup"/>
      <div className="close-button" onClick={() => setSignupForm(!signupForm)}>X</div>
    </form>
  );
}

export default SignUp;