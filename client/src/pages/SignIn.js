import React, { useState } from "react";
import {
  Button,
  Typography,
  TextField,
  Card,
  CardContent,
  CardActions,
  Grid,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import BackgroundImg from "../Assets/images/signUpBkg.png";

const signInPageStyle = (theme) => ({
  signInContainer: {
    fontFamily: '"Montserrat"',
    margin: theme.spacing(2),
    height: "100vh",
  },
  card: {
    width: "50%",
    height: "75%",
    marginLeft: theme.spacing(20),
    textAlign: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    color: "white",
    width: theme.spacing(15),
    background: "#FF510C", //Brighter Orange
    "&:hover": {
      backgroundColor: "#FF510C",
    },
  },
  leftSideContainer: {
    width: "50%",
    height: "100vh",
    float: "left",
  },
  titleLogo: {
    width: "50%",
    marginLeft: theme.spacing(20),
    paddingBottom: theme.spacing(2),
    textAlign: "center",
  },
  rightSideContainer: {
    width: "50%",
    height: "100vh",
    [theme.breakpoints.up("md")]: {
      backgroundImage: `url(${BackgroundImg})`,
      backgroundSize: "cover",
      backgroundPosition: "left",
    },
    float: "left",
  },
  textField: {
    margin: theme.spacing(2),
    width: "30ch",
  },
  whiteText: {
    color: "white",
  },
  marginLeft_2: {
    margin: "2em",
  },
  linkNoDecoration: {
    textDecoration: "none",
  },
});

const SignInPage = (props) => {
  const { classes } = props;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  console.log(email, password); // Just added for now to avoid the warning saying both are assigned, but not used.
  return (
    <div className={classes.signInContainer}>
      <div className={classes.leftSideContainer}>
        <div className={classes.titleLogo}>
          <Typography variant="h4">CHEF'S MENU</Typography>
        </div>
        <Card className={classes.card}>
          <CardContent>
            <Typography className={classes.title} gutterBottom>
              Login
            </Typography>
            <form autoComplete="off">
              <Grid>
                <Grid item>
                  <TextField
                    className={classes.textField}
                    required
                    name="signupEmail"
                    label="Email"
                    value={email}
                    placeholder="Enter your e-mail address"
                    variant="outlined"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    className={classes.textField}
                    required
                    type="password"
                    name="signupPwd"
                    label="Password"
                    value={password}
                    placeholder="Enter password"
                    variant="outlined"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Grid>
              </Grid>
            </form>
          </CardContent>
          <CardActions style={{ justifyContent: "center" }}>
            <Button type="submit" className={classes.button}>
              Sign In
            </Button>
          </CardActions>
        </Card>
      </div>
      <div className={classes.rightSideContainer}>
        <div style={{ padding: "25px" }}>
          <Typography className={classes.whiteText} variant="h6" align="right">
            Don't have an account ?
            <Link to="/signup" className={classes.linkNoDecoration}>
              <Button
                className={`${classes.button} ${classes.marginLeft_2}`}
                variant="contained"
              >
                Sign Up
              </Button>
            </Link>
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default withStyles(signInPageStyle)(SignInPage);
