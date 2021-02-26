import React, { useState, useContext } from "react";
import {
  Button,
  Typography,
  TextField,
  Card,
  CardContent,
  Grid,
} from "@material-ui/core";
import { Link, Redirect} from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import BackgroundImg from "../Assets/images/signUpBkg.png";
import ChefsMenuLogo from "../Assets/images/Logo.png";
import UserContext from "../context/User";
import AutocompletePlaces from "../components/AutocompletePlaces";

const regPattern = new RegExp(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i);

const signUpPageStyle = (theme) => ({
  signUpContainer: {
    fontFamily: '"Roboto"',    
    height: "100vh",
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
    height: "10vh",
    margin: theme.spacing(2),
    backgroundImage: `url(${ChefsMenuLogo})`,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
  },
  rightSideContainer: {
    [theme.breakpoints.up("md")]: {
      backgroundImage: `url(${BackgroundImg})`,
      backgroundSize: "cover",
      backgroundPosition: "left",
    },
  },
  textField: {
    margin: theme.spacing(2),
    width: "30ch",
  },
  textColor: {
    [theme.breakpoints.up("md")]: {
      color: "white",
    },
    color: "black",
  },
  marginLeft_2: {
    margin: "2em",
  },
  linkNoDecoration: {
    textDecoration: "none",
  },
});


const SignUpPage = (props) => {
  const [redirect, setRedirect] = useState("");
  const {user, setUser, loggedIn, setLoggedIn} = useContext(UserContext);
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUserNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState("");
  const [message, setMessage] = useState(null);
  const [location, setLocation] = useState('')

  const locationState = {location,setLocation}
  
  const handleSignUp = (e) => {
    e.preventDefault();
    const data = {email: email, password: password, name: username, location};
    
    fetch('/auth/signup', {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      redirect: "manual",
      body: JSON.stringify(data)
    }).then(response => response.json()).then(data => {
      if (data.status === 201) {
        setUser(data.user);
        setLoggedIn(true);
        // Initially, users are not able to be chefs
        // so redirect to the regular profile
        setRedirect(<Redirect to="/user_profile"/>)
      } else {
        return setMessage(data.message);
      }
    })
  }

  const { classes } = props;

  const validateChange = (e) => {
    switch (e.target.name) {
      case "signupName": {
        if (e.target.value.length === 0) {
          setUserNameError("Field should not be empty.");
        } else {
          setUserNameError("");
        }
        setUserName(e.target.value);
        break;
      }
      case "signupEmail": {
        if (!regPattern.test(e.target.value)) {
          setEmailError("Not a valid email id.");
        } else {
          setEmailError("");
        }
        setEmail(e.target.value);
        break;
      }
      case "signupPwd": {
        if (e.target.value.length < 6) {
          setPasswordError("Minimum 6 characters needed.");
        } else {
          setPasswordError("");
        }
        setPassword(e.target.value);
        break;
      }
      case "signupPwdConfirm": {
        if (e.target.value !== password) {
          setPasswordConfirmError("Passwords not matching");
        } else {
          setPasswordConfirmError("");
        }
        break;
      }
      default:
        break;
    }
  };
  return (
    <Grid container direction="row" className={classes.signUpContainer}>
      {redirect}
      <Grid item md={6} sm={12}>
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="center"
        >
          <Grid item className={classes.titleLogo}></Grid>
          <Grid item>
            <Card>
              <CardContent>
                <Typography className={classes.title} gutterBottom>
                  Create an account
                </Typography>
                {message && <Typography>{message}</Typography>}
                <form onSubmit={handleSignUp} autoComplete="off">
                  <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="center"
                  >
                    <Grid item>
                      <TextField
                        className={classes.textField}
                        required
                        autoFocus
                        name="signupName"
                        label="Name"
                        value={username}
                        placeholder="Enter your name"
                        error={usernameError !== "" ? true : false}
                        variant="outlined"
                        onChange={(e) => validateChange(e)}
                        helperText={usernameError}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        className={classes.textField}
                        required
                        name="signupEmail"
                        label="Email"
                        value={email}
                        placeholder="Enter your e-mail address"
                        variant="outlined"
                        error={emailError !== "" ? true : false}
                        helperText={emailError}
                        onChange={(e) => validateChange(e)}
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
                        error={passwordError !== "" ? true : false}
                        placeholder="Enter password"
                        variant="outlined"
                        helperText={passwordError}
                        onChange={(e) => validateChange(e)}
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
                        onChange={(e) => validateChange(e)}
                        error={passwordConfirmError === "Passwords not matching"}
                        helperText={passwordConfirmError}
                      />
                    </Grid>
                    <Grid item>
                      <AutocompletePlaces locationState={locationState} variant="outlined" className={classes.textField} />
                    </Grid>
                    <Grid item>
                      <Button type="submit" className={classes.button}>
                        Sign Up
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      <Grid item md={6} sm={12} className={classes.rightSideContainer}>
        <Grid container direction="row" justify="flex-end">
          <Grid item style={{ padding: "25px" }}>
            <Typography className={classes.textColor} variant="h6">
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
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default withStyles(signUpPageStyle)(SignUpPage);
