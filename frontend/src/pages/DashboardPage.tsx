import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../contexts/AuthContext';
import '../css/dashboard.css';

export default function DashboardPage()
{
	function buildPath(route:string) : string
  {
    const { hostname } = window.location;

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000/' + route; // Set to your localhost backend URL
    } else {
      return 'https://typecode.app/' + route; // Set to your production backend URL
    }
  }

	const [input, setInput] = useState('');
	const [output, setOutput] = useState<string[]>([]);
	const [userName, setUserName] = useState('');
	const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
	
	useEffect(() => {
		const getUsername = async () => {
			// const userData = localStorage.getItem('user_data');
			// if (!userData) {
			// 	console.error('User data not found');
			// 	return;
			// }
			// 
			// const user = JSON.parse(userData);
			// const userId = user.id;
    
      const authToken = localStorage.getItem('authToken');
			
			try {
				// const response = await fetch(buildPath('api/getUser'), {
				// 	method: 'POST',
				// 	headers: {
				// 	'Content-Type': 'application/json',
				// 	},
				// 	body: JSON.stringify({ id: userId }),
				// });
				const response = await fetch(buildPath('api/getUser'), {
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
		{ option: 'new game', description: '1', text: 'new game' },
		{ option: 'settings', description: '2', text: 'settings' },
		{ option: 'about us', description: '3', text: 'about us' },
		{ option: 'logout', description: '4', text: 'logout' }
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
			case 'new game':
				setOutput([...output, 'Starting a new game...']);
				navigate('/dashboard/new-game');
				break;
      case '2':
			case 'settings':
				setOutput(['Navigating to settings...']);
				navigate('/settings');
				break;
      case '3':
			case 'about us':
				setOutput(['Navigating to about us...']);
				navigate('/about-us');
				break;
      case '4':
			case 'logout':
				setOutput(['Logging out...']);
        logout();
				navigate('/');
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
	        <span className='welcome-message'>{userName}:~$ type an option below to start</span>
			  <div className='terminal-header'>main.tsx</div>
			  <div className="menuOptions">
        {menuOptions.map((option) => (
          <div key={option.option}>
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
