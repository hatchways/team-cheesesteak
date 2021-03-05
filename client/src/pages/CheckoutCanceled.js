import React from 'react'
import { Container, Grid, Button, Typography } from "@material-ui/core";

const CheckoutCanceled = (props) => {
	
	return (
		<Container>
			<Grid>
				<Grid className="product">
					<Typography variant="h3">Checkout Canceled!</Typography>
					<Typography variant="h5" >Forgot to add something to your cart? Shop around then come back to pay!</Typography>
				</Grid>
			</Grid>
		</Container>
	)
}
export default CheckoutCanceled