const SignIn = () => {

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
      <div className="close-button">X</div>
    </form>
  );
}
 
export default SignIn;