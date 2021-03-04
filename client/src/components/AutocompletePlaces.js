import React, { useState } from 'react'
import {
	Grid,
	TextField, makeStyles
} from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles(theme => ({
	autocompleteContainer: {
		position: "relative",
		width: '100%'
	},
	list: {
		position: "absolute",
		top: '72px',
		backgroundColor: 'white',
		zIndex: 999,
		overflow: "auto",
		maxHeight: `${72*5}px`,
		width:'100%',
	}
}))

const AutocompletePlaces = ({variant,className, locationState}) => {
	const [options,setOptions] = useState([])
	const {location,setLocation} = locationState
	const classes = useStyles()
	
	const handleAutocomplete = e => {
		setLocation(e.target.value)
		
		const options = {
			method: "POST",
			body: JSON.stringify({ location })
		}
		
		fetch('/api/autocomplete',options)
		.then(res => {
			if (res.status < 500) return res.json()
			else throw Error("Server error");
		})
		.then(res => {
			const locations= res.response.locations ?? []
			setOptions(locations)
		})
		.catch(err => {
			console.log(err.message)
		})
	}
	
	return (
			<Grid className={classes.autocompleteContainer}>
				<Autocomplete
					freeSolo
					id="location"
					disableClearable
					options={options}
					onChange={e => setLocation(e.target.innerText)}
					renderInput={(params) => (
						<TextField
							{...params}
							fullWidth
							label='Address'
							name="location"
							value={location}
							className={className}
							margin="normal"
							variant={variant}
							onChange={e => handleAutocomplete(e)}
							InputProps={{ ...params.InputProps, type: 'search' }}
						/>
					)}
				/>
			</Grid>
	)
}

	export default AutocompletePlaces