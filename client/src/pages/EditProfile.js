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
  Avatar,
} from "@material-ui/core";

import CloseIcon from "@material-ui/icons/Close";
import Edit from "@material-ui/icons/Edit";

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
  submit: {
    color: "#F8F8FF",
    backgroundColor: "#ff743d",
    "&:hover": {
      backgroundColor: "#FF510C",
    },
    margin: theme.spacing(0, 3),
  },
}));

const EditProfile = () => {
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
    <div>
      <Button
        variant="outlined"
        className={classes.edit}
        size="medium"
        onClick={handleprofileOpen}
      >
        <Edit />
        Edit Profile
      </Button>
      <Dialog open={profileOpen} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title" className={classes.title}>
          Edit Your Profile
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Avatar src="" alt="profile" className={classes.avatar} />
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              label="Full Name"
              type="text"
              fullWidth
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="address"
              label="Location"
              type="text"
              fullWidth
            />
            <TextField
              autoFocus
              multiline
              rowsMax="4"
              margin="dense"
              id="aboutMe"
              label="About Me"
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
    </div>
  );
};
export default EditProfile;
