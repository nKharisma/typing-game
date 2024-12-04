import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../contexts/AuthContext";
import getBackendUrl from "../utils/getBackendUrl";
import '../css/ProfilePage.css'

export default function ProfilePage() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const deleteAccount = async () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      console.error('Auth token not found');
      return;
    }

    try {
      const response = await fetch(`${getBackendUrl()}/api/v1/user/delete-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
      });

      if (response.ok) {
        // Use AuthContext to mark user as logged out and delete the JWT token in localStorage.
        logout();
        navigate('/');
      } else {
        // Handle server response if it's not 200 range OK.
        const data = await response.json();
        if (data.error === 'ACCOUNT_NOT_VERIFIED') {
          // Save email for access in VerifyEmailPage.
          console.log('Account not verified yet... can\'t delete');
        }
        console.log(data.message || 'Server connection error, try again later...');
      }
    } catch (error) {
      // Handle fetch errors.
      console.log('Server connection error, try again later...');
    }
  };

  return (
    <div className='profile-page'>
      <button className='profile-page__logout-button' onClick={logout}>Log out</button>
      <button className='profile-page__delete-button' onClick={deleteAccount}>
        Delete Account
      </button>
    </div>
  );
}
