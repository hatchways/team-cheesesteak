import React from 'react'
import { Container, Typography } from "@material-ui/core";
import {Redirect} from "react-router-dom";

const PageNotFound = (props) => {
	
	fetch('/test')
	.then(response => response.json())
	.then(data => console.log(data))
	
	return (
		<Container>
			<Typography>TEST</Typography>
		</Container>
	)
}
export default PageNotFound