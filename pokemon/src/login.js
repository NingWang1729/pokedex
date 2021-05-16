import React, { useState, useEffect, Fragment } from 'react';
import { useHistory } from "react-router-dom";
import LoginContext from './context';

function Login () {
    // Better than react hooks imo
    const context = React.useContext(LoginContext);
    let history = useHistory();
    function gotopoketch () {
        history.push("/poketch");
    }
    // Login function
    async function login (e) {
        console.log("Username:", context.credentials.username);
        console.log("Password: ", context.credentials.password);
        
        fetch("http://127.0.0.1:8000/auth/", {
            method : 'POST',
            headers : { 'Content-Type' : 'application/json' },
            body : JSON.stringify({ username : context.credentials.username, password : context.credentials.password })
        })
        .then(
            (res) => {
                if (res.ok) {
                    alert("Logged In!");
                    console.log("Valid credentials");
                } else {
                    throw new Error('Network response was not ok.');
                }
                return res.json();
            }
        )
        .then(
            (data) => {
                console.log(data.token);
                context.updateLogin(context.credentials.username, context.credentials.password, data.token, data.userid);
                gotopoketch();
            }
        ).catch(
            (error) => {
                alert("INVALID USERNAME OR PASSWORD!");
                console.log(error);
            }
        );
    }

    async function signup() {
        console.log("Username:", context.credentials.username);
        console.log("Password: ", context.credentials.password);

        fetch("http://127.0.0.1:8000/api/users/", {
            method : 'POST',
            headers : { 'Content-Type' : 'application/json' },
            body : JSON.stringify({ username : context.credentials.username, password : context.credentials.password })
        })
        .then(
            (res) => {
                if (res.ok) {
                    alert("Signed Up!");
                    console.log("Created new user!");
                } else {
                    throw new Error('Network response was not ok.');
                }
                return res.json();
            }
        )
        .then(
            (data) => {console.log(data)}
        ).catch(
            (error) => {
                alert("Username already taken! Please try again.");
                console.log(error);
            }
        );
    }

    return (
        <Fragment>
            <h1>Login:</h1>
            <label>
                Username:
                <input 
                    type="text" 
                    name="username" 
                    value={context.credentials.username} 
                    onChange={(event) => {context.updateLogin(event.target.value, context.credentials.password, context.credentials.token, context.credentials.userid);}}
                />
            </label>
            <label>
                Password:
                <input 
                    type="text" 
                    name="password" 
                    value={context.credentials.password} 
                    onChange={(event) => {context.updateLogin(context.credentials.username, event.target.value, context.credentials.token, context.credentials.userid);}}
                />
            </label>
            <button onClick={login}>Log in</button>
            <button onClick={signup}>Sign up</button>
        </Fragment>
    );
}

// Default export
export default Login;