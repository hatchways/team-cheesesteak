import React, {useContext} from 'react'
import {Grid, makeStyles, Typography} from "@material-ui/core";
import UserContext from "../context/User";
import MapPin from "../components/MapPin";
import GoogleMapReact from 'google-map-react'

const useStyles = makeStyles(theme => ({
	map: {
		width: '100%',
		height: '40vh'
	}
}))

const Map = ({zoomLevel, location, radius}) => {
	
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
						radius={zoomLevel}
						lat={location.lat}
						lng={location.lng}
						text={location.address}
						radius={location.radius}
					/>
				</GoogleMapReact>
			</Grid>
		</Grid>
	)
}

export default Map

// 	.map-h2 {
// 	text-transform: uppercase;
// 	font-size: 1rem;
// 	padding: 20px;
// 	padding-left: 10px;
// 	text-align: center;
// }
//
// .google-map {
// 	width: 100%;
// 	height: 60vh;
// }
//
//
// @media screen and (min-width: 799px) {
// .google-map {
// 		height: 80vh;
// 	}
//
// .map-h2 {
// 		font-size: 1.3rem;
// 		font-weight: 400;
// 	}
//
// .pin {
// 		width: 15vw;
// 	}
//
// .pin-icon {
// 		font-size: 10vw;
// 	}
// }
