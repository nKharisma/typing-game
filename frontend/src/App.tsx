import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const App = () => {
  return (
    <BrowserRouter>
      <div>
        {/* Temporary shitty navbar, just to test pages */}
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/Login">Login Page</Link></li>
            <li><Link to="/Register">Register Page</Link></li>
          </ul>
        </nav>

        {/* Define Routes to Pages here */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/Register" element={<RegisterPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
