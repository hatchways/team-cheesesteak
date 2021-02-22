import React from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { theme } from "../../themes/theme";

const useStyles = makeStyles({
  buttonOrange: {
    background: theme.main,
    color: "white",
    "&:hover": {
      backgroundColor: theme.main,
    },
  },
  chefcard: {
    maxWidth: "25vw",
    padding: theme.spacing(2),
  },
  media: {
    width: "15vh",
    height: "15vh",
    borderRadius: "50%",
  },
});

const SearchResultsPage = (props) => {
  const classes = useStyles();

  return (
    <Grid item align="center">
      <Card className={classes.chefcard}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={require(`../../Assets/images/${props.chefAvailable.profileImg}`)}
          />
          <CardContent>
            <Typography gutterBottom variant="h5">
              {props.chefAvailable.name}
            </Typography>
            <Typography
              gutterBottom
              variant="body2"
              color="textSecondary"
              component="p"
            >
              {props.chefAvailable.location}
            </Typography>
            <Typography className={classes.buttonOrange}>
              {props.chefAvailable.cuisineSpecs}
            </Typography>
            <Typography variant="body2" component="p">
              {props.chefAvailable.about}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

export default SearchResultsPage;
