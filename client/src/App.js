import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route } from "react-router-dom";

import { theme } from "./themes/theme";
import ChefSearchPage from "./pages/ChefSearch/ChefSearch";

import "./App.css";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Route path="/chefsearch" component={ChefSearchPage} />
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
