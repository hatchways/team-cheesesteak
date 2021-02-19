import React, { useState, useContext } from "react";
import {
  Button,
  Typography,
  TextField,
  Card,
  CardContent,
  Grid,
} from "@material-ui/core";
import { Link, Route, Redirect, useHistory } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import BackgroundImg from "../assets/images/signUpBkg.png";
import ChefsMenuLogo from "../assets/images/Logo.png";
import UserContext from "../context/User";

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

function redirect(to) {
  return <Redirect to={to}/>
}

const SignInPage = (props) => {
  const { classes } = props;
  let history = useHistory();
  const { user, setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);

  const handleSignIn = (e) => {
    e.preventDefault();
    const data = {email: email, password: password};
    fetch('/auth/login', {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      redirect: "manual",
      body: JSON.stringify(data)
    }).then(response => response.json()).then(data => {
      if (data.status === 200) {
        console.log(user);
        setUser(data.user);
        console.log(data.user.profile);
        if (data.user.profile.is_chef){
          history.push('/chef_profile')

        }else{
        history.push('/user_profile')
        }
      } else {
        return setMessage(data.message);
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
                {message && <Typography>{message}</Typography>}

                <form onSubmit={handleSignIn} autoComplete="off">
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
                      <Button type="submit"
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

          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default withStyles(signInPageStyle)(SignInPage);