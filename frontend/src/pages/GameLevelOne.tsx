import React, { useState, useEffect } from 'react';
import ConsoleOutput from '../components/ConsoleOutput';
import CodeEditor from '../components/CodeEditor';
import GameDescription from '../components/GameDescription';
import getBackendUrl from '../utils/getBackendUrl';
import '../css/puzzleLayout.css';

const GameLevelOne: React.FC = () => {
  const [userOutput, setUserOutput] = useState('');
  const [expectedOutput, setExpectedOutput] = useState('');

  useEffect(() => {
    const getExpectedOutput = async () => {
      try {
        const response = await fetch(`${getBackendUrl()}/api/v1/user/get-expected-output`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'variables',
          }),
        });
        const data = await response.json();
        setExpectedOutput(data.output || data.error);
      } catch (error) {
        setExpectedOutput('Error contacting server...');
      }
    };
    getExpectedOutput();
  }, []);

  const handleRunCode = async (code: string) => {
    try {
      const response = await fetch(`${getBackendUrl()}/api/v1/user/compile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: 'java',
          name: 'variables',
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
        <GameDescription language="java" filename="Variables"/>
      </div>
        <div className="bottom-left">
        <ConsoleOutput expectedOutput={expectedOutput} userOutput={userOutput} />
      </div>
      <div className="right">
        <CodeEditor language="java" theme="monokai" filename="Variables" onRunCode={handleRunCode} />
      </div>
    </div>
  );
};

export default GameLevelOne;
