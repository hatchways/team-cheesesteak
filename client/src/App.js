import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route } from "react-router-dom";

import { theme } from "./themes/theme";
import LandingPage from "./pages/Landing";
import ProfilePage from "./pages/UserProfile";
import "./App.css";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Route path="/user_profile" component={ProfilePage}/>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
