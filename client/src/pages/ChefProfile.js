import React, {useContext} from "react";
import { Grid, Typography } from "@material-ui/core";
import ChefContent from "./ChefContent";
import RecipeContent from "./RecipeContent";
import UserContext from "../context/User";
const ChefProfile = () => {
  const isChef = true; //to be refactored to check the status of the user from db
  const profileDisplay = isChef ? true : false;
  return (
    <Grid container>
      <ChefContent profileDisplay={profileDisplay} />
      <RecipeContent profileDisplay={profileDisplay} />
    </Grid>
  );
};

export default ChefProfile;
