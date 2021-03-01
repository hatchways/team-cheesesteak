import React, {useContext} from 'react'
import {Grid, makeStyles} from "@material-ui/core";
import UserContext from "../context/User";
import MapPin from "../components/MapPin";
import GoogleMapReact from 'google-map-react'

const useStyles = makeStyles(theme => ({
	map: {
		width: '100%',
		height: '40vh'
	}
}))

const Map = ({zoomLevel, location}) => {
	
	const classes = useStyles();
	const { user } = useContext(UserContext);

	return (
		<Grid container={true}>
			<Grid className={classes.map}>
				<GoogleMapReact
						bootstrapURLKeys={{ key: process.env.API_KEY }}
						center={location}
						zoom={zoomLevel}
						
				>
					<MapPin
						lat={location.lat}
						lng={location.lng}
						radius={location.radius}
					/>
				</GoogleMapReact>
			</Grid>
		</Grid>
	)
}

export default Map