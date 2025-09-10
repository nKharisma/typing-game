import React, { useCallback, useEffect, useRef, useState } from 'react';
import '../css/game.css';
import {v4 as uuidv4} from 'uuid';
import { miniPrograms } from '../utils/programSnippets';
import { useNavigate } from 'react-router-dom';
import '../css/GameOverModel.css';

import getBackendUrl from '../utils/getBackendUrl';

interface Bug {
  id: string;
  text: string;
  element: HTMLElement;
}

interface GameOverModel {
  score: number;
  highScore: number;
  accuracy: number;
  wpm: number;
  onClose: () => void;
}

const GameOverModel: React.FC<GameOverModel> = ({ score, highScore, accuracy, wpm, onClose }) => {
  return (
    <div className="game-over-modal">
      <div className="model-content">
      <h2>Game Over!</h2>
      <div>Score: {score}</div>
      <div>High Score: {highScore}</div>
      <div>Accuracy: {accuracy.toFixed(2)}%</div>
      <div>WPM: {wpm}</div>
      <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

//export { GameOverModel };

function Game() {
  const navigate = useNavigate();
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [typedWord, setTypedWord] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const playerShipRef = useRef<HTMLDivElement>(null);
  const setBugs = useState<Bug[]>([])[1];
  const [activeBug, setActiveBug] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [totalWords, setTotalWords] = useState(0);
  const [wavesCompleted, setWavesCompleted] = useState(0);
  const [staticWPM, setStaticWPM] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [bugsReachedBottom, setBugsReachedBottom] = useState(0);
  const [initialWaveStarted, setInitialWaveStarted] = useState(false);
  const [initialWaveCompleted, setInitialWaveCompleted] = useState(false);
  const [waveCleared, setWaveCleared] = useState(false);
  const [overallTotalWords,  setOverallTotalWords] = useState(() => {
    const savedTotalWords = localStorage.getItem('totalWords');
    return savedTotalWords ? parseInt(savedTotalWords, 10) : 0;
  });
  const [highScore, setHighScore] = useState(() => {
    const savedHighScore = localStorage.getItem('highScore');
    return savedHighScore ? parseInt(savedHighScore, 10) : 0;
  });
  const [highestWpm, setHighestWpm] = useState(() => {
    const savedHighestWpm = localStorage.getItem('highestWpm');
    return savedHighestWpm ? parseFloat(savedHighestWpm) : 0;
  });
  const [overallCorrectChars, setOverallCorrectCharacters] = useState(() => {
    const savedCorrectChars = localStorage.getItem('correctChars');
    return savedCorrectChars ? parseInt(savedCorrectChars, 10) : 0;
  });
  const [overallTotalChars, setOverallTotalChars] = useState(() => {
    const savedTotalChars = localStorage.getItem('totalChars');
    return savedTotalChars ? parseInt(savedTotalChars, 10) : 0;
  });
  const [overallWavesCompleted, setOverallWavesCompleted] = useState(() => {
    const savedWavesCompleted = localStorage.getItem('wavesCompleted');
    return savedWavesCompleted ? parseInt(savedWavesCompleted, 10) : 0;
  });
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isGameOverModalVisible, setIsGameOverModalVisible] = useState(false);

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
    }, 3500);
    
    return () => clearInterval(checkBugsInterval);
	}, []);
	
	useEffect(() => {
    const fetchUserID = async () => {
      try {
        const response = await fetch(`${getBackendUrl()}/api/getUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      const data = await response.json();
      setUserId(data.id);
    } catch (error) {
      console.error('Failed to fetch user data', error);
    }
	};
	
	fetchUserID();
}, []);
	
	useEffect(() => {
    console.log('Active Bug ID:', activeBug);
	}, [activeBug]);
	
	useEffect(() => {
    localStorage.setItem('score', score.toString());
	}, [score]);
	
	useEffect(() => {
	  if(gameOver && staticWPM === 0) {
	  
	    const endTime = new Date();
	    const elapsedTime = startTime ? (endTime.getTime() - startTime.getTime()) / 1000 : 0;
	    const sessionWPM = elapsedTime > 0 ? (totalWords / elapsedTime) * 60 : 0;
	    setStaticWPM(sessionWPM);
	    if(score > highScore) {
	      setHighScore(score);
	      localStorage.setItem('highScore', score.toString());
	    }
	    
	    setOverallCorrectCharacters(prev => {
        const newOverallCorrectChars = prev + correctChars;
        localStorage.setItem('correctChars', newOverallCorrectChars.toString());
        return newOverallCorrectChars;
	    });
	    
	    setOverallTotalChars(prev => {
        const newOverallTotalChars = prev + totalChars;
        localStorage.setItem('totalChars', newOverallTotalChars.toString());
        return newOverallTotalChars;
      });
      
      setOverallTotalWords(prev => {
        const newOverallTotalWords = prev + totalWords;
        localStorage.setItem('totalWords', newOverallTotalWords.toString());
        return newOverallTotalWords;
      });
      
      setOverallWavesCompleted(prev => {
        const newOverallWavesCompleted = prev + wavesCompleted;
        localStorage.setItem('wavesCompleted', newOverallWavesCompleted.toString());
        return newOverallWavesCompleted;
      });
      
      const overallAccuracy = (overallCorrectChars + correctChars) / (overallTotalChars + totalChars) * 100;
      if(sessionWPM > highestWpm) {
        setHighestWpm(sessionWPM);
        localStorage.setItem('highestWpm', sessionWPM.toString());
      }

      fetch(`${getBackendUrl()}/api/v1/user/update-player-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userId,
          score: score,
          highScore,
          wordsPerMinute: highestWpm,
          totalWordsTyped: overallTotalWords,
          accuracy: overallAccuracy,
          levelsCompleted: overallWavesCompleted,
        }),
      });

	    //alert(`Game Over!\nHigh Score: ${highScore}\nScore: ${score}\nAccuracy: ${accuracy.toFixed(2)}%\nWPM: ${wpm}`);
	    setIsGameOverModalVisible(true);
	    //navigate('/dashboard');
	  }
	}, [gameOver, overallCorrectChars, overallTotalChars]);
	
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
  
  const createIntersectionObserver = (bugElement: HTMLElement) => {
    const gameContainer = gameContainerRef.current;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          // Bug has gone off-screen
          if (gameContainer) {
            gameContainer.removeChild(bugElement);
          }
          setBugsReachedBottom(prev => {
            const newBugsReachedBottom = prev + 1;
            if (newBugsReachedBottom >= 5) {
              setGameOver(true);
            }
            return newBugsReachedBottom;
          });
          setBugs(prevBugs => prevBugs.filter(b => b.element !== bugElement));
          observer.unobserve(bugElement); // Stop observing the bug element
        }
      });
    }, {
      root: null, // Use the viewport as the root
      threshold: 0.0 // Trigger when the bug is completely out of view
    });
  
    observer.observe(bugElement);
  };
	
	const spawnBug = (line: string) => {
    const gameContainer = gameContainerRef.current;
    if (!gameContainer) return;
  
    const bugImages = [
      '/assets/tile007_scaled.png',
      '/assets/tile008_scaled.png',
      '/assets/tile009_scaled.png',
    ];
  
    const gameContainerWidth = gameContainer.offsetWidth;
    console.log('Game Container Width:', gameContainerWidth);
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
    console.log('Text Width:', textWidth);
    document.body.removeChild(tempBugText);
  
    const maxLeft = gameContainerWidth - textWidth;
  
    const maxAttempts = 100; // Prevent infinite loops
    let attempts = 0;
  
    do {
      leftPosition = Math.random() * (maxLeft - minLeft) + minLeft;
      isOverlapping = false;
  
      // Check for overlapping with existing bugs
      const existingBugs = gameContainer.getElementsByClassName('bug');
      for (let i = 0; i < existingBugs.length; i++) {
        const existingBug = existingBugs[i] as HTMLElement;
        const existingBugLeft = parseFloat(existingBug.style.left);
        const existingBugWidth = existingBug.offsetWidth;
  
        // Check horizontal overlap
        if (
          leftPosition < existingBugLeft + existingBugWidth &&
          leftPosition + textWidth > existingBugLeft
        ) {
          isOverlapping = true;
          break;
        }
      }
  
      attempts++;
    } while (isOverlapping && attempts < maxAttempts);
  
    // If max attempts are reached, log a warning
    if (attempts === maxAttempts) {
      console.warn('Could not find a non-overlapping position for the bug.');
    }
  
    // Create the bug element
    const bugElement = document.createElement('div');
    bugElement.className = 'bug';
    bugElement.style.left = `${leftPosition}px`;
    bugElement.style.backgroundImage = `url(${bugImages[Math.floor(Math.random() * bugImages.length)]})`;
  
    const bugText = document.createElement('div');
    bugText.className = 'bug-text';
    line.split('').forEach(char => {
      const spanElement = document.createElement('span');
      spanElement.textContent = char;
      bugText.appendChild(spanElement);
    });
  
    bugElement.appendChild(bugText);
    gameContainer.appendChild(bugElement);
    
    createIntersectionObserver(bugElement);
  
    // Add the bug to the state
    const bug: Bug = {
      id: uuidv4(),
      text: line,
      element: bugElement,
    };
  
    bugElement.dataset.id = bug.id.toString();
  
    setBugs(prevBugs => [...prevBugs, bug]);
  
    // Remove bug when animation ends
    bugElement.addEventListener('animationend', () => {
      gameContainer.removeChild(bugElement);
      setBugsReachedBottom(prev => {
        const newBugsReachedBottom = prev + 1;
        if(newBugsReachedBottom >= 5) {
          setGameOver(true);
        }
        return newBugsReachedBottom;
      })
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
          spans[currentIndex].classList.add('correct');
          currentIndex++;
      } else {
        spans[currentIndex].classList.remove('correct');
      }
      inputIndex++;
    }

    if (currentIndex === spans.length) {
      shootProjectile(activeBugElement);
      setTotalWords(prev => prev + 1);
      setCorrectChars(prev => prev + spans.length);
      setTotalChars(prev => prev + inputIndex);
      setTypedWord('');
      setScore(prev => prev + 10);
      setBugs(prevBugs => {
        const updatedBugs = prevBugs.filter(b => b.id !== (activeBugElement as HTMLElement).dataset.id);
        if (updatedBugs.length === 0) {
          setWaveCleared(true);
        }
        return updatedBugs;
      });
      setActiveBug(null);
    }
  }
}, [activeBug, startTime, setCorrectChars, ]);

  const handleCloseModel = () => {
    setIsGameOverModalVisible(false);
      navigate('/dashboard');
  }
  
  const calculateAccuracy = () => {
    return totalChars > 0 ? (correctChars / totalChars) * 100 : 0;
  }
  

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
        className="typing-input"
        spellCheck='false'
        autoFocus
        ref={inputRef}
        onBlur={() => inputRef.current?.focus()}
    />
    {isGameOverModalVisible && (
      <GameOverModel
        score={score}
        highScore={highScore}
        accuracy={calculateAccuracy()}
        wpm={parseFloat(staticWPM.toFixed(2))}
        onClose={handleCloseModel}
      />
    )}
    </div>
	);
}

export default Game;
