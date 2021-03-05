import React from 'react'
import { Container, Grid, Link, Typography } from "@material-ui/core";

const CheckoutSuccess = (props) => {
	
	return (
		<Container>
			<Grid>
				<Grid className="product">
					<Typography variant="h3">Checkout Approved!</Typography>
					<Typography variant="h5" > We appreciate your business! If you have any questions, please email</Typography>
					<Link href="mailto:orders@example.com" >orders@example.com</Link>
				</Grid>
			</Grid>
		</Container>
	)
}
export default CheckoutSuccess