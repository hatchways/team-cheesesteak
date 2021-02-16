import React from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { Edit } from "@material-ui/icons";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";
import chefPic from "../assets/chefPic.png";
import chefBackground from "../assets/chefBackground.png";

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: theme.spacing(80),
    backgroundColor: "#F8F8FF",
    maxHeight: "600px",
  },
  sideMenu: {
    backgroundColor: "#FFF",
    width: "100%",
    height: "100%",
  },
  chefBackground: {
    display: "flex",
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
  },
  chefProfile: {
    display: "flex",
    textAlign: "center",
    alignItems: "center",
    flexDirection: "column",
    marginTop: 115,
    padding: (0, 5),
  },
  divider: {
    marginTop: 20,
    minWidth: 43,
  },
  chefAboutMe: {
    margin: (20, 20),
  },

  requestButton: {
    width: "80%",
    borderRadius: 0,
    color: theme.palette.primary.main,
    backgroundColor: "#FF510C",
    marginTop: 20,
    padding: 16,
  },
  edit: {
    marginTop: 20,
    borderRadius: 0,
  },
}));

const ChefContent = () => {
  const classes = useStyles();
  return (
    <Grid
      component="main"
      className={classes.root}
      item
      xs={12}
      sm={12}
      md={4}
      lg={3}
    >
      <Paper className={classes.sideMenu} elevation={1}>
        <Grid item className={classes.chefBackground}>
          <Avatar src={chefPic} className={classes.chefPic} />
        </Grid>
        <Grid item className={classes.chefProfile}>
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
            variant="contained"
            fullwidth
            className={classes.requestButton}
          >
            Send Request
          </Button>
          <Button variant="outlined" size="large" className={classes.edit}>
            <Edit />
            Edit Profile
          </Button>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default ChefContent;
