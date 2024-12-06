import React from 'react';

interface ConsoleOutputProps {
	userOutput: string;
}

const ConsoleOutput: React.FC<ConsoleOutputProps> = ({ userOutput }) => {
	return (
		<div>
			<h3>Console Output</h3>
			<pre>{userOutput}</pre>
		</div>
	);
};

export default ConsoleOutput;
