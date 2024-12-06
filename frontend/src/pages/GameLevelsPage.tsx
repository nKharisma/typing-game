import { useNavigate } from 'react-router-dom';

import '../css/GameLevelsPage.css'

export default function PreGamePage() {
  const navigate = useNavigate();

  return (
    <div className='game-levels-page__container'>
      <div className='game-levels-page'>
        <div className='game-levels-page__block'>
          <div className='game-levels-page__block-text-container'>
            <h1>Variables</h1>
            <p>Learn to use variables to store and manage data in your programs efficiently!</p>
            <button onClick={() => navigate('/dashboard/game-level-1')}>Start Game</button>
          </div>
        </div>
        <div className='game-levels-page__block'>
          <div className='game-levels-page__block-text-container'>
            <h1>Conditionals</h1>
            <p>Learn to use conditionals to make decisions and control the flow of your code!</p>
            <button onClick={() => navigate('/dashboard/game-level-2')}>Start Game</button>
          </div>
        </div>
        <div className='game-levels-page__block'>
          <div className='game-levels-page__block-text-container'>
            <h1>Loops</h1>
            <p>Learn to use loops to repeat actions in code and process data sets effortlessly!</p>
            <button onClick={() => navigate('/dashboard/game-level-3')}>Start Game</button>
          </div>
        </div>
        <div className='game-levels-page__block'>
          <div className='game-levels-page__block-text-container'>
            <h1>Strings</h1>
            <p>Learn to use strings to handle and manipulate text-based data seamlessly!</p>
            <button onClick={() => navigate('/dashboard/game-level-4')}>Start Game</button>
          </div>
        </div>
        <div className='game-levels-page__block'>
          <div className='game-levels-page__block-text-container'>
            <h1>Arrays</h1>
            <p>Learn to use arrays to organize and access collections of items with ease!</p>
            <button onClick={() => navigate('/dashboard/game-level-5')}>Start Game</button>
          </div>
        </div>
        <div className='game-levels-page__block'>
          <div className='game-levels-page__block-text-container'>
            <h1>Functions</h1>
            <p>Learn to use functions to structure your code and reuse logic effectively!</p>
            <button onClick={() => navigate('/dashboard/game-level-6')}>Start Game</button>
          </div>
        </div>
      </div>
    </div>
  );
}
