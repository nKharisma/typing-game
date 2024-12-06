import React from 'react';

interface ConsoleOutputProps {
	userOutput: string;
	gameInfo: string;
}

const ConsoleOutput: React.FC<ConsoleOutputProps> = ({ userOutput, gameInfo }) => {
	return (
		<div>
			<h3>Console Output</h3>
			<h5>User Output: </h5>
			<pre>{userOutput}</pre>
			<h5>Game Information</h5>
			<pre>{gameInfo}</pre>
		</div>
	);
};

export default ConsoleOutput;