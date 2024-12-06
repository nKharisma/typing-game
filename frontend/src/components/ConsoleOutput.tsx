import React from 'react';

interface ConsoleOutputProps {
  expectedOutput: string;
	userOutput: string;
}

const ConsoleOutput: React.FC<ConsoleOutputProps> = ({ expectedOutput, userOutput }) => {
	return (
		<div>
			<h4>Expected Output</h4>
			<p>{expectedOutput}</p>
      <br/>
			<h4>User Output</h4>
			<p>{userOutput}</p>
		</div>
	);
};

export default ConsoleOutput;
