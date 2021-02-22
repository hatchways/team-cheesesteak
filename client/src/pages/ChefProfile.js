import React, {useContext} from "react";
import { Grid, Typography } from "@material-ui/core";
import ChefContent from "./ChefContent";
import RecipeContent from "./RecipeContent";
import UserContext from "../context/User";
const ChefProfile = () => {
  // Fetch user data on load
  return (
    <Grid container>
      <ChefContent />
      <RecipeContent />
    </Grid>
  );
};

export default ChefProfile;
