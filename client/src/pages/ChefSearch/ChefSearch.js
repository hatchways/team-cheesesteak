import React, { useState } from "react";
import { Grid, makeStyles, Typography } from "@material-ui/core";
import ChefSearchCriteria from "./ChefSearchCriteria";
import SearchResults from "./SearchResults";
import { theme } from "../../themes/theme";

const useStyles = makeStyles ({
  main: {
    height: "100vh",
    margin: theme.spacing(2),
  },
  searchPanel: {
    backgroundColor: "white",
    margin: theme.spacing(2),
  },
  searchResultsPanel: {
    backgroundColor: theme.bgcolor,
    margin: theme.spacing(2),
    padding: theme.spacing(2),
  },
});
const ChefSearchPage = () => {
  const classes = useStyles();
  //chefDatas is temp static , currently used to show dummy props.chefAvailable profile.
  const chefDatas = [
    {
      id: 1,
      name: "Tester",
      about: "This is just a test about details",
      profileImg: "Chef.png",
      location: "Toronto",
      cuisineSpecs: "Japanese",
    },
    {
      id: 2,
      name: "I Changed",
      about: "This is just a test about details",
      profileImg: "Chef.png",
      location: "Toronto",
      cuisineSpecs: "Japanese",
    },
    {
      id: 3,
      name: "My Name",
      about: "This is just a test about details",
      profileImg: "Chef.png",
      location: "London",
      cuisineSpecs: "Japanese",
    },
    {
      id: 4,
      name: "I Changed",
      about: "This is just a test about details",
      profileImg: "Chef.png",
      location: "Toronto",
      cuisineSpecs: "Japanese",
    },
    {
      id: 5,
      name: "I Changed",
      about: "This is just a test about details",
      profileImg: "Chef.png",
      location: "London",
      cuisineSpecs: "Chinese",
    },
  ];
  //masterCuisineList is static right now, used to store a list of cuisine types
  const masterCuisineList = [
    "All",
    "Japanese",
    "Chinese",
    "Thai",
    "Mexican",
    "Arabic",
    "Spanish",
  ];

  const [locToSearch, setLocToSearch] = useState("");
  const [cuisinesToSearch, setCuisinesToSearch] = useState([]); //These are the variables we can use later to search DB.

  const setSearchCriteria = (location, cuisinesSelected) => {
    setLocToSearch(location);
    setCuisinesToSearch(cuisinesSelected);
  };
  return (
    <Grid container direction="row" className={classes.main}>
      <Grid item className={classes.searchPanel} sm={12} md={3}>
        <ChefSearchCriteria
          masterCuisineList={masterCuisineList}
          setSearchData={setSearchCriteria}
        />
      </Grid>
      <Grid item className={classes.searchResultsPanel} sm={12} md={8}>
        <Grid item>
          <Typography variant="h5" gutterBottom>
            Availabe Chefs:
          </Typography>
        </Grid>
        <Grid container direction="column" justify="flex-start">
          <Grid item>
            <Grid container direction="row" spacing={2} justify="flex-start">
              {chefDatas
                .filter((chef) => chef.location === locToSearch)
                .filter((chef) => cuisinesToSearch.includes(chef.cuisineSpecs))
                .map((chef) => (
                  <SearchResults key={chef.id} chefAvailable={chef} />
                ))}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ChefSearchPage;
