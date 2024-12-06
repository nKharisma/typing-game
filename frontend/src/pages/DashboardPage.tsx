import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import getBackendUrl from "../utils/getBackendUrl";
import '../css/dashboard.css';

export default function DashboardPage()
{
	const [input, setInput] = useState('');
	const [output, setOutput] = useState<string[]>([]);
	const [userName, setUserName] = useState('');
	const navigate = useNavigate();
	
	useEffect(() => {
		const getUsername = async () => {
      const authToken = localStorage.getItem('authToken');
			if (!authToken) {
				console.error('Auth token not found');
				return;
			}
			
			try {
				const response = await fetch(`${getBackendUrl()}/api/getUser`, {
					method: 'POST',
					headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
					},
				});
				const data = await response.json();
				if(response.ok) {
          console.log(data);
					setUserName(data.lastName.toLowerCase() + data.firstName.toLowerCase()[0]);
				}else {
					console.error('Error fetching user data');
				}
			} catch (error) {
				console.error('Failed to fetch user data', error);
			}
		}
		
		getUsername();
	}, []);
	
	const menuOptions = [
		{ option: 'play game', description: '1', text: 'play game', location: '/dashboard/pre-game' },
		{ option: 'leaderboard', description: '2', text: 'leaderboard', location: '/leaderboard' },
		{ option: 'profile', description: '3', text: 'profile', location: '/dashboard/profile' },
		{ option: 'about', description: '4', text: 'about', location: '/about' },
	];
	
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInput(e.target.value);
	};
	
	const handleInputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault(); 
		handleOption(input.trim().toLowerCase());
		setInput('');
	};
	
	const handleOption = (option: string) => {
		switch (option) {
      case '1':
			case 'play game':
				setOutput([...output, 'Starting a new game...']);
				navigate('/dashboard/pre-game');
				break;
      case '2':
			case 'leaderboard':
				setOutput(['Navigating to leaderboard...']);
				navigate('/leaderboard');
				break;
      case '3':
			case 'profile':
				setOutput(['Navigating to profile...']);
				navigate('/dashboard/profile');
				break;
      case '4':
			case 'about':
				setOutput(['Navigating to about ...']);
				navigate('/about');
				break;
			default:
				setOutput(['Invalid option']);
				break;
		}
	};
	
	return (
		<div className='container'>
        <div className='terminal-wrapper'>
	        <div className='terminal-container'>
	        <span className='welcome-message'>{userName}:~$ click or type an option below to start</span>
			  <div className='terminal-header'>main.tsx</div>
			  <div className="menuOptions">
        {menuOptions.map((option) => (
          <div className="menu-option" onClick={() => navigate(option.location)} key={option.option}>
            <span className="menu-number">{option.description}</span>
            <span className="menu-text">{option.text}</span>
          </div>
        ))}
      </div>
      <div className='output-results'>
        {output.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
      <form onSubmit={handleInputSubmit} className='terminal-form'>
			  <img  className="terminal-dash" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAALFJREFUSEvt1MERwjAMBMBTJ5QSOoFKSCeUAp1AJxc0k0ceYSLpPJiH88kjnqznfLKh02OdXAz4Z8mPqP83apITgDuAs5m9qztNnTHJE4DXijlaxlOwgyTnz+um4mm4FV6CW+BlWMUlWMFbwD5al03Zrmb2PBozCSZZQn1TZVhBy7CKluAWaBpe7+lHtkh7RUufMUlvsF+ZofZ+a3caPhqT6PcBR5OS142o5QijP+gW9QIRTVIf9c6pFgAAAABJRU5ErkJggg==" alt="dash"/>
				<input className='terminal-input'
				  type="text"
				  value={input}
				  onChange={handleInputChange}
				  title="Input"
				 />
	          </form>
	        </div>
	        </div>
		</div>
	);
}
