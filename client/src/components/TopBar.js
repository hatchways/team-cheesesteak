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

import UserContext from '../context/User'

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
	},
}));



function TopBar(props) {

	const classes = useStyles();
	const user = useContext(UserContext)
	const [auth, setAuth] = useState(user.role);
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const routes = ['chef']
	const [top, setTop] = useState({
		top: false,
	});
	const handleAuth = (event) => {
		setAuth(event.target.checked);
	};

	const handleMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const toggleDrawer = (anchor, open) => (event) => {
		if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
			return;
		}

		setTop({ ...top, 'top': open });
	};


	const list = (anchor) => (
		<Grid
			className='top'
			role="presentation"
			onClick={toggleDrawer('top', false)}
			onKeyDown={toggleDrawer('top', false)}
		>
			<List>
				{routes.map((text, index) => (
					<Link to={`/${text}`}>
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
						<Link to='/' className='logoname'>CHEF'S MENU</Link>
					</Typography>
					<IconButton edge="start" onClick={toggleDrawer("top", true)} className={classes.menuButton} color="inherit" aria-label="menu">
						<DragHandleIcon />
					</IconButton>
					{auth && (
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
								<MenuItem onClick={handleClose}><Link to='/profile'>Profile</Link></MenuItem>
								<MenuItem onClick={handleAuth}>{auth ? 'Logout' : 'Login'}</MenuItem>
							</Menu>
						</Grid>
					)}
				</Toolbar>
				<Grid>

					<Drawer
						anchor={"top"}
						open={top["top"]}
						onClose={toggleDrawer("top", false)}
					>
						{list(routes)}
					</Drawer>
				</Grid>
			</AppBar>
		</Grid>
	);
}

export default TopBar