import React, { useState } from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { theme } from "./themes/theme";

import AuthContext from "./context/Auth"

import TopBar from "./components/TopBar";

import ProfilePage from "./pages/UserProfile";
import SignUpPage from "./pages/SignUp";
import SignInPage from "./pages/SignIn";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const value = { user, setUser };

  return (
    <MuiThemeProvider theme={theme}>
      <AuthContext.Provider value={value}>
        <BrowserRouter>
          <TopBar />
          <Route path="/" component={SignInPage} />
          <Route path="/user_profile" component={ProfilePage} />
          <Route path="/signin" component={SignInPage} />
          <Route path="/signup" component={SignUpPage} />
        </BrowserRouter>
      </AuthContext.Provider>
    </MuiThemeProvider>
  );
}

export default App;
