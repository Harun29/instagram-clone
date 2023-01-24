const SignUp = ({signupForm, setSignupForm}) => {

  return (
    <form className="login-signup-form">
      <label>
        Name:
        <input 
          type="text" 
        />
      </label>

      <label>
        Username:
        <input 
          type="text" 
        />
      </label>

      <label>
        Age:
        <input 
          type="date" 
        />
      </label>

      <label>
        Email:
        <input 
          type="email" 
        />
      </label>

      <label>
        Password:
        <input 
          type="password" 
        />
      </label>

      <input type="submit" name="" id="" value="Signup"/>
      <div className="close-button" onClick={() => setSignupForm(!signupForm)}>X</div>
    </form>
  );
}

export default SignUp;