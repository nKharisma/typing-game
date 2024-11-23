import React, { useEffect, useRef, useState } from 'react';
import '../css/game.css';

interface Bug {
  id: number;
  text: string;
  element: HTMLElement;
}



function Game() {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [typedWord, setTypedWord] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  /*
  const playerShipRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [totalWords, setTotalWords] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

*/
  useEffect(() => {
    const gameContainer = gameContainerRef.current;
    if (!gameContainer) return;

    const bugs: Bug[] = [];

    const spawnBug = () => {
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
        id: Date.now(), 
        text: word,
        element: bugElement,
    };

    bugs.push(bug);

      // Remove the bug when the animation ends
    bugElement.addEventListener('animationend', () => {
        gameContainer.removeChild(bugElement);
        const index = bugs.findIndex(b => b.id === bug.id);
        if (index !== -1) {
        bugs.splice(index, 1);
        }
    });
    };

    const spawnInterval = setInterval(spawnBug, 5000); // Adjust the spawn interval as needed

    return () => clearInterval(spawnInterval);
	}, []);

	useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // Focus the input element when the component mounts
    }
	}, []);
	
	/*const updateStatsInDatabase = async () => {
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

    const bugs = Array.from(gameContainer.getElementsByClassName('bug')) as HTMLElement[];
    bugs.forEach(bugElement => {
    const bugText = bugElement.querySelector('.bug-text') as HTMLElement;
        if(bugText) {
            const spans = Array.from(bugText.children) as HTMLElement[];
            let currentIndex = 0;
            let inputIndex = 0;
            
			while (inputIndex < input.length && currentIndex < spans.length) {
				if (input[inputIndex] === spans[currentIndex].textContent) {
				spans[currentIndex].classList.add('correct');
				currentIndex++;
				//setScore(prevScore => prevScore + 1);
				} else {
				spans[currentIndex].classList.remove('correct');
				}
				inputIndex++;
			}

			  // Check if the entire word is typed correctly
			if (currentIndex === spans.length) {
        gameContainer.removeChild(bugElement);
        setTypedWord('');
        }
        //setTotalWords(prevTotalWords => prevTotalWords + 1);
        //setTotalChars(prevTotalChars => prevTotalChars + spans.length);
      }
    });
        
      if(inputRef.current) {
        inputRef.current.value = '';
      }
	};
	
	/*
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