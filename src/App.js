import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './components/dashboard/Home';
import PostDetails from './components/projects/PostDetails';
import CreatePost from './components/projects/CreatePost';
import Profile from './components/projects/Profile';
import { PostsProvider } from './context/PostContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
    <PostsProvider>
      <div className="App">
          <Router>
            <Navbar />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/post/:id' element={<PostDetails />}/>
              <Route path='/createpost' element={<CreatePost />}/>
              <Route path='/profile' element={<Profile />}/>
            </Routes>
          </Router>
      </div>
    </PostsProvider>
    </AuthProvider>
  );
}

export default App;
