import { Link, Outlet } from 'react-router-dom'

export default function RootLayout() {
  const devIsSignedIn = false;

  const conditionalHeader = (signedIn: boolean) => {
    if (!signedIn) {
      return (
        <div>
          <div>
            <Link className="logo" to="/" >TypeCode</Link>
          </div>
          <div className="header-options-container">
            <Link className="sign-in-btn" to="/sign-in">Sign In</Link>
            <Link className="sign-up-btn" to="/sign-up">Sign Up</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div>
              <Link className="logo" to="/dashboard">TypeCode</Link>
          </div>
          <div className="header-options-container">
              <Link className="dashboard-btn" to="/dashboard">Dashboard</Link>
              <Link to="/dashboard/profile">Profile</Link>
          </div>
        </div>
      );
    }
  };

  // Create the header and return outlet for children
  return (
    <div>
      <header className="header">
        <div>{conditionalHeader(devIsSignedIn)}</div>
      </header>

      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}
