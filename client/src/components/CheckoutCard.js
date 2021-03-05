import {
	Button,
	Card, CardContent, Grid,
	IconButton, List,
	ListItem,
	ListItemAvatar,
	ListItemSecondaryAction,
	ListItemText, makeStyles,
	Typography
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";

const useStyles = makeStyles(theme => ({
	
	checkoutButton: {
		...theme.fullWidthButton,
		padding: '30px 50px'
	},
	cardContainer: {
		maxWidth: 345,
	},
	cardRoot: {
		maxWidth: 345,
	},
	cardListContainer: {
		padding: '10px 0'
	},
	cardTimeContainer: {
		padding: '10px 0',
	},
	cardTotalContainer: {
		padding: '10px 0'
	},
	topContent: {
		borderBottom: '1px solid #dfdfdf',
	},
	total: {
		color: theme.lightOrange
	}
}))

const CheckoutCard = props => {
	const styles = useStyles()
	const {orders, setOrders} = props.orderState
	const {total, setTotal} = props.totalState
	const {isProcessing} = props.isProcessing
	const {handleCheckout} = props
	const time = '25 July at 8pm'
	let sum=0
	
	const handleOrderDeletion = (id) => {
		let price
		setOrders(orders.filter(order => {
			price=order.price
			return order.id !== id
		}))
		sum-=price
		setTotal(total)
	}
	
	const toDollars = (num) => {
		let p = num.toFixed(2).split(".");
		return ["$", p[0].split("").reverse().reduce((acc, num, i) =>{
			return num + (i && !(i % 3) ? "," : "") + acc;
		}, "."), p[1]].join("");
	}
	
	const listItems = orders.map(({id, imgURL, description,  price}, key) => {
		sum+=price
		
		const descriptionTxt = (
			<Typography component="span" variant="body2" color="textPrimary">
				{description}
			</Typography>
		)
		
		return (
			<ListItem key={key}>
				<ListItemAvatar>
					<img src={imgURL} alt='img' />
				</ListItemAvatar>
				<ListItemText secondary={toDollars(price)}>{descriptionTxt}</ListItemText>
				<ListItemSecondaryAction>
					<IconButton edge="end" aria-label="delete">
						<DeleteIcon onClick={() => handleOrderDeletion(id)} />
					</IconButton>
				</ListItemSecondaryAction>
			</ListItem>
		)
	})
	setTotal(sum)
	return (orders.length) ?(
		<Card className={styles.cardRoot} {...props.className}>
			<CardContent className={styles.topContent}>
				<Grid className={styles.cardListContainer}>
					<List>
						{listItems}
					</List>
				</Grid>
				<Grid className={styles.cardTimeContainer}>
					<Typography display='inline' variant='subtitle2'>Arrival time: </Typography>
					<Typography display='inline' variant='body2'>{time}</Typography>
				</Grid>
			</CardContent>
			
			<CardContent>
				<Grid container className={styles.cardTotalContainer}>
					<Grid item sm={8} >
						<Typography variant='h6'>Total:</Typography>
					</Grid>
					<Grid item sm={4}>
						<Typography variant='h6' className={styles.total}>{toDollars(sum)}</Typography>
					</Grid>
				</Grid>
			</CardContent>
			<Grid>
				<Button className={styles.checkoutButton} id="checkout-button" variant="contained" color="primary" onClick={handleCheckout}>Checkout</Button>
			</Grid>
		</Card>
	) : (
		<Card>
			<CardContent>
				<Typography variant='h4'>No orders in cart</Typography>
			</CardContent>
			<CardContent>
				<Grid container className={styles.cardTotalContainer}>
					<Grid item sm={8} >
						<Typography variant='h6'>Total:</Typography>
					</Grid>
					<Grid item sm={4}>
						<Typography variant='h6' className={styles.total}>{toDollars(sum)}</Typography>
					</Grid>
				</Grid>
			</CardContent>
			<Grid>
				<Button className={[styles.checkoutButton]} id="checkout-button" variant="contained" disabled={isProcessing} color="primary" onClick={handleCheckout}>{isProcessing? 'Processing...': 'Checkout'}</Button>
			</Grid>
		</Card>
	)
}

export default CheckoutCard