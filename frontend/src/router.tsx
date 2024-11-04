import { createBrowserRouter } from 'react-router-dom'

// Import the layouts
import RootLayout from './layouts/root-layout'
import DashboardLayout from './layouts/dashboard-layout'

// Import the components
import HomePage from './routes/home'
import SignUpPage from './routes/sign-up'
import DashboardPage from './routes/dashboard'
import ProfilePage from './routes/dashboard.profile'
import LoginPage from './routes/login-page'
import './index.css'

const createRouter = () => createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/sign-in/*", element: <LoginPage /> },
      { path: "/sign-up/*", element: <SignUpPage /> },
      {
        element: <DashboardLayout />,
        path: "dashboard",
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/dashboard/profile", element: <ProfilePage /> },
        ]
      },
      { path: "/*", element: <HomePage />},
    ]
  },
])

export default createRouter;
