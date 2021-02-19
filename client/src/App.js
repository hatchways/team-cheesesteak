import React, {useState} from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { theme } from "./themes/theme";

import UserContext from "./context/User"

import TopBar from "./components/TopBar";

import ProfilePage from "./pages/UserProfile";
import ChefProfile from "./pages/ChefProfile";
import SignUpPage from "./pages/SignUp";
import SignInPage from "./pages/SignIn";
import "./App.css";
import SignUpPage from "./pages/SignUp";
import SignInPage from "./pages/SignIn";
import ChefProfile from "./pages/ChefProfile";

function App() {
  const [user, setUser] = useState("");
  return (
    <MuiThemeProvider theme={theme}>
      <UserContext.Provider value={{user, setUser}}>
        <BrowserRouter>
          <TopBar />
          <Route path="/chef_profile" component={ChefProfile}/>
          <Route path="/user_profile" component={ProfilePage}/>
          <Route path="/signin" component={SignInPage} />
          <Route path="/signup" component={SignUpPage} />
        </BrowserRouter>
      </UserContext.Provider>
    </MuiThemeProvider>
  );
}

export default App;
