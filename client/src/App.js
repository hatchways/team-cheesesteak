import React, { useState, useEffect, useContext } from 'react';
import { MuiThemeProvider } from '@material-ui/core';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import { theme } from './themes/theme';

import { UserProvider } from './context/User';


import ChefProfilePage from "./pages/ChefProfile";
import UploadPage from "./pages/Upload";
import ProfilePage from './pages/UserProfile';
import SignUpPage from './pages/SignUp';
import SignInPage from './pages/SignIn';
import TestPage from './pages/test';
import PageNotFound from './pages/PageNotFound';
import './App.css';
import ProtectedRoute from "./components/ProtectedRoute";

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
            <Route path="/signin" component={SignInPage} />
            <Route path="/signup" component={SignUpPage} />
            <Route path="/test" component={TestPage} />
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