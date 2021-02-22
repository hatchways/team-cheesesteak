import React, {useState, useEffect, useContext} from 'react';
import {MuiThemeProvider} from '@material-ui/core';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';

import {theme} from './themes/theme';

import UserContext, { UserProvider } from './context/User';

import TopBar from './components/TopBar';

import ProfilePage from './pages/UserProfile';
import ChefProfile from './pages/ChefProfile';
import SignUpPage from './pages/SignUp';
import SignInPage from './pages/SignIn';
import PageNotFound from './pages/PageNotFound';
import './App.css';

function App() {
  const [user, setUser] = useState("");
  const [redirect] = useState("");
  // Debug
  //const {user, setUser} = useContext(UserContext);

  return (
    <MuiThemeProvider theme={theme}>
      <UserProvider value={{user, setUser}}>
        <BrowserRouter>
          {user && <TopBar />}
          {redirect && <Redirect to="/signin" />}
          <Switch>
            <Route path="/chef_profile" component={ChefProfile} />
            <Route path="/user_profile" component={ProfilePage} />
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