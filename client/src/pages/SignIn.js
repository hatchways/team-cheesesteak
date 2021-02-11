import React, { Component } from "react";
import ReactDOM from "react-dom";
import {
  Button,
  Typography,
  TextField,
  Card,
  CardContent,
  CardActions,
  Box,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import BackgroundImg from "../Assets/images/signUpBkg.png";
import SignUp from "./SignUp";

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
});

class SignInPage extends Component {
  state = {
    email: "",
    password: "",
  };

  loadSignUp = () =>
    ReactDOM.render(<SignUp />, document.getElementById("root"));

  render() {
    const { classes } = this.props;
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
                <Box display="flex">
                  <TextField
                    className={classes.textField}
                    required
                    name="signupEmail"
                    label="Email"
                    placeholder="Enter your e-mail address"
                    variant="outlined"
                  />
                </Box>
                <Box display="flex">
                  <TextField
                    className={classes.textField}
                    required
                    type="password"
                    name="signupPwd"
                    label="Password"
                    placeholder="Enter password"
                    variant="outlined"
                  />
                </Box>
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
            <Typography
              className={classes.whiteText}
              variant="h6"
              align="right"
            >
              Don't have an account ?
              <Button
                className={`${classes.button} ${classes.marginLeft_2}`}
                variant="contained"
                onClick={this.loadSignUp}
              >
                Sign Up
              </Button>
            </Typography>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(signInPageStyle)(SignInPage);
