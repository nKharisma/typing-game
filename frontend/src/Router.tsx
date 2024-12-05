import { createBrowserRouter } from 'react-router-dom'

// Layout Imports
import HeaderLayout from './layouts/HeaderLayout'
import AuthProtectedRoutesLayout from './layouts/AuthProtectedRoutesLayout'

// Page Imports
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import SendPasswordResetPage from './pages/SendPasswordResetPage'
import ValidatePasswordResetPage from './pages/ValidatePasswordResetPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import NewGamePage from './pages/NewGamePage'
import LeaderboardPage from './pages/LeaderboardPage'
import NotFoundPage from './pages/NotFoundPage'
import Settings from './pages/Settings'

// CSS Imports
import './index.css'

export default function createRouter() {
  return createBrowserRouter(
    [
      {
        path: '/',
        element: <HeaderLayout />,
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/about', element: <AboutPage /> },
          { path: '/leaderboard', element: <LeaderboardPage />},
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
          { path: '/verify-email', element: <VerifyEmailPage /> },
          { path: '/send-password-reset', element: <SendPasswordResetPage /> },
          { path: '/validate-password-reset', element: <ValidatePasswordResetPage /> },
          {
            element: <AuthProtectedRoutesLayout />,
            path: '/dashboard',
            children: [
              { path: '/dashboard', element: <DashboardPage /> },
              { path: '/dashboard/profile', element: <ProfilePage /> },
              { path: '/dashboard/new-game', element: <NewGamePage /> },
              { path: '/dashboard/settings', element: <Settings/> },
            ]
          },
          { path: '/*', element: <NotFoundPage />},
        ]
      }
    ]
  );
};
