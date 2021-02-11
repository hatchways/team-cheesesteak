import React, { Component } from "react";

import { Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';


const landinPageStyle = theme => ({
	landingContainer: {
		margin: theme.spacing.unit * 2
	}
});

class ProfilePage extends Component {

	render() {
		const { classes } = this.props;
		const userName = 'Pierre Smith'
		const userLocation = 'Toronto, Ontario'
		return (
			<Container className={[]}>

				<Grid container spacing={0} className={[]}>
					<Typography variant="p" className={classes.title}>
						Profile Page
					</Typography>

				</Grid>
			</Container>
		);
	}
}

export default withStyles(landinPageStyle)(ProfilePage);
