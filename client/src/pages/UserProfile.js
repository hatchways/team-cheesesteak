// Forewarning, I have no idea what I'm doing when it comes to React
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import {
  Avatar,
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import profile_pic from "../assets/images/profile_pic.png";
import map from "../assets/images/map.png";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  outerGrid: {
    display: "flex",
    justifyContent: "center",
    background: "#F8F8FF",
  },
  innerGrid: {
    boxShadow: theme.shadows[5],
    background: "#F8F8FF",
  },
  // Header
  cardHeader: {
    background: "white",
    width: "100%",
    display: "flex",
    direction: "row",
    alignSelf: "center",
  },
  // Left header
  cardHeadLeft: {
    marginTop: "10%",
  },
  headerLeftContainer: {
    border: "1px solid lightGrey",
    paddingBottom: "3.5em",
    ["@media (max-width:800px)"]: { paddingBottom: "3em" },
  },
  cardHeadAvatar: {
    alignSelf: "center",
    border: "3px solid white",
    boxShadow: theme.shadows[5],
    marginBottom: "1em",
    width: "6em",
    height: "6em",
  },
  cardHeadLocation: {
    paddingBottom: "1.5em",
    color: "grey",
  },
  cardSendMessage: {
    border: "2px solid #FF510C",
    color: "#FF510C",
    borderRadius: "0",
    paddingTop: "1em",
    paddingBottom: "1em",
    paddingLeft: "2.5em",
    paddingRight: "2.5em",
    alignSelf: "center",
  },

  // Right header
  cardHeadRight: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
  },
  headRightContainer: {
    display: "flex",
    flexWrap: "wrap",
    // border: "2px solid red"
  },
  bioContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  cardBio: {
    //  border: "3px solid black",
    display: "flex-column",
    alignSelf: "center",
    paddingBottom: "2em",
    ["@media (max-width:800px)"]: { marginTop: "2em" },
  },
  bioContainer: {
    display: "flex-column",
    alignSelf: "center  ",
  },
  bioHead: {
    color: "grey",
    paddingBottom: "1em",
  },
  biography: {
    color: "grey",
    marginBottom: "0.75em",
  },
  cardFavorites: {
    // border: "3px solid red",
    alignSelf: "center",
    display: "flex",
    flexDirection: "column",
    justify: "space-between",
  },
  favoritesList: {
    // border: "3px solid black",
    display: "flex",
    flexDirection: "row",
    ["@media (max-width:600px)"]: {
      flexDirection: "column",
      marginBottom: "1em",
    },
    padding: 0,
  },
  favoriteCuisine: {
    height: "2em",
    display: "flex",
    width: "auto",
    ["@media (max-width:800px)"]: {width: "auto"},
    background: "#FF743D",
    marginRight: "0.75em",
    marginTop: "0.75em",
  },
  cuisineText: {
    color: "white",
    alignSelf: "center",
    fontStyle: "bold",
  },
  // Footer
  mapImage: {
    width: "100%",
  },
  Typography: {
    fontFamily: "Montserrat, sans-serif",
  },
}));

export default function ProfilePage(props) {
  const classes = useStyles();
  const bioTitle = "Hi everyone!";
  const bio = "I'm a foodie and I love to eat healthy tasty meals. Also I'm a mom of two kids";
  return (
    <Grid container xs={12} className={classes.outerGrid}>
      <Grid container xs={12} lg={8} className={classes.innerGrid}>
        {/* heading container */}
        <Grid container xs={12} className={classes.cardHeader}>
          <Grid item lg={4} xs={12} className={classes.headerLeftContainer}>
            <Grid
              container
              display="flex"
              direction="column"
              align="center"
              justify="space-evenly"
              className={classes.cardHeadLeft}
            >
              <Avatar
                src={profile_pic}
                className={classes.cardHeadAvatar}
                borderColor="white"
              />
              <Typography variant="h6" className={classes.cardHeadName}>
                Christine Wilconson
              </Typography>
              <Typography className={classes.cardHeadLocation}>
                Ontario, Canada
              </Typography>
              <Button className={classes.cardSendMessage}>Send Message</Button>
            </Grid>
          </Grid>

          <Grid item lg={8} xs={12} className={classes.headerRightContainer}>
            {/* heading */}
            <Grid container xs={12} className={classes.cardHeadRight}>
              <Grid className={classes.bioContainer} xs={8}>
                <Typography
                  component="h6"
                  xs={12}
                  md={4}
                  className={classes.cardBio}
                >
                  <Box paddingBottom="1em" fontWeight="fontWeightBold">
                    ABOUT ME:
                  </Box>
                  <Typography className={classes.bioHead}>
                    {bioTitle}
                  </Typography>
                  <Typography className={classes.biography}>{bio}</Typography>
                </Typography>
                <Grid className={classes.cardFavorites}>
                  <Box paddingBottom="0.75em" fontWeight="fontWeightBold">
                    FAVORITE CUISINE:
                  </Box>
                  <List xs={12} md={4} className={classes.favoritesList}>
                    <ListItem className={classes.favoriteCuisine}>
                      <ListItemText className={classes.cuisineText}>
                        Mediterranean
                      </ListItemText>
                    </ListItem>
                    <ListItem className={classes.favoriteCuisine}>
                      <ListItemText className={classes.cuisineText}>
                        Chinese
                      </ListItemText>
                    </ListItem>
                    <ListItem className={classes.favoriteCuisine}>
                      <ListItemText className={classes.cuisineText}>
                        Thai
                      </ListItemText>
                    </ListItem>
                    <ListItem className={classes.favoriteCuisine}>
                      <ListItemText className={classes.cuisineText}>
                        Mexican
                      </ListItemText>
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* Footing */}
        <Grid xs={12} className={classes.locationMap} item>
          <img className={classes.mapImage} src={map} />
        </Grid>
      </Grid>
    </Grid>
  );
}
