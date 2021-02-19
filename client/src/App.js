import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { theme } from "./themes/theme";

import UserContext from "./context/User"

import TopBar from "./components/TopBar";

import ProfilePage from "./pages/UserProfile";
import SignUpPage from "./pages/SignUp";
import SignInPage from "./pages/SignIn";
import "./App.css";

function App() {
  const user = {
    FName: 'Pierre',
    LName: 'Smith',
    Province: 'Ontario',
    PostalCode: 'M4C 2R2',
    City: 'Toronto',
    role: 'Chef',
  }

  return (
    <MuiThemeProvider theme={theme}>
      <UserContext.Provider value={user}>
        <BrowserRouter>
          <TopBar />
          <Route path="/" component={SignInPage} />
          <Route path="/user_profile" component={ProfilePage} />
          <Route path="/signin" component={SignInPage} />
          <Route path="/signup" component={SignUpPage} />
        </BrowserRouter>
      </UserContext.Provider>
    </MuiThemeProvider>
  );
}

export default App;
