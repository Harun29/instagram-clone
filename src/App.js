import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navigation from './components/layout/Navbar';
import Home from './components/dashboard/Home'
import PostDetails from './components/projects/PostDetails';
import CreatePost from './components/projects/CreatePost';
import ForgotPassword from './components/auth/ForgotPassword';
import Profile from './components/projects/Profile';
import UpdateProfile from './components/auth/Update';
import {EmailUpdate, PasswordUpdate, NameUpdate, UserNameUpdate} from './components/auth/ProfileUpdate';

import { PostsProvider } from './context/PostContext';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

function App() {
  return (
    <AuthProvider>
    <PostsProvider>
      <div className="App">
          <Router>
            <Navigation />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/post/:id' element={<PostDetails />}/>
              <Route path='/createpost' element={<CreatePost />}/>
              <Route path='/forgot-password' element={<ForgotPassword />}/>
              <Route path='/profile' element={<PrivateRoute component={Profile} />}/>
              <Route path='/update-profile' element={<PrivateRoute component={UpdateProfile} />}/>
              <Route path='/update-profile/email-update' element={<PrivateRoute component={EmailUpdate} />}/>
              <Route path='/update-profile/password-update' element={<PrivateRoute component={PasswordUpdate} />}/>
              <Route path='/update-profile/name-update' element={<PrivateRoute component={NameUpdate} />}/>
              <Route path='/update-profile/username-update' element={<PrivateRoute component={UserNameUpdate} />}/>
            </Routes>
          </Router>
      </div>
    </PostsProvider>
    </AuthProvider>
  );
}

export default App;
