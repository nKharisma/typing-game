import React from 'react';
import '../css/ConsoleContainer.css'

interface ConsoleOutputProps {
  expectedOutput: string;
	userOutput: string;
  status: string;
}

const ConsoleOutput: React.FC<ConsoleOutputProps> = ({ expectedOutput, userOutput, status }) => {
	return (
		<div className='console-container'>
      <div className='console-container-top'>
        <h4>Expected Output:</h4>
        <h4 className={`console-container-status ${status==='PASS'?'pass':status==='FAIL'?'fail':''}`}>
          {status}
        </h4>
      </div>
			<p>{expectedOutput}</p>
      <br/>
			<h4>User Output:</h4>
			<p>{userOutput}</p>
		</div>
	);
};

export default ConsoleOutput;
