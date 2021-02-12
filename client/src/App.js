import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { theme } from "./themes/theme";

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
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
