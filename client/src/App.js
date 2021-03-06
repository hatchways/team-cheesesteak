import React, { useState, useEffect, useContext } from 'react';
import { MuiThemeProvider } from '@material-ui/core';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import { theme } from './themes/theme';

import { UserProvider } from './context/User';

import './App.css';

import ProtectedRoute from "./components/ProtectedRoute";
import {InboxPage, ConversationPage} from "./pages/Messaging";
import SignInPage from './pages/SignIn';
import SignUpPage from './pages/SignUp';
import ChefProfilePage from "./pages/ChefProfile";
import ProfilePage from './pages/UserProfile';
import UploadPage from "./pages/Upload";
import PageNotFound from './pages/PageNotFound';

function App() {
  const [user, setUser] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <MuiThemeProvider theme={theme}>
      <UserProvider value={{ user, setUser, loggedIn, setLoggedIn }}>
        <BrowserRouter>
          <Switch>
            <ProtectedRoute path="/chef_profile" component={ChefProfilePage} />
            <ProtectedRoute path="/user_profile" component={ProfilePage} />
            <ProtectedRoute path="/inbox" component={InboxPage} />
            <ProtectedRoute
                path="/conversation"
                component={ConversationPage}
              />
            <Route path="/signin" component={SignInPage} />
            <Redirect from="/" to="/signin"/>
            <Route path="/signup" component={SignUpPage} />
            <Route path="/upload" component={UploadPage} />
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