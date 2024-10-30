import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">LoginPage</a></li>
          </ul>
        </nav>

        {/* Define Routes here */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
