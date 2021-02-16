import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route } from "react-router-dom";

import { theme } from "./themes/theme";
import UserContext from "./context/User"

import LandingPage from "./pages/Landing";
import TopBar from "./components/TopBar";

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
          <Route path="/" component={LandingPage} />
        </BrowserRouter>
      </UserContext.Provider>
    </MuiThemeProvider>
  );
}

export default App;
