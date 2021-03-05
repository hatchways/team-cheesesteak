// Use this as both an inbox to show all
// messages as well as showing individual
// conversations with a drawer to the right
// with a preview of other conversations
import React, {useContext, useState, useEffect} from "react";
import { Grid, GridList, GridListTile, Input } from "@material-ui/core";
import UserContext from "../context/User";
import { Link, Redirect, useParams } from "react-router-dom";
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {Avatar} from '@material-ui/core';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import CircularProgress from '@material-ui/core/CircularProgress';


function makePreviewString(messageContent){
  const endChars = "...";
  if(messageContent.length > 55){
    return messageContent.slice(0, 55) + endChars;
  }else{
    return messageContent
  }
}
const drawerWidth = 350;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    
  },
  loadingContainer: {
    width: "100%",
    justifyContent: "center"
  },
  // Conversation & drawer
  drawer: {
    marginTop: "15%",
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    marginTop: "4em",
    background: theme.bgcolor
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    width: "100%",
    border: "solid orange"
  },
  conversationContainer: {
    width: "70%",
    height: "100%",
    alignItems: "flex-end",
    justifyContent: "center"
  },
  inboxButton: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%"
  },
  currentUserMessage: {
    alignItems: "flex-end",
    width: "100%"
  },
  outerMessageContainer: {
    direction: "row",
    alignItems: "center",
    width: "75%",
    margin: "1em",
  },
  messageContent: {
    background: theme.bgcolor,
    width: "fit-content",
    justifyContent: "center",
    padding: "0.05em",
    paddingRight: "0.50em",
    paddingLeft: "0.50em"
  },
  messageImage: {
    width: "3em",
    height: "3em",
    marginRight: "1em"
  },
  currentUserMessage: {
    width: "fit-content"
  },
  container: {
    flexDirection: "column",
    height: "90vh",
    alignItems: "center"
  },
  // Inbox
  inboxContainer: {
    width: "100%"
  },
  outerContainer: {
    flexDirection: "column",
    width: "100%",
    alignItems: "center"
  },
  Link: {
    marginTop: "2em",
    width: "50%",
    ["@media (max-width:800px)"]: {
      width: "100%"
    }
  },
  // Conversation Previews
  // In conversation and inbox pages
  previewContainer: {
    marginBottom: "2em",
    flexDirection: "column",
    background: "white",
    alignItems: "center",
    width: "100%",
    ["@media (max-width:800px)"]: {
      width: "100%"
    },
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    background: theme.bgcolor,
    width: "100%",
    marginBottom: "0.75em",
    ["@media (max-width:800px)"]: {
      flexDirection: "column",
    },
  },
  userImage: {
    border: "3px solid white",
    boxShadow: theme.shadows[5],
    width: "4em",
    height: "4em",
    marginRight: "3em",
    ["@media (max-width:800px)"]: {
      marginRight: "0.75em",
      height: "2em",
      width: "2em"
    },
  },
  messageContainer: {
    alignItems: "center",
    width: "100%"
  },
}))

export const InboxPage = () => {
  const classes = useStyles();
  const [message, setMessage] = useState("");

  const [conversationPreviews, setConversationPreviews] = useState("");
  useEffect(()=>{
    async function getConversationPreviews(){
      const response = await fetch("/messaging/get_conversation_previews");
      const data = await response.json()
      if (data.status === 200){
        setConversationPreviews(data.messages);
      }else{
        setMessage("No conversations yet");
      }
    }
    if(conversationPreviews === ""){
      getConversationPreviews();
    }

  });
  if(conversationPreviews === ""){
    return(
      <Grid container className={classes.loadingContainer}>
        <CircularProgress/>
      </Grid>
    )
  }
  const previews = conversationPreviews.map(item => (
  <Link to={{
    pathname: "/conversation",
    state: {conversation_id: item.conversation_id}
  }} className={classes.Link}>
    <Grid container xs={12} className={classes.outerPreviewContainer}>
      <ListItem className={classes.contentContainer}>
        <ListItemIcon xs={3}>
          <Avatar className={classes.userImage} src={item.image_url} />
        </ListItemIcon>
        {/* Use a grid to align these vertically */}
        <Grid container className={classes.messageContainer}>
          <ListItemText primary={item.user} />
          <ListItemText primary={makePreviewString(item.content)} />
        </Grid>
        <Divider />
      </ListItem>
    </Grid>
  </Link>
  ))
  return (
    <div className={classes.inboxContainer}>
      {message && <Typography>{message}</Typography>}
      <Grid container className={classes.outerContainer} xs={12}>
        {previews}
      </Grid>
    </div>
  )
};








export const ConversationPage = (props) => {
  const {window} = props;
  const classes = useStyles();
  const theme = useTheme();
  const {user} = useContext(UserContext);
  const conversationID = props.location.state.conversation_id;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [conversationMessages, setConversationMessages] = useState(
    ""
  );
  const [otherUserName, setOtherUserName] = useState("");
  const [redirect, setRedirect] = useState("");
  const [message, setMessage] = useState("");
  const [conversationPreviews, setConversationPreviews] = useState("");
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {

    async function getConversation() {
      const requestData = {conversation_id: conversationID};
      const response = await fetch('/messaging/get_conversation_messages', {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        redirect: "manual",
        body: JSON.stringify(requestData)
      });
      const responseData = await response.json();
      setConversationMessages(responseData.messages);
      setOtherUserName(responseData.other_user_name);
    }


    async function getConversationPreviews(){
      const response = await fetch("/messaging/get_conversation_previews", {
        method: 'GET'
      });
      const data = await response.json()
      if (data.status === 200){
        setConversationPreviews(data.messages);
      }else{
        setMessage("No conversations yet");
      }
    }


    if(conversationMessages === ""){
      getConversation();
    }
    if(conversationPreviews === ""){
      getConversationPreviews();
    }
  });
  if (conversationMessages === "" || conversationPreviews === ""){

    return(
      <Grid container className={classes.loadingContainer}>
        <CircularProgress/>
      </Grid>
    )

  }
  // Get conversation previews
  const previews = conversationPreviews.map(item => (
    <Link to={{
      pathname: "/conversation",
      state: {conversation_id: item.conversation_id}
    }}>
      <Grid container>
        <ListItem className={classes.previewContainer}>
          <ListItemIcon xs={3}>
            <Avatar src={item.image_url} />
          </ListItemIcon>
          {/* Use a grid to align these vertically */}
          <Grid container xs={9}>
            <ListItemText primary={item.user} />
            <ListItemText primary={makePreviewString(item.content)} />
          </Grid>
          <Divider />
        </ListItem>
      </Grid>
    </Link>
    ))
  const drawer = (
    <div>
      <List>
        <ListItemIcon className={classes.inboxButton}>
          <InboxIcon />
          {/* TODO - make button to change view */}
          <Button onClick={() => {
            setRedirect(<Redirect to="/inbox"/>)
          }}>
            {redirect}
            <ListItemText primary="Inbox" />
          </Button>
          <Divider/>
        </ListItemIcon>
        {previews}
      </List>
    </div>
  );
  const messages = conversationMessages.map(item => (

  (item.sender_id === user.id ?
    (
      <GridListTile className={classes.outerMessageContainer}>
        <Grid className={classes.currentUserMessageContainer}>
        <Grid className={classes.messageContent}>
            <Grid container className={classes.currentUserMessage}>
              <Typography paragraph>{item.content}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </GridListTile>
    )
    : 
    (
      <GridListTile>
        <Grid container className={classes.outerMessageContainer}>
          <Avatar className={classes.messageImage} src={item.image_url}/>
          <Grid className={classes.messageContent}>
            <Typography paragraph>{item.content}</Typography>
          </Grid>
        </Grid>
      </GridListTile>
    )
  )
))
  const container =
    window !== undefined ? () => window().document.body : undefined;
  return (
    <div className={classes.root}>
      <IconButton
              edge="start"
              onClick={handleDrawerToggle}
              className={classes.drawerButton}
              color="inherit"
              aria-label="menu"
            >
              <DragHandleIcon />
            </IconButton>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      {/* The actual conversation messages - scrollable */}
      <Grid container className={classes.container}>
        <GridList className={classes.conversationContainer} cellHeight="auto">
          <main className={classes.content}>
            {messages}
          </main>
          <Input/>
        </GridList>
      </Grid>
    </div>
  );
}

