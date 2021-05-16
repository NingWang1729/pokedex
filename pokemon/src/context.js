import React from "react";

const LoginContext = React.createContext(
    { 
        credentials : {username : "", password : "", token : "", userid : "" },
        updateLogin : (new_username, new_password, new_token, userid) => {},
    });
export default LoginContext;