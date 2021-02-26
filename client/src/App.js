import React, { useState } from 'react';
import { MuiThemeProvider } from '@material-ui/core';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import { theme } from './themes/theme';

import { UserProvider } from './context/User';

import ProfilePage from './pages/UserProfile';
import ChefProfile from './pages/ChefProfile';
import SignUpPage from './pages/SignUp';
import SignInPage from './pages/SignIn';
import TestPage from './pages/Test';
import CheckoutPage from './pages/Checkout';
import PageNotFound from './pages/PageNotFound';
import './App.css';
import ProtectedRoute from "./components/ProtectedRoute";
import Checkout from "./pages/Checkout";

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
            <ProtectedRoute path="/test" component={TestPage} />
            <ProtectedRoute path="/checkout" component={CheckoutPage} />
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