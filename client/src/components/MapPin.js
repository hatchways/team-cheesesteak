import React from 'react'
import {Grid, Typography} from "@material-ui/core";
import { Icon } from '@iconify/react'
import circleFill from '@iconify/icons-akar-icons/circle-fill';

import {makeStyles} from "@material-ui/core/styles";
const useStyles = makeStyles(theme => ({
	pin: {
		position: "absolute",
		display: 'flex',
		width: '130px',
		height: '130px',
	},
	pinIcon: {
		color: theme.light,
		fontSize: '1rem',
		
	},
	pinRadius: {
		position: 'absolute',
		top: '-45%',
		left:'-45%',
		// right: '-50%',
		width: '130px',
		height: '130px',
		border: '3px solid rgb(255, 81, 12)',
		backgroundColor: 'rgba(255, 81, 12, 0.4)',
		borderRadius: '50%',
	}
}))

const MapPin = ({text}) => {
	const styles = useStyles()
	return (
		<Grid className={styles.pin}>
			<Grid className={styles.pinRadius}></Grid>
			<Icon icon={circleFill} className={styles.pinIcon} />
		</Grid>
	)
}

export default MapPin