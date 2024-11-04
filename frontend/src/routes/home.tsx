import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../loading-module/loading';

export default function HomePage() {
  const useAuth = () => {
    return { isLoaded: true, isSignedIn: false };
  }
  const { isLoaded, isSignedIn } = useAuth()
  const navigate = useNavigate();

  useEffect(() => {
      if (isSignedIn) {
        navigate('/dashboard')
      }
    }, [isSignedIn, navigate])

  return (!isLoaded) ? <Loading /> : (
    <div>
      <section className="wrapper">
            <div id='star1'></div>
            <div id='star2'></div>
            <div id='star3'></div>
        </section>
      <h1>This is the home page</h1>
    </div>
  )
};
