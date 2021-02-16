import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
} from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import sushi from "../assets/sushi.png";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexGrow: 1,
    backgroundColor: theme.palette.primary.main,
    alignItems: "center",
    flexDirection: "column",
  },
  dishMenu: {
    margin: theme.spacing(5),
  },
  recipes: {
    width: "100%",
    display: "flex",
    flexGrow: 1,
    alignItems: "center",
    flexDirection: "column",
  },
  recipeCard: {
    width: "80%",
    display: "flex",
    position: "relative",
  },
  description: {
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
    maxWidth: "55%",
    margin: theme.spacing(3, 0, 3, 3),
    padding: theme.spacing(2, 5, 0, 0),
  },
  cardContent: {
    flex: "1 0 auto",
    padding: 0,
  },
  dishPortion: {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.secondary.main,
    marginLeft: theme.spacing(0),
  },
  dishItems: {
    textTransform: "uppercase",
    fontSize: 15,
    fontWeight: "900",
    marginTop: theme.spacing(2),
  },
  dishPrice: {
    color: "#ff743d",
  },

  line: {
    margin: theme.spacing(1),
  },

  dishEdit: {
    width: theme.spacing(25),
    marginTop: theme.spacing(3),
    borderRadius: 0,
  },
  dishImage: {
    margin: theme.spacing(3, 5, 3, 0),
    width: "50%",
  },
}));

const RecipeContent = () => {
  const classes = useStyles();
  return (
    <Grid item className={classes.root}>
      <Typography className={classes.dishMenu} variant="h5">
        Liz's Menu
      </Typography>

      <Grid item className={classes.recipes}>
        <Card className={classes.recipeCard}>
          <div className={classes.description}>
            <CardContent className={classes.cardContent}>
              <Chip className={classes.dishPortion} label="Meal for 2"></Chip>
              <Typography
                className={classes.dishItems}
                variant="h6"
                component="h6"
              >
                Jollof
              </Typography>
              <Typography className={classes.dishPrice}>$15.00</Typography>
              <Typography className={classes.dishItems}>
                Ingredients:
              </Typography>
              <Typography>Rice, Tomatoes, Pepper, Chicken stock.</Typography>
              <div className={classes.line}></div>
              <Typography className={classes.dishItems}>
                Required Stuff:
              </Typography>
              <Typography>Kitchen, plates.</Typography>
              <Button className={classes.dishEdit} variant="outlined">
                <Edit />
                Edit recipe
              </Button>
            </CardContent>
          </div>
          <CardMedia className={classes.dishImage} image={sushi}></CardMedia>
        </Card>
      </Grid>
    </Grid>
  );
};

export default RecipeContent;
