import React from "react";
import {
  Typography,
  Grid,
  Paper,
  Avatar,
  Divider,
  Button,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import chefPic from "../assets/chefPic.png";
import chefBackground from "../assets/chefBackground.png";

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: theme.spacing(80),
    backgroundColor: "#F8F8FF",
  },

  sideMenu: {
    backgroundColor: "#FFF",
    height: "100vh",
  },
  chefBackground: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    height: "28%",
    backgroundImage: `url(${chefBackground})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
  chefPic: {
    width: 170,
    height: 170,
    border: "3px solid white",
    top: "50%",
    left: "25%",
  },

  chefProfile: {
    textAlign: "center",
    alignItems: "center",
    flexDirection: "column",
    marginTop: 100,
    padding: (0, 5),
  },
  chefLocation: {
    color: "#a9a9a9",
  },

  divider: {
    marginTop: 20,
    minWidth: 35,
    backgroundColor: "#ff743d",
  },

  chefAboutMe: {
    margin: (20, 20),
  },

  requestButton: {
    width: "80%",
    borderRadius: 0,
    color: "#F8F8FF",
    marginTop: 20,
    padding: 16,
  },
}));

const ChefContent = () => {
  const classes = useStyles();
  return (
    <Grid className={classes.root} item xs={12} sm={12} md={4} lg={3}>
      <Paper className={classes.sideMenu} elevation={1}>
        <Grid item className={classes.chefBackground}>
          <Avatar src={chefPic} className={classes.chefPic} />
        </Grid>
        <Grid container className={classes.chefProfile}>
          <Typography variant="h6">Liz Muyi</Typography>
          <Typography variant="subtitle1" className={classes.chefLocation}>
            Toronto, Canada
          </Typography>
          <Divider classes={{ root: classes.divider }} variant="middle" />
          <Typography className={classes.chefAboutMe}>
            Cooking is my passion, the kitchen is my haven, the best you'll ever
            taste.
          </Typography>
          <Button
            color="primary"
            variant="contained"
            fullwidth
            className={classes.requestButton}
          >
            Send Request
          </Button>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default ChefContent;
