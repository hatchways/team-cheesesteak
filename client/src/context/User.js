import React, {useState, useEffect, Children} from 'react';
import {Redirect, Route, BrowserRouter} from 'react-router-dom';
import SignInPage from '../pages/SignIn';
export const getUserData = async () => {
  const response = await fetch('/auth/get_user_info');
  const data = await response.json();
  if (data.redirect !== true) {
    return data.user;
  } else {
    return 'redirect';
  }
};

export const logOut = async () => {
  const response = await fetch('/auth/logout');
  const data = await response.json();
  return data.message;
};


export const UserProvider = ({children}) => {
  const [user, setUser] = useState('');
  const [redirect, setRedirect] = useState("");

  useEffect(() => {
    async function getUserData() {
      const response = await fetch('/auth/get_user_info');
      const data = await response.json();
      if (data.redirect !== true) {
        setUser(data.user);
      } else {
        setUser('redirect');
      }
    }
    getUserData();
  }, []);
  const {Provider} = UserContext;
  if (user === '') {
    return <span>Loading...</span>;
  }if (user == "redirect"){
    //Redirect the user somehow
    return null
  }
  else {
    console.log('User is provided');
    return <Provider value={{user}}>{children}</Provider>;
  }
};

const UserContext = React.createContext();

//export const UserProvider = UserContext.Provider;
export const UserConsumer = UserContext.Consumer;

export default UserContext;

