import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { resetPassword } = useAuth();
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setMessage("");
      setError("");
      setLoading(true);
      await resetPassword(email);
      setMessage("check your email for further instructinos!");
    } catch (err) {
      setLoading(false);
      setError("Failed to reset password");
      console.log(err);
    }
  };

  return (
    <div className="center-form">
      <form className="login-signup-form" onSubmit={handleSubmit}>
        <h3>Enter your email:</h3>

        <div className="input-wrapper">
          <label>Email: </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <input
          disabled={loading}
          type="submit"
          name=""
          id=""
          value="Reset password"
        />

        {error && <p>{error}</p>}
        {message && <h2>{message}</h2>}
        <Link to="/">
          <button>Back to main page</button>
        </Link>
      </form>
    </div>
  );
};

export default ForgotPassword;
