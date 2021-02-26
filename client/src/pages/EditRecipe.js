import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";

import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import Edit from "@material-ui/icons/Edit";
import sushi from "../Assets/sushi.png";

const useStyles = makeStyles(theme => ({
  title: {
    textAlign: "center",
  },
  edit: {
    marginTop: 20,
    borderRadius: 0,
  },

  avatar: {
    width: theme.spacing(20),
    height: theme.spacing(20),
    border: "solid white 2px",
    boxShadow: "0 0 5px lightgrey",
    marginBottom: theme.spacing(1),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: "#ff743d",
  },
  image: {
    width: "40%",
    margin: theme.spacing(3, 5, 3, 0),
  },
  submit: {
    color: "#F8F8FF",
    backgroundColor: "#ff743d",
    "&:hover": {
      backgroundColor: "#FF510C",
    },
    margin: theme.spacing(0, 3),
  },
}));

const EditRecipe = () => {
  const classes = useStyles();
  const [profileOpen, setprofileOpen] = useState(false);

  const handleprofileOpen = () => {
    setprofileOpen(true);
  };

  const handleprofileClose = () => {
    setprofileOpen(false);
  };
  const onSubmit = () => {
    //process form
    handleprofileClose();
  };

  const { handleSubmit } = useForm({});

  return (
    <>
      <Button
        variant="outlined"
        className={classes.edit}
        size="medium"
        onClick={handleprofileOpen}
      >
        <Edit />
        Edit Recipe
      </Button>
      <Dialog open={profileOpen} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title" className={classes.title}>
          Edit Your Recipe
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <img className={classes.image} src={sushi} alt="Dish" />
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              label="Meal Name"
              type="text"
              fullWidth
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="price"
              label="Price"
              type="number"
              fullWidth
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="portions"
              label="Portions"
              type="number"
              fullWidth
            />
            <TextField
              autoFocus
              required
              multiline
              rowsMax="4"
              margin="dense"
              id="ingredients"
              label="Ingredients"
              type="text"
              fullWidth
            />
            <TextField
              autoFocus
              multiline
              rowsMax="4"
              margin="dense"
              id="required_items"
              label="Required Items"
              type="text"
              fullWidth
            />
          </DialogContent>
          <Button type="submit" className={classes.submit}>
            Submit
          </Button>
        </form>
        <DialogActions>
          <CloseIcon
            className={classes.closeButton}
            onClick={handleprofileClose}
          />
        </DialogActions>
      </Dialog>
    </>
  );
};
export default EditRecipe;
