import React, {useContext, useEffect, useState} from 'react'
import {
	Container,
	Grid,
	Typography,
	makeStyles,
} from "@material-ui/core";
import {loadStripe} from '@stripe/stripe-js';
import CheckoutCard from '../components/CheckoutCard'
import CardForm from '../components/CardForm'
import UserContext from "../context/User";
import {CardElement, Elements} from "@stripe/react-stripe-js";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe("pk_test_51IP9dfI01HW2iopNkuk01Cq66jLxtw6xBhLeKPHwuD99HdZGB8ORvGaWBjBBSvBXkLxzGcBNY4qAIZElK8zg21JQ005vAdW7Tr");
const useStyles = makeStyles(theme => ({
	payment: {
		boxShadow: theme.boxShadow,
		paddingTop: '50px',
		height: '100vh',
	},
	checkout: {
		paddingTop: '50px',
		backgroundColor: '#f8f8ff',
	},
	heading: {
			padding: '0 0 50px 0',
			borderBottom: '1px solid #cecece',
	},
	body: {
		padding: '50px 0 0 0',
	},
	cardContainer: {
		maxWidth: 345,
	},
	error: {
		color: "#F8F8FF",
		backgroundColor: "#ff3d3d",
	}
}))



// box-shadow: -0px 29px 58px 0px rgba(90,116,148,0.39);
const Checkout = (props) => {
	const styles = useStyles()
	const user = useContext(UserContext)
	
	const [stripe, setStripe]= useState(null)
	const [elements, setElements]= useState(null)
	const [message, setMessage] = useState("");
	
	const [shouldSaveCard, setShouldSaveCard] = useState(false);
	const [total, setTotal]= useState(null)
	
	const [isProcessing, setIsProcessing]= useState(false)
	const [orders, setOrders] = useState([{
		id: 'prod_J2fv3Y0rjveWbx',
		name: '12 course meal',
		description: 'eggs, soup, salad etc..',
		price: 500.00,
		imgURL: ''
	}]);
	const orderState = { orders, setOrders }
	const totalState = { total, setTotal }
	const stripeState = { stripe, setStripe }
	const elementState = { elements, setElements }
	const setupFutureUsage = shouldSaveCard? 'off_session' : ''
	const card = {
		shouldSaveCard,
		setShouldSaveCard,
	}
	
	console.log(card.invalid)
	useEffect(()=>{
		const query = new URLSearchParams(window.location.search);
		if (query.get("success")) {
			setMessage("Order placed! You will receive an email confirmation.");
		}
		if (query.get("canceled")) {
			setMessage("Order canceled -- continue to shop around and checkout when you're ready.")
		}
	},[])
	
	const handleCheckout = async e => {
		if (card.invalid) return
		const stripe = await stripePromise;
		const data = {
			price: total*100,
			description: orders.map(order => order.description).filter(v => v).join(', '),
			paymentMethod: ['card']
		}
		const options = {
			method: 'POST',
			body: JSON.stringify(data)
		}
		
		// make a request for a payment intent
		setIsProcessing(true)
		const response = await fetch("/checkout", options);
		const session = await response.json();
		
		const cardNumberElement = elements.getElement('cardNumber');
		// console.log(session)
		stripe.confirmCardPayment(session.client_secret, {
			setup_future_usage: setupFutureUsage,
			payment_method: {
				card: cardNumberElement,
				billing_details: {
					name: user.name,
					email: user.email,
				},
			},
		})
		.then(result => {
			if (result.error) {
				console.log('error',result.error,result.error.message)
				setMessage(result.error.message)
				return
			}
			if (result.paymentIntent.status === 'succeeded') {
				setMessage("Order placed! You will receive an email confirmation.")
				console.log('success',result.paymentIntent.payment_method)
			}
		})
		.catch(err => {
			setMessage(err.message)
		})
	}
	
	return (
		<Grid container>
			<Grid item md={12} lg={8} className={styles.payment}>
				<Grid className={styles.heading}>
					<Container maxWidth="md">
						<Grid>
							<Typography variant="h3">Checkout</Typography>
						</Grid>
					</Container>
				</Grid>
				<Grid className={styles.body}>
					<Container maxWidth="md">
						<Grid>
							<Typography variant='h6'>Enter your payment details:</Typography>
						</Grid>
						<Grid>
							<Elements stripe={stripePromise}>
								<Typography className={styles.error}>{message? message : ''}</Typography>
								<CardForm card={card} elementState={elementState} stripeState={stripeState}/>
							</Elements>
						</Grid>
					</Container>
				</Grid>
				
			</Grid>
			
			<Grid item sm={12} lg={4} className={styles.checkout}>
				<Container className={styles.cardContainer}>
					<CheckoutCard orderState={orderState}  totalState={totalState} handleCheckout={handleCheckout} isProcessing={isProcessing} />
				</Container>
			</Grid>
		</Grid>
	)
}
export default Checkout