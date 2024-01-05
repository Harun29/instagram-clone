import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/layout/Navbar";
import Home from "./components/dashboard/Home";
import CreatePost from "./components/projects/CreatePost";
import ForgotPassword from "./components/auth/ForgotPassword";
import Profile from "./components/projects/Profile";
import UpdateProfile from "./components/auth/Update";
import SignUp from "./components/auth/SignUp";
import SignIn from "./components/auth/SignIn";
import User from "./components/projects/User";
import UserFollowList from "./components/projects/UserFollowList";
import "animate.css";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import { auth } from "./config/firebase";
import { useState, useEffect } from "react";
import Chats from "./components/projects/Chats";

function App() {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 3500)
  }, [])

  return (
    <AuthProvider>
      <div className="App">
        {loading &&
        <div className="loading-screen">
          <img src="igclone.png" />
          <h1 style={{ fontFamily: "Oleo Script" }}>Igclone</h1>
        </div>
        }
        <Router>
          {currentUser && <Navigation />}
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/" element={<PrivateRoute component={Home} />} />
            <Route
              path="/createpost"
              element={<PrivateRoute component={CreatePost} />}
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/user/:username"
              element={<PrivateRoute component={User} />}
            />
            <Route
              path="/user/:username/followers"
              element={<UserFollowList fetchType="followers" />}
            />
            <Route
              path="/user/:username/following"
              element={<UserFollowList fetchType="following" />}
            />
            <Route
              path="/profile/:username/following"
              element={<UserFollowList fetchType="following" />}
            />
            <Route
              path="/profile/:username/followers"
              element={<UserFollowList fetchType="followers" />}
            />
            <Route
              path="/profile"
              element={<PrivateRoute component={Profile} />}
            />
            <Route
              path="/settings"
              element={<PrivateRoute component={UpdateProfile} />}
            />
            <Route
              path="/messenger/:userid"
              element={<PrivateRoute component={Chats} />}
            />
            <Route
              path="/messenger"
              element={<PrivateRoute component={Chats} />}
            />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
