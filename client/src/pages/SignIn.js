import React, { useState, useContext } from "react";
import {
  Button,
  Typography,
  TextField,
  Card,
  CardContent,
  Grid,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import BackgroundImg from "../Assets/images/signUpBkg.png";
import ChefsMenuLogo from "../Assets/images/Logo.png";
import AuthContext from "../context/Auth";

const signInPageStyle = (theme) => ({
  signInContainer: {
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

const SignInPage = (props) => {
  const { classes } = props;

  const { user, setUser } = useContext(AuthContext)

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("User/Password doesn't exist.");
  const handleSignIn = (e) => {
    fetch('/auth/login').then(response => response.json()).then(data => {
      if (data.status === 200) {
        setUser(data.user);
      } else {
        return setMsg(msg);
      }
    })
  }

  return (
    <Grid container direction="row" className={classes.signInContainer}>
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
                  Login
                </Typography>
                <form autoComplete="off">
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
                        name="signinEmail"
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
                        name="signinPwd"
                        label="Password"
                        value={password}
                        placeholder="Enter password"
                        variant="outlined"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </Grid>
                    <Grid item>
                      <Button
                        onClick={(e) => {
                          setUser({ username: 'Meme', type: 'chef' });
                          console.log(user)
                        }}
                        className={classes.button}>
                        Sign In
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
            <Typography
              className={classes.textColor}
              variant="h6"
              align="right"
            >
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
            <Typography>{msg}</Typography>

          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default withStyles(signInPageStyle)(SignInPage);
