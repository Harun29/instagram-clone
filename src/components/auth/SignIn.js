const SignIn = ({loginForm, setLoginForm}) => {

  return (
    <form className="login-signup-form">

      <div className="input-wrapper">
        <label>Email: </label>
        <input type="email" />
      </div>

      <div className="input-wrapper">
        <label>Password: </label>
        <input type="password" />
      </div>

      <input type="submit" name="" id="" value="Login"/>
      <div className="close-button" onClick={() => setLoginForm(!loginForm)}>X</div>
    </form>
  );
}

export default SignIn;