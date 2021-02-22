import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';

import DragHandleIcon from '@material-ui/icons/DragHandle';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { Link } from "react-router-dom";

import UserContext, {logOut} from '../context/User'
const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
	},
	AppBar: {
		backgroundColor: '#fff',
		color: '#000',
		'& a:active': {
			color: 'none'
		}
	},
	AppBarLink: {
		textDecoration: 'none',
		'&:hover': {
			color: '#333'
		},
		'&:active': {
			color: '#333'
		},
		'&:visited': {
			color: '#333'
		},
	},
}));



function TopBar(props) {

	const classes = useStyles();
	const user = useContext(UserContext)
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const routes = ['chef']
	const [top, setTop] = useState({
		top: false,
	});

	const handleMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const toggleDrawer = (open) => (event) => {
		if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
			return;
		}

		setTop({ ...top, 'top': open });
	};

	const list = () => (
		<Grid
			className='top'
			role="presentation"
			onClick={toggleDrawer(false)}
			onKeyDown={toggleDrawer(false)}
		>
			<List>
				{routes.map((text, index) => (
					<Link to={`/${text}`} className={classes.AppBarLink} key={index}>
						<ListItem button key={text}>
							<ListItemText primary={text} />
						</ListItem>
					</Link>
				))}
			</List>
		</Grid>
	);

	return (
		<Grid className={classes.root}>
			<AppBar position="static" className={classes.AppBar}>
				<Toolbar>

					<Typography variant="h5" className={classes.title}>
						<Link to='/' className={classes.AppBarLink}>CHEF'S MENU</Link>
					</Typography>
					<IconButton edge="start" onClick={toggleDrawer(true)} className={classes.menuButton} color="inherit" aria-label="menu">
						<DragHandleIcon />
					</IconButton>
					<Grid>
						<IconButton
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleMenu}
							color="inherit"
						>
							<AccountCircle />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorEl}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={open}
							onClose={handleClose}
						>
							<MenuItem onClick={handleClose}><Link to='/profile' className={classes.AppBarLink}>Profile</Link></MenuItem>
							<MenuItem onClick={logOut}><Link to="/signin">Logout</Link></MenuItem>
						</Menu>
					</Grid>
				</Toolbar>
				<Grid>

					<Drawer
						anchor={"top"}
						open={top["top"]}
						onClose={toggleDrawer(false)}
					>
						{list(routes)}
					</Drawer>
				</Grid>
			</AppBar>
		</Grid>
	);
}

export default TopBar