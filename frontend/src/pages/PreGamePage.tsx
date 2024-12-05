import { useNavigate } from 'react-router-dom';

import '../css/PreGamePage.css'

export default function PreGamePage() {
  const navigate = useNavigate();

  return (
    <div className='pre-game-page__container'>
      <div className='pre-game-page'>
        <div className='pre-game-page__block-1'>
          <div className='pre-game-page__block-1-text-container'>
            <h1>Learning Mode</h1>
            <p>Learn to code in Java, Javascript, or Python while solving challenges to defeat your enemies!</p>
            <button onClick={() => navigate('/dashboard/game-levels')}>Pick Level</button>
          </div>
          <div className='pre-game-page__block-1-image-container'>
            <img className='pre-game-page__block-1-image' src="/assets/tile022_scaled.png" alt="Spaceship" />
          </div>
        </div>
        <div className='pre-game-page__block-2'>
          <div className='pre-game-page__block-2-image-container'>
            <img className='pre-game-page__block-2-image' src="/assets/tile009_scaled.png" alt="Spaceship" />
          </div>
          <div className='pre-game-page__block-2-text-container'>
            <h1>Freeplay Mode</h1>
            <p>Build coding muscle memory while competing to get the best scores!</p>
            <button onClick={() => navigate('/dashboard/new-game')}>Start Game</button>
          </div>
        </div>
      </div>
    </div>
  );
}
