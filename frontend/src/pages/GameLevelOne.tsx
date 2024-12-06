import React, { useState, } from 'react';
import ConsoleOutput from '../components/ConsoleOutput';
import CodeEditor from '../components/CodeEditor';
import GameDescription from '../components/GameDescription';
import '../css/puzzleLayout.css';

const GameLevelOne: React.FC = () => {
  const [userOutput, setUserOutput] = useState('');

  const handleRunCode = async (code: string) => {
    try {
      const response = await fetch('/api/v1/user/compile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: 'javascript',
          names: "variables",
          code: code,
        }),
      });
      const data = await response.json();
      setUserOutput(data.output || data.error);
    } catch (error) {
      setUserOutput('Error executing code');
    }
  };

  return (
    <div className="container-puzzle">
      <div className="top-left">
        <GameDescription language="javascript" filename="variables"/>
      </div>
        <div className="bottom-left">
        <ConsoleOutput userOutput={userOutput} />
      </div>
      <div className="right">
        <CodeEditor language="javascript" theme="monokai" filename="variables" onRunCode={handleRunCode} />
      </div>
    </div>
  );
};

export default GameLevelOne;
