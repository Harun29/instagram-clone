import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navigation from './components/layout/Navbar';
import Home from './components/dashboard/Home';
import CreatePost from './components/projects/CreatePost';
import ForgotPassword from './components/auth/ForgotPassword';
import Profile from './components/projects/Profile';
import UpdateProfile from './components/auth/Update';
import SignUp from './components/auth/SignUp';
import SignIn from './components/auth/SignIn';
import User from './components/projects/User';
import UserFollowList from './components/projects/UserFollowList';
import Post from './components/projects/Post';

import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

function App() {
  return (
    <AuthProvider>
      <div className="App">
          <Router>
            <Navigation />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/createpost' element={<PrivateRoute component={CreatePost}/>}/>
              <Route path='/forgot-password' element={<ForgotPassword />}/>
              <Route path='/signup' element={<SignUp />}/>
              <Route path='/login' element={<SignIn />}/>
              <Route path='/user/:username' element={<User />}/>
              <Route path='/post/:postid' element={<Post />}/>
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
              <Route path='/profile' element={<PrivateRoute component={Profile} />}/>
              <Route path='/update-profile' element={<PrivateRoute component={UpdateProfile} />}/>
            </Routes>
          </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
