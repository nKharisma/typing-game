import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/login.css';

function Login()
{

    const app_name = 'typecode.app'
    function buildPath(route:string) : string
    {
        if (process.env.NODE_ENV != 'development') 
        {
            return 'http://' + app_name +  ':5000/' + route;
        }
        else
        {        
            return 'http://localhost:5000/' + route;
        }
    }

  const [message,setMessage] = useState('');
  const [loginName,setLoginName] = React.useState('');
  const [loginPassword,setPassword] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('login');

    async function doLogin(event: React.FormEvent<HTMLFormElement>) : Promise<void>
    {
        event.preventDefault();

        const obj = {login:loginName,password:loginPassword};
        const js = JSON.stringify(obj);
  
        try
        {    
            const response = await fetch(buildPath('api/login'),
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});
  
            const res = JSON.parse(await response.text());
  
            if( res.id <= 0 )
            {
                setMessage('User/Password combination incorrect');
            }
            else
            {
                const user = {firstName:res.firstName,lastName:res.lastName,id:res.id}
                localStorage.setItem('user_data', JSON.stringify(user));
  
                setMessage('');
                window.location.href = '/cards';
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
      };

    function handleSetLoginName( e: React.ChangeEvent<HTMLInputElement> ) : void
    {
      setLoginName( e.target.value );
    }

    function handleSetPassword( e: React.ChangeEvent<HTMLInputElement> ) : void
    {
      setPassword( e.target.value );
    }
    
    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    }

    return(
    /*
      <div id="loginDiv">
        <span id="inner-title">PLEASE LOG IN</span><br />
        Login: <input type="text" id="loginName" placeholder="Username" 
          onChange={handleSetLoginName} /><br />
        Password: <input type="password" id="loginPassword" placeholder="Password" 
          onChange={handleSetPassword} />
        <input type="submit" id="loginButton" className="buttons" value = "Do It"
          onClick={doLogin} />
        <span id="loginResult">{message}</span>
     </div> */
     
     <div className="container">
        <section className="wrapper">
            <div id='star1'></div>
            <div id='star2'></div>
            <div id='star3'></div>
        </section>
        <div className="login-container">
            <div className="tabs-container">
            <ul className="tabs">
                <li className={`tab-container ${activeTab === 'login' ? 'tab-container-active' : ''}`}
                    onClick={() => handleTabClick('login')}>
                    <Link to="/sign-in">login.tsx</Link>
                    <img className={`tab-x ${activeTab === 'login' ? 'tab-x-active' : 'tab-x-inactive'}`} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAPZJREFUSEvtld0NwjAMhO82gU3oJNBJGAWYBDahmxhZaqSqSmwnrYCH5DXtfb3zT4kfHf6Iiw7+WvI96v+JWkQOAK4AHiRf1peJyAnAjeTRc+DWWESeAFRwAjCW4DNUn9UzefAI+KIukmAOvoLqo4OXjgtWFREpwlugqhkCl+BzCinekNNU+zC4ANfGS8eNd9lwVeAMvAlaFXUiZGpqdntprKocZ6BJtxoeBue6F4DW2By1TY6tkbFGzdperuPInLbAI+D3HKk5pyv4neS41bHWUZdEcU8vOl433JnksPkn4Qm03rtRtwp773Wwl9Bu9z3q3aL0hD7cmHgfrAf2RwAAAABJRU5ErkJggg==" alt="x-icon"/></li>
                <li className={`tab-container ${activeTab === 'register' ? 'tab-container-active' : ''}`}
                    onClick={() => handleTabClick('register')}>
                <Link to="/sign-up">register.tsx</Link>
                <img className={`tab-x ${activeTab === 'register' ? 'tab-x-active' : 'tab-x-inactive'}`} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAPZJREFUSEvtld0NwjAMhO82gU3oJNBJGAWYBDahmxhZaqSqSmwnrYCH5DXtfb3zT4kfHf6Iiw7+WvI96v+JWkQOAK4AHiRf1peJyAnAjeTRc+DWWESeAFRwAjCW4DNUn9UzefAI+KIukmAOvoLqo4OXjgtWFREpwlugqhkCl+BzCinekNNU+zC4ANfGS8eNd9lwVeAMvAlaFXUiZGpqdntprKocZ6BJtxoeBue6F4DW2By1TY6tkbFGzdperuPInLbAI+D3HKk5pyv4neS41bHWUZdEcU8vOl433JnksPkn4Qm03rtRtwp773Wwl9Bu9z3q3aL0hD7cmHgfrAf2RwAAAABJRU5ErkJggg==" alt="x-icon"/></li>
            </ul>
            </div>
            <div className="login-form">
                <h2>Login Below</h2>
                <form onSubmit={doLogin}>
                    <div className="input-group">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAALFJREFUSEvt1MERwjAMBMBTJ5QSOoFKSCeUAp1AJxc0k0ceYSLpPJiH88kjnqznfLKh02OdXAz4Z8mPqP83apITgDuAs5m9qztNnTHJE4DXijlaxlOwgyTnz+um4mm4FV6CW+BlWMUlWMFbwD5al03Zrmb2PBozCSZZQn1TZVhBy7CKluAWaBpe7+lHtkh7RUufMUlvsF+ZofZ+a3caPhqT6PcBR5OS142o5QijP+gW9QIRTVIf9c6pFgAAAABJRU5ErkJggg==" alt="dash-arrow"/>
                        <input type="text" placeholder="Username" required onChange={handleSetLoginName} />
                    </div>
                    <div className="input-group">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAALFJREFUSEvt1MERwjAMBMBTJ5QSOoFKSCeUAp1AJxc0k0ceYSLpPJiH88kjnqznfLKh02OdXAz4Z8mPqP83apITgDuAs5m9qztNnTHJE4DXijlaxlOwgyTnz+um4mm4FV6CW+BlWMUlWMFbwD5al03Zrmb2PBozCSZZQn1TZVhBy7CKluAWaBpe7+lHtkh7RUufMUlvsF+ZofZ+a3caPhqT6PcBR5OS142o5QijP+gW9QIRTVIf9c6pFgAAAABJRU5ErkJggg==" alt="dash-arrow"/>
                        <input type="password" placeholder="Password" required onChange={handleSetPassword} />
                    </div>
                    <button type="submit" className="btn">Login</button>
                    <span id="loginResult">{message}</span>
                </form>
            </div>
        </div>
     </div>
    );
};

export default Login;