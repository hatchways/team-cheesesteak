import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { theme } from "./themes/theme";

import LandingPage from "./pages/Landing";
import ProfilePage from "./pages/UserProfile";
import "./App.css";
import SignUpPage from "./pages/SignUp";
import SignInPage from "./pages/SignIn";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>

        <Switch>
          <Route path="/signin" component={SignInPage} />
          <Route path="/signup" component={SignUpPage} />
        </Switch>

        <Route path="/user_profile" component={ProfilePage}/>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
