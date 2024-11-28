import React, { useEffect, useRef, useState } from 'react';
import '../css/game.css';
import {v4 as uuidv4} from 'uuid';

interface Bug {
  id: string;
  text: string;
  element: HTMLElement;
}

/*
interface Projectile {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  element: HTMLElement;
}*/

function Game() {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [typedWord, setTypedWord] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  //const playerShipRef = useRef<HTMLDivElement>(null);
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [activeBug, setActiveBug] = useState<string | null>(null);
  //const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [score, setScore] = useState(() => {
    const savedScore = localStorage.getItem('score');
    return savedScore ? parseInt(savedScore, 10) : 0;
  });
  const [gameOver, setGameOver] = useState(false);
  const [waveCleared, setWaveCleared] = useState(false);
  /*
  const [totalWords, setTotalWords] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
*/

	useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // Focus the input element when the component mounts
    }
    
    startWaves();
    
    const checkBugsInterval = setInterval(() => {
      const gameContainer = gameContainerRef.current;
      if(gameContainer) {
        const bugsInContainer = gameContainer.getElementsByClassName('bug').length;
        if(bugsInContainer === 0 && !waveCleared) {
          setWaveCleared(true);
        }
      }
    }, 1000);
    
    return () => clearInterval(checkBugsInterval);
	}, []);
	
	useEffect(() => {
	  console.log('Active Bug ID:', activeBug);
	}, [activeBug]);
	
	useEffect(() => {
	  localStorage.setItem('score', score.toString());
	}, [score]);
	
	useEffect(() => {
	  if(waveCleared && !gameOver) {
	    const waveDelay = 5000;
	    setTimeout(startWaves, waveDelay);
	  }
	}, [waveCleared, gameOver]);
	
	const startWaves = () => {
	  const spawnNextWave = () => {
	    if(!gameOver) {
	        const bugsPerWave = Math.floor(Math.random() * 10) + 1;
	        setWaveCleared(false);
	        spawnWave(bugsPerWave);
	      }
	  };
	  
	  spawnNextWave();
	};
	
	const spawnWave = (count: number) => {
    let spawnedBugs = 0;
    const interval = setInterval(() => {
      if (spawnedBugs < count) {
        spawnBug();
        spawnedBugs++;
      } else {
        clearInterval(interval);
      }
    }, 5000); // Spawn a bug every 500ms
  };
	
	const spawnBug = () => {
    const gameContainer = gameContainerRef.current;
    if (!gameContainer) return;
    
    const bugElement = document.createElement('div');
    bugElement.className = 'bug';
    bugElement.style.left = `${Math.random() * 100}vw`; 
  
    const bugText = document.createElement('div');
    bugText.className = 'bug-text';
      const word = generateRandomCode();
      word.split('').forEach(char => {
          const spanElement = document.createElement('span');
          spanElement.textContent = char;
          bugText.appendChild(spanElement);
      });
      bugElement.appendChild(bugText);
  
      gameContainer.appendChild(bugElement);
  
      const bug: Bug = {
          id: uuidv4(),
          text: word,
          element: bugElement,
      };
      
      bugElement.dataset.id = bug.id.toString();
      
      setBugs(prevBugs => [...prevBugs, bug]);
      
      bugElement.addEventListener('animationend', () => {
          gameContainer.removeChild(bugElement);
          setBugs(prevBugs => prevBugs.filter(b => b.element !== bugElement));
      });
      
	};
	
	/*
	useEffect(() => {
	  const gameLoop = () => {
	    requestAnimationFrame(gameLoop);
	  };
	});
	
	const updateStatsInDatabase = async () => {
	  try {
	    const response = await fetch()
	  }
	}*/
	
  const handleBackspace = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      event.preventDefault();
    }
  };

  const handleTyping = (event: React.ChangeEvent<HTMLInputElement>) => {
  const input = event.target.value;
  setTypedWord(input);

  const gameContainer = gameContainerRef.current;
  if (!gameContainer) return;

  // If there's no active bug, find a matching bug based on the input
  if (!activeBug) {
    const matchingBugs = Array.from(gameContainer.getElementsByClassName('bug')).filter(bugElement => {
      const bugText = bugElement.querySelector('.bug-text') as HTMLElement;
      return bugText.textContent?.startsWith(input) ?? false; // Check if the input matches the start of the bug text
    });
    
    console.log('Matching Bugs:', matchingBugs);

    if (matchingBugs.length > 0) {
    const activeBugElement = matchingBugs[0] as HTMLElement;
      setActiveBug(activeBugElement.dataset.id || null); // Set the first matching bug as active
      console.log('Active Bug ID:', activeBugElement.dataset.id);
      return; // Exit early since we just set the active bug
    } else {
      setActiveBug(null); // Reset active bug if no match
    }
  }

  // Now we can safely check for the active bug using its unique ID
  const activeBugElement = Array.from(gameContainer.getElementsByClassName('bug')).find(bugElement => (bugElement as HTMLElement).dataset.id === activeBug);
  
  if (activeBugElement) {
    const bugText = activeBugElement.querySelector('.bug-text') as HTMLElement;
    const spans = Array.from(bugText.children) as HTMLElement[];
    let currentIndex = 0;
    let inputIndex = 0;

    while (inputIndex < input.length && currentIndex < spans.length) {
      if (input[inputIndex] === spans[currentIndex].textContent) {
        spans[currentIndex].classList.add('correct');
        spans[currentIndex].classList.remove('incorrect');
        currentIndex++;
      } else {
        spans[currentIndex].classList.remove('correct');
      }
      inputIndex++;
    }

    // If all spans are matched, remove the bug
    if (currentIndex === spans.length) {
      gameContainer.removeChild(activeBugElement);
      setTypedWord('');
      setScore(prevScore => {
        const newScore = prevScore + 10;
        localStorage.setItem('score', newScore.toString());
        return newScore;
      });
      setBugs(prevBugs => {
        const updatedBugs = prevBugs.filter(b => b.id !== (activeBugElement as HTMLElement).dataset.id);
        if (updatedBugs.length === 0) {
          setWaveCleared(true); // Set waveCleared to true when all bugs are removed
        }
        return updatedBugs;
      });
      setActiveBug(null); // Reset active bug
    }
  }
};

	
	/*
	const handleProjectile = (targetElement: HTMLElement) => {
	  if(!playerShipRef.current) return;
	  
	  const playerShipRect = playerShipRef.current.getBoundingClientRect();
	  const bugTargetRect = targetElement.getBoundingClientRect();
	  const newProjectile: Projectile = {
	    id: Date.now(),
      x: playerShipRect.left,
      y: playerShipRect.top,
      targetX: bugTargetRect.left,
      targetY: bugTargetRect.top,
      element: document.createElement('div')
	  }
	  
	  newProjectile.element.className = 'projectile';
	  setProjectiles(prevProjectiles => [...prevProjectiles, newProjectile]);
	}
	
	
	const calculateAccuracy = () => {
	  return totalChars === 0 ? 0 : (correctChars / totalChars) * 100;
	}
	
	const calculateWPM = () => {
	  if(!startTime) return 0;
	  const minutes = (new Date().getTime() - startTime.getTime()) / 60000;
	  return totalWords / minutes;
	}*/

	const generateRandomCode = () => {
    const code = ['int randomNum = 42;', 'System.out.println("Hello, World!");', 'const pi = 3.14;', 'let name = "John Doe";', 'print("This is a bug!");'];
    return code[Math.floor(Math.random() * code.length)];
	};

	return (
    <div className="game-container" ref={gameContainerRef}>
    <div className="stats">
      <div>Score: {score}</div>
    </div>
    <div className='player-ship'></div>
    <input
        type="text"
        value={typedWord}
        onChange={handleTyping}
        onKeyDown={handleBackspace}
        placeholder="Type the word"
        className="typing-input"
        autoFocus
    />
    </div>
	);
}

export default Game;