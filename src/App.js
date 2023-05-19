import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navigation from './components/layout/Navbar';
import Home from './components/dashboard/Home'
import PostDetails from './components/projects/PostDetails';
import CreatePost from './components/projects/CreatePost';
import ForgotPassword from './components/auth/ForgotPassword';
import Profile from './components/projects/Profile';
import UpdateProfile from './components/auth/Update';
import SignUp from './components/auth/SignUp';
import SignIn from './components/auth/SignIn';

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
              <Route path='/signup' element={<SignUp />}/>
              <Route path='/login' element={<SignIn />}/>
              <Route path='/profile' element={<PrivateRoute component={Profile} />}/>
              <Route path='/update-profile' element={<PrivateRoute component={UpdateProfile} />}/>
            </Routes>
          </Router>
      </div>
    </PostsProvider>
    </AuthProvider>
  );
}

export default App;
