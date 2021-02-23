import React, { useContext } from 'react';
import UserContext from '../context/User'

import {
  Avatar,
  Grid,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Button,
  Typography,

} from "@material-ui/core";
import EditProfile from "./EditProfile";
import profile_pic from "../Assets/woman_profile.png";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  outerGrid: {
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
    color: theme.light,
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
    justifyContent: "center",
  },
  headRightContainer: {
    textAlign: "center",
    flexWrap: "wrap",
  },
  bioContainer: {
    flexDirection: "column",
    justifyContent: "center",
  },
  cardBio: {

    flexDirection: "column",
    alignSelf: "center",
    textAlign: "center",
    paddingBottom: "2em",
    ["@media (max-width:1280px)"]: { marginTop: "2em" },
  },
  bioContainer: {
    alignSelf: "center",
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
    alignSelf: "center",
    textAlign: "center",
    flexDirection: "column",
  },
  favoritesList: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    ["@media (max-width:1280px)"]: {
      alignItems: "center",
      flexDirection: "column",
      marginBottom: "2em",
    },
    padding: 0,
  },
  favoriteCuisine: {
    height: '2em',
    width: 'fit-content',
    ['@media (max-width:800px)']: { width: 'fit-content' },
    background: theme.main,
    marginRight: '0.75em',
    marginTop: '0.75em',
  },
  cuisineText: {
    color: 'white',
    fontStyle: 'bold',
  },
  // Footer
  mapImage: {
    width: "100%",
  },
}));

export default function ProfilePage(props) {
  const { user } = useContext(UserContext);
  const map =
    'https://lun-us.icons8.com/a/ybbxUKFceUicCgkzopwXcA/njrM31xG9kms8VRKbon19A/Slice.png';
  const classes = useStyles();
  return (
    <Grid container xs={12} className={classes.outerGrid}>
      <Grid container xs={12} sm={12} md={8} className={classes.innerGrid}>
        {/* heading container */}
        <Grid container xs={12} className={classes.cardHeader}>
          <Grid item lg={4} xs={12} className={classes.headerLeftContainer}>
            <Grid
              container
              direction="column"
              align="center"
              justify="space-evenly"
              className={classes.cardHeadLeft}
            >
              <Avatar
                src={user.profile?.profile_image}
                className={classes.cardHeadAvatar}
                borderColor="white"
              />
              <Typography variant="h6" className={classes.cardHeadName}>
                {user.profile.name}
              </Typography>
              <Typography className={classes.cardHeadLocation}>
                {user?.profile?.city}, {user?.profile?.country}
              </Typography>
              <Button className={classes.cardSendMessage}>Send Message</Button>
              <EditProfile />
            </Grid>
          </Grid>

          <Grid item lg={8} xs={12} className={classes.headerRightContainer}>
            {/* heading */}
            <Grid container xs={12} className={classes.cardHeadRight}>
              <Grid className={classes.bioContainer} variant="h6" xs={10}>
                <Typography
                  component="h6"
                  xs={12}
                  md={4}
                  className={classes.cardBio}
                >
                  <Typography
                    fontWeight="fontWeightBold"
                    variant="body1"
                    style={{ fontWeight: 600 }}
                  >
                    ABOUT ME:
                  </Typography>
                  <Typography className={classes.biography}>
                    {user?.profile?.about_me}
                  </Typography>
                </Typography>
                <Grid xs={12} sm={12} className={classes.cardFavorites}>
                  <Typography
                    fontWeight="fontWeightBold"
                    variant="body1"
                    style={{ fontWeight: 600 }}
                  >
                    Favorite Cuisines:
                  </Typography>
                  <List className={classes.favoritesList}>
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
