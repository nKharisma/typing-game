import React, { useState, useEffect } from 'react';
import GameCanvas from './GameCanvas';
import ConsoleOutput from '../components/ConsoleOutput';
import CodeEditor from '../components/CodeEditor';
import RunTestCase from './RunTestCase';
import './styles.css';

const PuzzlePage: React.FC = () => {
  const [userOutput, setUserOutput] = useState('');
  const [gameInfo, setGameInfo] = useState('');
  const [code, setCode] = useState('');
  const [isGameLoopRunning, setIsGameLoopRunning] = useState(false);

  const handleRunCode = async (code: string) => {
    try {
      const response = await fetch('/api/v1/user/compile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: 'javascript',
          code,
        }),
      });
      const data = await response.json();
      setUserOutput(data.output || data.error);
    } catch (error) {
      setUserOutput('Error executing code');
    }
  };

  const handleRunTestCase = () => {
    setIsGameLoopRunning(true);
  };
  
  useEffect(() => {
    if (isGameLoopRunning) {
        const newGameInfo = 'Game information:\n';
        setGameInfo(newGameInfo);
    }
  })

  return (
    <div className="container">
      <div className="top-section">
        <GameCanvas />
        <ConsoleOutput userOutput={userOutput} gameInfo={gameInfo} />
      </div>
      <div className="bottom-section">
        <CodeEditor language="javascript" theme="monokai" onRunCode={handleRunCode} />
        <RunTestCase onRunTestCase={handleRunTestCase} />
      </div>
    </div>
  );
};

export default PuzzlePage;