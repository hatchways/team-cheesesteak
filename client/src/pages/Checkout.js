import React from 'react'
import { Container, Typography } from "@material-ui/core";
import {Redirect} from "react-router-dom";

const Checkout = (props) => {
	
	fetch('/test')
	.then(response => response.json())
	.then(data => console.log(data))
	
	return (
		<Container>
		
		</Container>
	)
}
export default Checkout