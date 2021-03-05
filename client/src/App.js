import React, { useState, useEffect, useContext } from 'react';
import { MuiThemeProvider } from '@material-ui/core';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import { theme } from './themes/theme';

import { UserProvider } from './context/User';


import ProfilePage from './pages/UserProfile';
import ChefProfile from './pages/ChefProfile';
import SignUpPage from './pages/SignUp';
import SignInPage from './pages/SignIn';
import TestPage from './pages/test';
import PageNotFound from './pages/PageNotFound';
import './App.css';
import ProtectedRoute from "./components/ProtectedRoute";
import {InboxPage, ConversationPage} from "./pages/Messaging";
function App() {
  const [user, setUser] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <MuiThemeProvider theme={theme}>
      <UserProvider value={{ user, setUser, loggedIn, setLoggedIn }}>
        <BrowserRouter>
          <Switch>
            <ProtectedRoute path="/chef_profile" component={ChefProfile} />
            <ProtectedRoute path="/user_profile" component={ProfilePage} />
            <ProtectedRoute path="/inbox" component={InboxPage} />
            <ProtectedRoute
                path="/conversation"
                component={ConversationPage}
              />
            <Route path="/signin" component={SignInPage} />
            <Redirect from="/" to="/signin"/>
            <Route path="/signup" component={SignUpPage} />
            <Route path="/test" component={TestPage} />
            <Route component={PageNotFound} />
          </Switch>
        </BrowserRouter>
      </UserProvider>
    </MuiThemeProvider>
  );
}

export default App;