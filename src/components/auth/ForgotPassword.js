const ForgotPassword = () => {
  return (
    <div className="center-form">  
      <div className="password-reset-form">
        <label>Enter your email to restore password:</label>
        <input type="email" />
        <button>Send reset link</button>
      </div>
    </div>
  );
}
 
export default ForgotPassword;