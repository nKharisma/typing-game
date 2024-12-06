import React, { useState, useEffect } from 'react';
import ConsoleOutput from '../components/ConsoleOutput';
import CodeEditor from '../components/CodeEditor';
import GameDescription from '../components/GameDescription';
import getBackendUrl from '../utils/getBackendUrl';
import '../css/puzzleLayout.css';

const GameLevelOne: React.FC = () => {
  const [userOutput, setUserOutput] = useState('');
  const [expectedOutput, setExpectedOutput] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const getExpectedOutput = async () => {
      try {
        const response = await fetch(`${getBackendUrl()}/api/v1/user/get-expected-output`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'arrays',
          }),
        });
        const data = await response.json();
        setExpectedOutput(data.expected || data.error);
      } catch (error) {
        setExpectedOutput('Error contacting server...');
      }
    };
    getExpectedOutput();
  }, []);

  const handleRunCode = async (code: string) => {
    setStatus('Testing...');
    try {
      const response = await fetch(`${getBackendUrl()}/api/v1/user/compile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: 'java',
          name: 'arrays',
          code: code,
        }),
      });
      const data = await response.json();
      setUserOutput(data.output || data.error);
      setStatus(data.status);
    } catch (error) {
      setStatus('Error...');
      setUserOutput('Error executing code');
    }
  };

  return (
    <div className="container-puzzle">
      <div className="top-left">
        <GameDescription language="java" filename="Arrays"/>
      </div>
        <div className="bottom-left">
        <ConsoleOutput expectedOutput={expectedOutput} userOutput={userOutput} status={status} />
      </div>
      <div className="right">
        <CodeEditor language="java" initialTheme="twilight" filename="Arrays" onRunCode={handleRunCode} />
      </div>
    </div>
  );
};

export default GameLevelOne;
