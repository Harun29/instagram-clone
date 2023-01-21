import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './components/dashboard/Home';
import PostDetails from './components/projects/PostDetails';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/post/:id' element={<PostDetails />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
