import React, { useState, useEffect } from 'react';
import GameCanvas from '../components/GameCanvas';
import ConsoleOutput from '../components/ConsoleOutput';
import CodeEditor from '../components/CodeEditor';
//import RunTestCase from './RunTestCase';
import '../css/puzzleLayout.css';
interface Entity {
	type: string;
	name: string;
}

const GameLevelOne: React.FC = () => {
  const [userOutput, setUserOutput] = useState('');
  const [gameInfo, setGameInfo] = useState('');
  const [code, setCode] = useState('');
  const [isGameLoopRunning, setIsGameLoopRunning] = useState(false);
  const [entities, setEntities] = useState<Entity[]>([
    { type: 'enemy', name: "X-Wing" },
	{ type: 'enemy', name: 'TIE-Fighter'},
	{ type: 'enemy', name: 'Star Destoryer'},
	{ type: 'enemy', name: 'Death Star'},
	{ type: 'enemy', name: 'AT-AT'},
	{ type: 'enemy', name: 'Millenium Falcon'},
	{ type: 'enemy', name: 'Nebulon-B'},
	{ type: 'enemy', name: 'U-Wing'},
  ]);

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
    <div className="container-puzzle">
      <div className="top-left">
        <GameCanvas />
        </div>
        <div className="bottom-left">
        <ConsoleOutput userOutput={userOutput} gameInfo={gameInfo} />
      </div>
      <div className="top-right">
        <CodeEditor language="javascript" theme="monokai" onRunCode={handleRunCode} />
      </div>
    </div>
  );
};

export default GameLevelOne;