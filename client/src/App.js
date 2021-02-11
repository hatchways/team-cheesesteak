import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route } from "react-router-dom";

import { theme } from "./themes/theme";
//import LandingPage from "./pages/Landing";
import SignUpPage from "./pages/SignUp";

import "./App.css";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Route path="/" component={SignUpPage} />
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
