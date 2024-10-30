import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/LoginPage">Login Page</Link></li>
          </ul>
        </nav>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/LoginPage">LoginPage</a></li>
          </ul>
        </nav>

        {/* Define Routes here */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/LoginPage" element={<LoginPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
