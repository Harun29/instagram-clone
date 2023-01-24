const SignIn = ({loginForm, setLoginForm}) => {

  return (
    <form className="login-form">
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

      <input type="submit" name="" id="" />
      <div className="close-button" onClick={() => setLoginForm(!loginForm)}>X</div>
    </form>
  );
}

export default SignIn;