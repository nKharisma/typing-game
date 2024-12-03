import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

import '../css/ProfilePage.css'

export default function ProfilePage() {
  const { logout } = useContext(AuthContext);

  return (
    <div className='profile-page'>
      <button className='profile-page__button' onClick={logout}>Log out</button>
    </div>
  );
}
