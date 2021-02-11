import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route } from "react-router-dom";

import { theme } from "./themes/theme";
import LandingPage from "./pages/Landing";
// import ChefPage from "./pages/Chef";
// import ProfilePage from "./pages/Profile";

import "./App.css";

import Auth from "./component/Auth";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Auth />
        <Route exact path="/" component={LandingPage} />
        {/* <Route path="/chef" component={ChefPage} />
        <Route path="/profile" component={ProfilePage} /> */}
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
