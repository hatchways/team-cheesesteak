import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  InputAdornment,
  TextField,
  Typography,
  Icon,
} from "@material-ui/core";

import { withStyles } from "@material-ui/core/styles";

const chefSearchCriteriaStyle = (theme) => ({
  buttonOrange: {
    background: theme.main,
    color: "white",
    "&:hover": {
      backgroundColor: theme.main,
    },
  },
  gridBottomMargin: {
    marginBottom: theme.spacing(4),
  },
  colorOrange: {
    color: theme.main,
  },
});
const ChefSearchCriteria = (props) => {
  const { classes } = props;
  //Array to store cuisines selected for filtering/searching
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  // The location search term is stored in locSearchTerm
  const [locSearchTerm, setlocSearchTerm] = useState("");

  useEffect(() => props.setSearchData(locSearchTerm, selectedCuisines));

  return (
    <Grid container direction="column" justify="flex-start">
      <Grid
        container
        item
        direction="column"
        justify="flex-start"
        className={classes.gridBottomMargin}
      >
        <Grid item>
          <Typography variant="button">Location:</Typography>
        </Grid>
        <Grid item>
          <TextField
            name="searchField"
            value={locSearchTerm}
            placeholder=""
            variant="outlined"
            onChange={(e) => setlocSearchTerm(e.target.value)}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Icon className={classes.colorOrange}>room</Icon>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
      <Grid item>
        <Typography variant="button">Cuisine:</Typography>
      </Grid>
      <Grid item>
        <Grid
          container
          direction="row"
          className={classes.gridBottomMargin}
          spacing={1}
        >
          {selectedCuisines.map((item) => (
            <Grid item key={item}>
              <Button
                variant="contained"
                className={classes.buttonOrange}
                endIcon={<Icon>close</Icon>}
                onClick={() =>
                  setSelectedCuisines(
                    selectedCuisines.filter((cuisine) => cuisine !== item)
                  )
                }
              >
                {item}
              </Button>
            </Grid>
          ))}
        </Grid>
        <Grid container direction="row" spacing={1}>
          {props.masterCuisineList
            .filter((item) => !selectedCuisines.includes(item))
            .map((cuisineType) => (
              <Grid item key={cuisineType}>
                <Button
                  variant="outlined"
                  onClick={() =>
                    setSelectedCuisines([...selectedCuisines, cuisineType])
                  }
                >
                  {cuisineType}
                </Button>
              </Grid>
            ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default withStyles(chefSearchCriteriaStyle)(ChefSearchCriteria);
