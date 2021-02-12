import React, { Component } from "react";
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

const regPattern = new RegExp(
  /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
);

const signUpPageStyle = (theme) => ({
  signUpContainer: {
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
      backgroundColor: "#FF510C", //Brighter Orange
    },
  },
  titleLogo: {
    width: "50%",
    marginLeft: theme.spacing(20),
    paddingBottom: theme.spacing(2),
    textAlign: "center",
  },
  leftSideContainer: {
    width: "50%",
    height: "100vh",
    float: "left",
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

class SignUpPage extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    usernameError: "",
    emailError: "",
    passwordError: "",
    passwordConfirmError: "",
  };

  validateChange = (e) => {
    switch (e.target.name) {
      case "signupName": {
        if (e.target.value.length === 0) {
          this.setState({ usernameError: "Field should not be empty." });
        } else {
          this.setState({ usernameError: "" });
        }
        this.setState({ username: e.target.value });
        break;
      }
      case "signupEmail": {
        if (!regPattern.test(e.target.value)) {
          this.setState({ emailError: "Not a valid email id." });
        } else {
          this.setState({ emailError: "" });
        }
        this.setState({ email: e.target.value });
        break;
      }
      case "signupPwd": {
        if (e.target.value.length < 6) {
          this.setState({ passwordError: "minimum 6 characters needed." });
        } else {
          this.setState({ passwordError: "" });
        }
        this.setState({ password: e.target.value });
        break;
      }
      case "signupPwdConfirm": {
        if (e.target.value !== this.state.password) {
          this.setState({ passwordConfirmError: "Passwords not matching" });
        } else {
          this.setState({ passwordConfirmError: "" });
        }
        break;
      }
      default:
        break;
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.signUpContainer}>
        <div className={classes.leftSideContainer}>
          <div className={classes.titleLogo}>
            <Typography variant="h4">CHEF'S MENU</Typography>
          </div>
          <Card className={classes.card}>
            <CardContent>
              <Typography className={classes.title} gutterBottom>
                Create an account
              </Typography>
              <form autoComplete="off">
                <Grid>
                  <Grid item>
                    <TextField
                      className={classes.textField}
                      required
                      autoFocus
                      name="signupName"
                      label="Name"
                      value={this.state.name}
                      placeholder="Enter your name"
                      error={this.state.usernameError !== "" ? true : false}
                      variant="outlined"
                      onChange={this.validateChange}
                      helperText={this.state.usernameError}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      className={classes.textField}
                      required
                      name="signupEmail"
                      label="Email"
                      value={this.state.email}
                      placeholder="Enter your e-mail address"
                      variant="outlined"
                      error={this.state.emailError !== "" ? true : false}
                      helperText={this.state.emailError}
                      onChange={this.validateChange}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      className={classes.textField}
                      required
                      type="password"
                      name="signupPwd"
                      label="Password"
                      value={this.state.password}
                      error={this.state.passwordError !== "" ? true : false}
                      placeholder="Enter password"
                      variant="outlined"
                      helperText="Minimum 6 characters"
                      onChange={this.validateChange}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      className={classes.textField}
                      required
                      type="password"
                      name="signupPwdConfirm"
                      label="Confirm Password"
                      placeholder="Re-enter password"
                      variant="outlined"
                      onChange={this.validateChange}
                      error={
                        this.state.passwordConfirmError !==
                        "Passwords not matching"
                          ? false
                          : true
                      }
                      helperText={this.state.passwordConfirmError}
                    />
                  </Grid>
                </Grid>
              </form>
            </CardContent>
            <CardActions style={{ justifyContent: "center" }}>
              <Button type="submit" className={classes.button}>
                Sign Up
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
              Already Member ?
              <Link to="/signin" className={classes.linkNoDecoration}>
                <Button
                  className={`${classes.button} ${classes.marginLeft_2}`}
                  variant="contained"
                >
                  Sign In
                </Button>
              </Link>
            </Typography>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(signUpPageStyle)(SignUpPage);
