import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/register.css';

function Register()
{
	const app_name = 'typecode.app'
	function buildPath(route:string) : string
	{
		if (process.env.NODE_ENV != 'development') 
		{
			return `https://${app_name}/${route}`;
		}
		else
		{        
			return 'http://localhost:5000/' + route;
		}
	}

	const [message,setMessage] = useState('');
	const [loginName,setLoginName] = React.useState('');
	const [loginPassword,setPassword] = React.useState('');
	const [firstName,setFirstName] = React.useState('');
	const [lastName,setLastName] = React.useState('');
	const [email,setEmail] = React.useState('');
	const [activeTab, setActiveTab] = React.useState('register');
	const navigate = useNavigate();

	async function doRegister(event: React.FormEvent<HTMLFormElement>) : Promise<void>
	{
		event.preventDefault();

		const obj = {login:loginName,password:loginPassword,firstName:firstName,lastName:lastName,email:email};
		const js = JSON.stringify(obj);
  
		try
		{    
			const response = await fetch(
        buildPath('api/signup'),
				{
          method:'POST',
          body:js,
          headers:{'Content-Type': 'application/json'}
        }
      );
  
			const res = JSON.parse(await response.text());
  
			if( res.error )
			{
				setMessage('Username taken');
			}
			else
			{
				const user = {firstName:res.firstName,lastName:res.lastName,id:res.id}
				localStorage.setItem('user_data', JSON.stringify(user));
  
				setMessage('');
				window.location.href = '/login';
			}
		}
		catch(error: unknown)
		{
			if (error instanceof Error) {
				alert(error.toString());
			} else {
				alert('An unknown error occurred');
			}
			return;
		}
	}
	
	function handleInputChange(setter: React.Dispatch<React.SetStateAction<string>>): (e: React.ChangeEvent<HTMLInputElement>) => void {
		return (e: React.ChangeEvent<HTMLInputElement>) => {
			setter(e.target.value);
		};
	}
	
	const handleTabClick = (tab: string) => {
        setActiveTab(tab);
        if (tab === 'login') {
            navigate('/sign-in');
        }
    }

	return (
		<div className='register-container'>
			<ul className='tabs'>
				<li className={`tab-container ${activeTab === 'login' ? 'tab-container-active' : ''}`}
					onClick={() => handleTabClick('login')}>
					<Link to="/sign-in">login.tsx</Link>
					<img className={`tab-x ${activeTab === 'login' ? 'tab-x-active' : 'tab-x-inactive'}`} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAPZJREFUSEvtld0NwjAMhO82gU3oJNBJGAWYBDahmxhZaqSqSmwnrYCH5DXtfb3zT4kfHf6Iiw7+WvI96v+JWkQOAK4AHiRf1peJyAnAjeTRc+DWWESeAFRwAjCW4DNUn9UzefAI+KIukmAOvoLqo4OXjgtWFREpwlugqhkCl+BzCinekNNU+zC4ANfGS8eNd9lwVeAMvAlaFXUiZGpqdntprKocZ6BJtxoeBue6F4DW2By1TY6tkbFGzdperuPInLbAI+D3HKk5pyv4neS41bHWUZdEcU8vOl433JnksPkn4Qm03rtRtwp773Wwl9Bu9z3q3aL0hD7cmHgfrAf2RwAAAABJRU5ErkJggg==" alt="x-icon"/>
				</li>
				<li className={`tab-container ${activeTab === 'register' ? 'tab-container-active' : ''}`}
                    onClick={() => handleTabClick('register')}>
                <Link to="/sign-up">register.tsx</Link>
                <img className={`tab-x ${activeTab === 'register' ? 'tab-x-active' : 'tab-x-inactive'}`} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAPZJREFUSEvtld0NwjAMhO82gU3oJNBJGAWYBDahmxhZaqSqSmwnrYCH5DXtfb3zT4kfHf6Iiw7+WvI96v+JWkQOAK4AHiRf1peJyAnAjeTRc+DWWESeAFRwAjCW4DNUn9UzefAI+KIukmAOvoLqo4OXjgtWFREpwlugqhkCl+BzCinekNNU+zC4ANfGS8eNd9lwVeAMvAlaFXUiZGpqdntprKocZ6BJtxoeBue6F4DW2By1TY6tkbFGzdperuPInLbAI+D3HKk5pyv4neS41bHWUZdEcU8vOl433JnksPkn4Qm03rtRtwp773Wwl9Bu9z3q3aL0hD7cmHgfrAf2RwAAAABJRU5ErkJggg==" alt="x-icon"/>
                </li>
			</ul>
			<div className='register-form'>
				<form onSubmit={doRegister}>
				<h1>Register Below</h1>
					<div className="input-group">
						<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAALFJREFUSEvt1MERwjAMBMBTJ5QSOoFKSCeUAp1AJxc0k0ceYSLpPJiH88kjnqznfLKh02OdXAz4Z8mPqP83apITgDuAs5m9qztNnTHJE4DXijlaxlOwgyTnz+um4mm4FV6CW+BlWMUlWMFbwD5al03Zrmb2PBozCSZZQn1TZVhBy7CKluAWaBpe7+lHtkh7RUufMUlvsF+ZofZ+a3caPhqT6PcBR5OS142o5QijP+gW9QIRTVIf9c6pFgAAAABJRU5ErkJggg==" alt="dash-arrow"/>
						<input type="text" id="firstName" placeholder="First Name" value={firstName} onChange={handleInputChange(setFirstName)} />
					</div>
					<div className="input-group">
						<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAALFJREFUSEvt1MERwjAMBMBTJ5QSOoFKSCeUAp1AJxc0k0ceYSLpPJiH88kjnqznfLKh02OdXAz4Z8mPqP83apITgDuAs5m9qztNnTHJE4DXijlaxlOwgyTnz+um4mm4FV6CW+BlWMUlWMFbwD5al03Zrmb2PBozCSZZQn1TZVhBy7CKluAWaBpe7+lHtkh7RUufMUlvsF+ZofZ+a3caPhqT6PcBR5OS142o5QijP+gW9QIRTVIf9c6pFgAAAABJRU5ErkJggg==" alt="dash-arrow"/>
						<input type="text" id="lastName" placeholder="Last Name" value={lastName} onChange={handleInputChange(setLastName)} />
					</div>
					<div className="input-group">
						<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAALFJREFUSEvt1MERwjAMBMBTJ5QSOoFKSCeUAp1AJxc0k0ceYSLpPJiH88kjnqznfLKh02OdXAz4Z8mPqP83apITgDuAs5m9qztNnTHJE4DXijlaxlOwgyTnz+um4mm4FV6CW+BlWMUlWMFbwD5al03Zrmb2PBozCSZZQn1TZVhBy7CKluAWaBpe7+lHtkh7RUufMUlvsF+ZofZ+a3caPhqT6PcBR5OS142o5QijP+gW9QIRTVIf9c6pFgAAAABJRU5ErkJggg==" alt="dash-arrow"/>
						<input type="text" id="email" placeholder="Email" value={email} onChange={handleInputChange(setEmail)} />
					</div>
					<div className="input-group">
						<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAALFJREFUSEvt1MERwjAMBMBTJ5QSOoFKSCeUAp1AJxc0k0ceYSLpPJiH88kjnqznfLKh02OdXAz4Z8mPqP83apITgDuAs5m9qztNnTHJE4DXijlaxlOwgyTnz+um4mm4FV6CW+BlWMUlWMFbwD5al03Zrmb2PBozCSZZQn1TZVhBy7CKluAWaBpe7+lHtkh7RUufMUlvsF+ZofZ+a3caPhqT6PcBR5OS142o5QijP+gW9QIRTVIf9c6pFgAAAABJRU5ErkJggg==" alt="dash-arrow"/>
						<input type="text" id="loginName" placeholder="Username" value={loginName} onChange={handleInputChange(setLoginName)} />
					</div>
					<div className="input-group">
						<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAALFJREFUSEvt1MERwjAMBMBTJ5QSOoFKSCeUAp1AJxc0k0ceYSLpPJiH88kjnqznfLKh02OdXAz4Z8mPqP83apITgDuAs5m9qztNnTHJE4DXijlaxlOwgyTnz+um4mm4FV6CW+BlWMUlWMFbwD5al03Zrmb2PBozCSZZQn1TZVhBy7CKluAWaBpe7+lHtkh7RUufMUlvsF+ZofZ+a3caPhqT6PcBR5OS142o5QijP+gW9QIRTVIf9c6pFgAAAABJRU5ErkJggg==" alt="dash-arrow"/>
						<input type="password" id="loginPassword" placeholder="Password" value={loginPassword} onChange={handleInputChange(setPassword)} />
					</div>
						<button type="submit" className='btn'>Register</button>
						<span id="registerResult">{message}</span>
				</form>
			</div>
		</div>
	);
}

export default Register;
