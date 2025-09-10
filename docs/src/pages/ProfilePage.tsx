import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../contexts/AuthContext";
import getBackendUrl from "../utils/getBackendUrl";
import '../css/ProfilePage.css'

export default function ProfilePage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const [score, setScore] = useState(0);
  const [wordsPerMinute, setWordsPerMinute] = useState(0);
  const [totalWordsTyped, setTotalWordsTyped] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [levelsCompleted, setLevelsCompleted] = useState(0);

  const [showConfirm, setShowConfirm] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const getUserData = async () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      console.error('Auth token not found');
      return;
    }
    
    try {
      const response = await fetch(`${getBackendUrl()}/api/getUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setEmail(data.email);
      } else {
        const data = await response.json();
        console.log(data.message || 'Server connection error, try again later...');
      }
    } catch (error) {
      console.log('Server connection error, try again later...');
    }

    try {
      const response = await fetch(`${getBackendUrl()}/api/v1/user/get-player-data-with-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setScore(data.highScore);
        setWordsPerMinute(data.wordsPerMinute);
        setTotalWordsTyped(data.totalWordsTyped);
        setAccuracy(data.accuracy);
        setLevelsCompleted(data.levelsCompleted);
      } else {
        const data = await response.json();
        console.log(data);
        console.log(data.message || 'Server connection error, try again later...');
      }
    } catch (error) {
      console.log('Server connection error, try again later...');
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

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
        logout();
        navigate('/');
      } else {
        const data = await response.json();
        console.log(data.message || 'Server connection error, try again later...');
      }
    } catch (error) {
      console.log('Server connection error, try again later...');
    }
  };

  return (
    <div className='profile-page__container'>
      <h1 className='profile-page__title'>Account</h1>
      <p className='profile-page__user-field'>Name: {firstName} {lastName}</p>
      <p className='profile-page__user-field'>Email: {email}</p>

      <br/>

      <h1 className='profile-page__title'>High Scores</h1>
      <p className='profile-page__user-field'>Score: {score}</p>
      <p className='profile-page__user-field'>Words Per Minute: {wordsPerMinute.toFixed(2)}</p>
      <p className='profile-page__user-field'>Total Words Typed: {totalWordsTyped}</p>
      <p className='profile-page__user-field'>Accuracy: {accuracy.toFixed(2)}</p>
      <p className='profile-page__user-field'>Levels Completed: {levelsCompleted}</p>

      <button className='profile-page__logout-button' onClick={logout}>Log out</button>
      <button 
        className='profile-page__delete-button' 
        onClick={() => setShowConfirm(true)}
      >
        Delete Account
      </button>

      {showConfirm && (
        <div className="overlay">
          <div className="confirm-popup">
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            <button className="confirm-popup__yes" onClick={deleteAccount}>Yes</button>
            <button className="confirm-popup__no" onClick={() => setShowConfirm(false)}>No</button>
          </div>
        </div>
      )}
    </div>
  );
}
