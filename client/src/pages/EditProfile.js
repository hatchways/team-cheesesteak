import React, {useContext, useState} from "react";
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
import DropZone from "../components/DropZone";
import UserContext from "../context/User";

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
  //example for upload is in the upload.js
  const classes = useStyles();
  const {user} = useContext(UserContext)
  const [profileOpen, setprofileOpen] = useState(false);
  const [response, setResponse] = useState();
  const [file, setFile] = useState();
  const [name, setName] = useState();
  const [location, setLocation] = useState();
  const [aboutMe, setAboutMe] = useState();
  
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
  const handleFormSubmit = () => {
    let formData = new FormData()
    const url = '/profile/edit'
    const options = {
      method: "POST",
      body: null
    }
  
    if (file) formData.append('profilePic', file[0])
    formData.append('name', name)
    formData.append('location', location)
    formData.append('about_me', aboutMe)
    options.body = formData
    
    fetch(url, options)
    .then(res => {
      if (res.status < 500) return res.json();
      else throw Error("Server error");
    })
    .then(res => {
      setResponse(res.response);
    })
    .catch(err => {
      console.log(err.message);
    });
  }

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
        <form>
          <DialogContent>
            <DropZone onDrop={setFile} file={file} />
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              label="Full Name"
              type="text"
              fullWidth
              onChange={e => setName(e.target.value)}
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="address"
              label="Location"
              type="text"
              fullWidth
              onChange={e => setLocation(e.target.value)}
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
              onChange={e => setAboutMe(e.target.value)}
            />
          </DialogContent>
          <Button className={classes.submit} onClick={handleFormSubmit} >
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
