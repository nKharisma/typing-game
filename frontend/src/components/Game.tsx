import React, { useCallback, useEffect, useRef, useState } from 'react';
import '../css/game.css';
import {v4 as uuidv4} from 'uuid';
import { miniPrograms } from '../utils/programSnippets';
import { useNavigate } from 'react-router-dom';

interface Bug {
  id: string;
  text: string;
  element: HTMLElement;
}

function Game() {
  const navigate = useNavigate();
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [typedWord, setTypedWord] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const playerShipRef = useRef<HTMLDivElement>(null);
  const setBugs = useState<Bug[]>([])[1];
  const [activeBug, setActiveBug] = useState<string | null>(null);
  const [score, setScore] = useState(() => {
    const savedScore = localStorage.getItem('score');
    return savedScore ? parseInt(savedScore, 10) : 0;
  });
  const [gameOver, setGameOver] = useState(false);
  const [bugsReachedBottom, setBugsReachedBottom] = useState(0);
  const [initialWaveStarted, setInitialWaveStarted] = useState(false);
  const [initialWaveCompleted, setInitialWaveCompleted] = useState(false);
  const [waveCleared, setWaveCleared] = useState(false);
  const [totalWords, setTotalWords] = useState(() => {
    const savedTotalWords = localStorage.getItem('totalWords');
    return savedTotalWords ? parseInt(savedTotalWords, 10) : 0;
  });
  const [highScore, setHighScore] = useState(() => {
    const savedHighScore = localStorage.getItem('highScore');
    return savedHighScore ? parseInt(savedHighScore, 10) : 0;
  });
  const [correctChars, setCorrectChars] = useState(() => {
    const savedCorrectChars = localStorage.getItem('correctChars');
    return savedCorrectChars ? parseInt(savedCorrectChars, 10) : 0;
  });
  const [totalChars, setTotalChars] = useState(() => {
    const savedTotalChars = localStorage.getItem('totalChars');
    return savedTotalChars ? parseInt(savedTotalChars, 10) : 0;
  });
  const [wavesCompleted, setWavesCompleted] = useState(() => {
    const savedWavesCompleted = localStorage.getItem('wavesCompleted');
    return savedWavesCompleted ? parseInt(savedWavesCompleted, 10) : 0;
  });
  const [startTime, setStartTime] = useState<Date | null>(null);

	useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // Focus the input element when the component mounts
    }
    
    const initialWaveDelay = 1000; // Adjust the delay as needed
  setTimeout(() => {
    startWaves();
    setInitialWaveStarted(true);
    }, initialWaveDelay);
    
    const checkBugsInterval = setInterval(() => {
      const gameContainer = gameContainerRef.current;
      if(gameContainer) {
        const bugsInContainer = gameContainer.getElementsByClassName('bug').length;
        if(bugsInContainer === 0 && !waveCleared && initialWaveStarted) {
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
	  if(gameOver) {
	    const accuracy = totalChars > 0 ? (correctChars / totalChars) * 100 : 0;
	    
	    const endTime = new Date();
	    const elapsedTime = startTime ? (endTime.getTime() - startTime.getTime()) / 1000 : 0;
	    const wpm = elapsedTime > 0 ? (totalWords / elapsedTime) * 60 : 0;
	    
	    if(score > highScore) {
	      setHighScore(score);
	      localStorage.setItem('highScore', score.toString());
	    }
	    
	    localStorage.setItem('accuracy', accuracy.toFixed(2));
	    localStorage.setItem('wpm', wpm.toString());
	  
	    alert('Game Over!\nHigh Score: ${highScore}\nScore: ${score}\nAccuracy: ${accuracy.toFixed(2)}%\nWPM: ${wpm}');
	    navigate('/dashboard');
	  }
	}, [gameOver]);
	
	useEffect(() => {
	  const maxBugsReachedBottom = 5;
	  if(bugsReachedBottom >= maxBugsReachedBottom) {
      setGameOver(true);
    }
	}, [bugsReachedBottom])
	
	useEffect(() => {
    if (waveCleared && !gameOver) {
      if (initialWaveStarted && initialWaveCompleted) {
        setWavesCompleted(prev => {
          const newWavesCompleted = prev + 1;
          localStorage.setItem('wavesCompleted', newWavesCompleted.toString());
          return newWavesCompleted;
        });
      } else if (initialWaveStarted && !initialWaveCompleted) {
        setInitialWaveCompleted(true);
      }
  
      const waveDelay = 3500;
      setTimeout(startWaves, waveDelay);
    }
  }, [waveCleared, gameOver, initialWaveStarted, initialWaveCompleted]);
	
	const startWaves = () => {
    const spawnNextWave = () => {
    if(!gameOver) {
        const gameContainer = gameContainerRef.current;
        if(!gameContainer) return;
        
        const currentBugs = gameContainer.getElementsByClassName('bug').length;
        const maxBugs = 10;
	      const bugsToSpawn = Math.min(maxBugs - currentBugs, Math.floor(Math.random() * 10) + 1);

        if(bugsToSpawn > 0) {
          setWaveCleared(false);
          spawnWave(bugsToSpawn);
          }
	    }
    };
  
    spawnNextWave();
	};
	
	const spawnWave = (count: number) => {
    const lines = generateRandomCode();
    let spawnedBugs = 0;
    const interval = setInterval(() => {
      if (spawnedBugs < count && spawnedBugs < lines.length) {
        spawnBug(lines[spawnedBugs]);
        spawnedBugs++;
      } else {
        clearInterval(interval);
      }
    }, 3500); // 3.5 seconds
  };
	
	const spawnBug = (line: string) => {
    const gameContainer = gameContainerRef.current;
    if (!gameContainer) return;
  
    const gameContainerWidth = gameContainer.offsetWidth;
    const minLeft = 0;
  
    let leftPosition;
    let isOverlapping;
  
    const tempBugText = document.createElement('div');
    tempBugText.className = 'bug-text';
    tempBugText.style.position = 'absolute';
    tempBugText.style.visibility = 'hidden';
    tempBugText.style.whiteSpace = 'nowrap';
    tempBugText.textContent = line;
    document.body.appendChild(tempBugText);
    const textWidth = tempBugText.offsetWidth;
    document.body.removeChild(tempBugText);
  
    const maxLeft = gameContainerWidth - textWidth;
  
    do {
      leftPosition = Math.random() * (maxLeft - minLeft) + minLeft;
      isOverlapping = false;
  
      // Check for overlapping with existing bugs
      const existingBugs = gameContainer.getElementsByClassName('bug');
      for (let i = 0; i < existingBugs.length; i++) {
        const existingBug = existingBugs[i] as HTMLElement;
        const existingBugLeft = parseFloat(existingBug.style.left);
        const existingBugWidth = existingBug.offsetWidth;
        if (
          (leftPosition < existingBugLeft + existingBugWidth && leftPosition + textWidth > existingBugLeft) ||
          (existingBugLeft < leftPosition + textWidth && existingBugLeft + existingBugWidth > leftPosition)
        ) {
          isOverlapping = true;
          break;
        }
      }
    } while (isOverlapping);
  
    const bugElement = document.createElement('div');
    bugElement.className = 'bug';
    bugElement.style.left = `${leftPosition}px`;
  
    const bugText = document.createElement('div');
    bugText.className = 'bug-text';
    line.split('').forEach(char => {
      const spanElement = document.createElement('span');
      spanElement.textContent = char;
      bugText.appendChild(spanElement);
    });
  
    bugElement.appendChild(bugText);
    gameContainer.appendChild(bugElement);
  
      const bug: Bug = {
          id: uuidv4(),
          text: line,
          element: bugElement,
      };
      
      bugElement.dataset.id = bug.id.toString();
      
      setBugs(prevBugs => [...prevBugs, bug]);
      
      bugElement.addEventListener('animationend', () => {
          gameContainer.removeChild(bugElement);
          setBugs(prevBugs => prevBugs.filter(b => b.element !== bugElement));
      });
      
	};
	
	const shootProjectile = (targetElement: HTMLElement) => {
    console.log('Shooting projectile at:', targetElement.textContent);
  
    const gameContainer = gameContainerRef.current;
    if (!gameContainer) {
      console.error('Game container not found');
      return;
    }
  
    const playerShip = playerShipRef.current;
    if (!playerShip) {
      console.error('Player ship not found');
      return;
    }
  
    const projectile = document.createElement('div');
    projectile.className = 'projectile';
    gameContainer.appendChild(projectile);
  
    const playerRect = playerShip.getBoundingClientRect();
    const gameRect = gameContainer.getBoundingClientRect();
    projectile.style.left = `${playerRect.left}px`;
    projectile.style.top = `${playerRect.top}px`;
  
    console.log('Projectile initial position:', projectile.style.left, projectile.style.top);
  
    // Calculate the initial angle to rotate the projectile
    const initialTargetRect = targetElement.getBoundingClientRect();
    const initialTargetX = initialTargetRect.left - gameRect.left + initialTargetRect.width / 2;
    const initialTargetY = initialTargetRect.top - gameRect.top + initialTargetRect.height / 2;
  
    const initialDeltaX = initialTargetX - (playerRect.left - gameRect.left + playerRect.width / 2);
    const initialDeltaY = initialTargetY - (playerRect.top - gameRect.top);
    const initialDistance = Math.sqrt(initialDeltaX * initialDeltaX + initialDeltaY * initialDeltaY);
    const initialAngle = Math.atan2(initialDeltaY, initialDeltaX);
  
    console.log('Initial target position:', initialTargetX, initialTargetY);
    console.log('Initial angle (radians):', initialAngle);
  
    // Apply initial rotation to the projectile
    projectile.style.transform = `rotate(${initialAngle}rad)`;
    projectile.style.transformOrigin = 'center';
  
    // Calculate a shorter distance to stop before the target
  
    // Calculate animation duration based on the shorter distance
    const speed = 1000; // Pixels per second
    const duration = (initialDistance / speed) * 1000; // Convert to milliseconds
  
    // Smooth projectile animation
    const animation = projectile.animate(
      [
        { transform: `translate(0, 0) rotate(${initialAngle}rad)` },
        { transform: `translate(${initialDeltaX}px, ${initialDeltaY}px) rotate(${initialAngle}rad)` },
      ],
      {
        duration: duration,
        easing: 'linear',
      }
    );
  
    animation.onfinish = () => {
      gameContainer.removeChild(projectile);
  
      if (gameContainer.contains(targetElement)) {
        gameContainer.removeChild(targetElement);
      }
    };
  
    const updateTargetPosition = () => {
      const currentRect = projectile.getBoundingClientRect();
      const currentX = currentRect.left + currentRect.width / 2;
      const currentY = currentRect.top + currentRect.height / 2;
  
      const targetRect = targetElement.getBoundingClientRect();
      const targetX = targetRect.left - gameRect.left + targetRect.width / 2;
      const targetY = targetRect.top - gameRect.top + targetRect.height / 2;
  
      const deltaX = targetX - currentX;
      const deltaY = targetY - currentY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  
      if (distance < 5) {
        console.log('Projectile hit the target!');
        gameContainer.removeChild(projectile);
        gameContainer.removeChild(targetElement);
        return;
      }
  
      requestAnimationFrame(updateTargetPosition);
    };
  
    requestAnimationFrame(updateTargetPosition);
  };
	
  const handleBackspace = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      event.preventDefault();
    }
  };

  const handleTyping = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
  const input = event.target.value;
  setTypedWord(input);
  
  if(startTime === null) {
    setStartTime(new Date());
  }

  const gameContainer = gameContainerRef.current;
  if (!gameContainer) return;

  const bugs = Array.from(gameContainer.getElementsByClassName('bug')) as HTMLElement[];
  //console.log('Bugs:', bugs.map(bug => bug.textContent));

  if (!activeBug) {
    const matchingBugs = bugs.filter(bugElement => {
      const bugText = bugElement.querySelector('.bug-text') as HTMLElement;
      const bugTextContent = bugText.textContent?.trim(); // Trim the bug text
      console.log(`Comparing input "${input}" with bug text "${bugTextContent}"`);
      return input.split('').some(char => bugTextContent?.startsWith(char));
    });
    
    console.log('Matching Bugs:', matchingBugs);

    if (matchingBugs.length > 0) {
      const activeBugElement = matchingBugs[0] as HTMLElement;
      setActiveBug(activeBugElement.dataset.id || null);
      console.log('Active Bug ID:', activeBugElement.dataset.id);
      
      const bugText = activeBugElement.querySelector('.bug-text') as HTMLElement;
      const spans = Array.from(bugText.children) as HTMLElement[];
      spans[0].classList.add('correct');
    } else {
      setActiveBug(null);
    }
  }

  const activeBugElement = bugs.find(bug => bug.dataset.id === activeBug);
  
  if (activeBugElement) {
    const bugText = activeBugElement.querySelector('.bug-text') as HTMLElement;
    const spans = Array.from(bugText.children) as HTMLElement[];
    
    console.log('Spans:', spans);
    let currentIndex = 0;
    let inputIndex = 0;

    if (spans[0].classList.contains('correct')) {
      currentIndex = 1;
      inputIndex = 1;
    }

    while (inputIndex < input.length && currentIndex < spans.length) {
      if (input[inputIndex] === spans[currentIndex].textContent) {
        if (!spans[currentIndex].classList.contains('correct')) {
          spans[currentIndex].classList.add('correct');
          setCorrectChars(prev => {
            const newCorrectChars = prev + 1;
            localStorage.setItem('correctChars', newCorrectChars.toString());
            return newCorrectChars;
          });
        }
        currentIndex++;
      } else {
        spans[currentIndex].classList.remove('correct');
      }
      inputIndex++;
    }

    if (currentIndex === spans.length) {
      shootProjectile(activeBugElement);
      setTotalWords(prev => {
        const newTotalWords = prev + 1;
        localStorage.setItem('totalWords', newTotalWords.toString());
        return newTotalWords;
      })
      setTypedWord('');
      setScore(prevScore => {
        const newScore = prevScore + 10;
        localStorage.setItem('score', newScore.toString());
        return newScore;
      });
      setBugs(prevBugs => {
        const updatedBugs = prevBugs.filter(b => b.id !== (activeBugElement as HTMLElement).dataset.id);
        if (updatedBugs.length === 0) {
          setWaveCleared(true);
        }
        return updatedBugs;
      });
      setActiveBug(null);
      
      setTotalChars(prev => {
        const newTotalChars = prev + ((bugText.textContent?.length) || 0);
        localStorage.setItem('totalChars', newTotalChars.toString());
        return newTotalChars;
      });
    }
  }
}, [activeBug, startTime, setCorrectChars, ]);

	const generateRandomCode = () => {
    const languages = Object.keys(miniPrograms);
    const randomLanguage = languages[Math.floor(Math.random() * languages.length)] as keyof typeof miniPrograms;
    const snippets = miniPrograms[randomLanguage];
    const randomSnippet = snippets[Math.floor(Math.random() * snippets.length)];
    return randomSnippet.lines;
	};

	return (
    <div className="game-container" ref={gameContainerRef}>
    <div className="stats">
      <div>Score: {score}</div>
      <div>Correct Characters: {correctChars}</div>
      <div>Total Characters: {totalChars}</div>
      <div>Total Words: {totalWords}</div>
      <div>Waves Completed: {wavesCompleted}</div>
      
    </div>
    <div className='player-ship' ref={playerShipRef}></div>
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
