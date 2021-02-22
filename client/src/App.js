import React, {useState, useEffect, useContext} from 'react';
import {MuiThemeProvider} from '@material-ui/core';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';

import {theme} from './themes/theme';

import { UserProvider } from './context/User';


import ProfilePage from './pages/UserProfile';
import ChefProfile from './pages/ChefProfile';
import SignUpPage from './pages/SignUp';
import SignInPage from './pages/SignIn';
import PageNotFound from './pages/PageNotFound';
import './App.css';
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [user, setUser] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <MuiThemeProvider theme={theme}>
      <UserProvider value={{user, setUser, loggedIn, setLoggedIn}}>
        <BrowserRouter>
        {/* 
            TopBar was moved to ProtectedRoute since the initial
            state of the loggedIn is false
        */}
          <Switch>
            <ProtectedRoute path="/chef_profile" component={ChefProfile} />
            <ProtectedRoute path="/user_profile" component={ProfilePage} />
            <Route path="/signin" component={SignInPage} />
            <Route path="/signup" component={SignUpPage} />
            <Route component={PageNotFound} />
            <Route exact path="/">
              <Redirect to="/signin" />
            </Route>
          </Switch>
        </BrowserRouter>
      </UserProvider>
    </MuiThemeProvider>
  );
}

export default App;