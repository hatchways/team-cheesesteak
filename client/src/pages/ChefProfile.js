import React from "react";
import { Grid } from "@material-ui/core";
import ChefContent from "./ChefContent";
import RecipeContent from "./RecipeContent";

const ChefProfile = () => {
  return (
    <Grid container>
      <ChefContent />
      <RecipeContent />
    </Grid>
  );
};

export default ChefProfile;
