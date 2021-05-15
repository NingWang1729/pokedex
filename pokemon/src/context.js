import React from "react";

const LoginContext = React.createContext(
    { 
        credentials : {username : "", password : "", token : "" },
        updateLogin : (new_username, new_password, new_token) => {},
    });
export default LoginContext;