import { Link, Outlet } from 'react-router-dom'
import { useState } from 'react'
import '../css/root-layout.css'

export default function RootLayout() {
  const [userSignedIn, setUserSignedIn] = useState(false);
  // TODO: Make this check the current JWT
  const toggleSignedIn = () => {
    setUserSignedIn(!userSignedIn);
  };

  const conditionalHeader = (signedIn: boolean) => {
    if (!signedIn) {
      return (
        <div className = "header-container">
          <div className = "header-logo-container">
            <Link className="header-logo" to={signedIn ? "/dashboard" : "/"} >TypeCode</Link>
          </div>
          <div className="header-options-container">
            <button onClick={toggleSignedIn}>Toggle signed-in</button>
            <Link className="header-sign-in" to="/sign-in">Sign-In</Link>
            <Link className="header-sign-up" to="/sign-up">Sign-Up</Link>
          </div>
        </div>
      );
    } else {
      return (
        <div className = "header-container">
          <div className = "header-logo-container">
            <Link className="header-logo" to="/dashboard">TypeCode</Link>
          </div>
          <div className="header-options-container">
            <button onClick={toggleSignedIn}>Toggle signed-in</button>
            <Link className="header-dashboard" to="/dashboard">Dashboard</Link>
            <Link className="header-profile" to="/dashboard/profile">Profile</Link>
          </div>
        </div>
      );
    }
  };

  // Create the header and return outlet for children
  return (
    <div>
      <header className="header">
        <div>{conditionalHeader(userSignedIn)}</div>
      </header>

      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}
