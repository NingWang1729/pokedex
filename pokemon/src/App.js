import {BrowserRouter, Route, Switch} from 'react-router-dom';
import LoginContext from './context';
import Login from './login';
import Poketch from './poketch';
import './App.css';
import { useState } from 'react';

function App() {

  const [credentials, setcredentials] = useState({username : "", password : "", token : "", userid : "" })
  const updateLogin = (new_username, new_password, new_token, new_userid) => {
    setcredentials({username : new_username, password : new_password, token : new_token, userid : new_userid})
  }
  return (
    <div className="App">
      <header className="App-header">
      <LoginContext.Provider value={{credentials, updateLogin}}>
        <p>Username: {credentials.username}</p>
        <p>Password: {credentials.password}</p>
        <p>Token: {credentials.token}</p>
        <p>User_id: {credentials.userid}</p>
        <BrowserRouter basename={window.location.path || ''}>
          <Switch>
            <Route path="/" exact={true} component={Login}/>
            <Route path="/login" exact={true} component={Login}/>
            <Route path="/poketch" exact={true} component={Poketch}/>
          </Switch>
        </BrowserRouter>
      </LoginContext.Provider>
        
      </header>
    </div>
  );
}

export default App;
