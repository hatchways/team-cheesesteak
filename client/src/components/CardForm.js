import React, {useState} from 'react'
import {
	Grid,
	makeStyles,
	Checkbox,
	FormControlLabel,
	FormControl,
	InputLabel,
	fade,
	InputBase,
	withStyles
} from "@material-ui/core";

import {
	CardCvcElement,
	CardExpiryElement,
	CardNumberElement,
	useElements,
	useStripe
} from '@stripe/react-stripe-js';

const useStyles = makeStyles(theme => ({
	payment: {
		boxShadow: theme.boxShadow,
		paddingTop: '50px',
		height: '100vh',
	},
	paymentHeader: {
		borderBottom: '1px solid #cecece',
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
	form: {
		margin: '15px 0',
		width: '400px'
	},
	formRow: {
		marginBottom: '15px',
		display: "flex",
	},
	formControl: {
		marginRight: '10px'
	},
	checkbox: {
		marginLeft: '-3px',
	},
	checkboxLabel: {
		color: theme.lightOrange,
		fontSize: '.75em!important',
	},
	row: {
		display: 'flex',
		margin: '0 -10px'
	},
	col: {
		flex: 1,
		padding: '0 10px',
		marginBottom: '10px'
	},
	inputContainer: {
		border: '1px solid #aab7c4',
		padding: '20px 24px',
	},
	labelContainer: {
		marginBottom: '10px',
	},
	label: {
		fontSize: '12px',
		fontWeight: '700',
	}
}))
const CARD_ELEMENT_OPTIONS = {
	style: {
		border: '1px solid #aab7c4',
		base: {
			color: "#32325d",
			fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
			fontSmoothing: "antialiased",
			fontSize: "16px",
			"::placeholder": {
				color: "#aab7c4",
			},
		},
		invalid: {
			color: "#fa755a",
			iconColor: "#fa755a",
		},
	},
};

// box-shadow: -0px 29px 58px 0px rgba(90,116,148,0.39);
const CardForm = (props) => {
	const styles = useStyles()
	const [cardNumberElementHasError, setCardNumberElementHasError] = useState(true)
	const [cardExpiryElementHasError, setCardExpiryElementHasError] = useState(true)
	const [cardCvcElementHasError, setCardCvcElementHasError] = useState(true)
	const card= props.card
	const {setElements, elements } = props.elementState
	const {setStripe} = props.stripeState
	const handleSaveCard = () => card.setShouldSaveCard(card.shouldSaveCard !== true)
	
	setElements(useElements())
	setStripe(useStripe())
	card.invalid = cardNumberElementHasError && cardCvcElementHasError && cardExpiryElementHasError
	
	return (
		
			<form className={styles.form} noValidate autoComplete="off">
				<div className={styles.row}>
					<div className={styles.col}>
						<div className={styles.labelContainer}>
							<label for='cardNumber' className={styles.label}>CARD NUMBER</label>
						</div>
						<div className={styles.inputContainer}>
							<CardNumberElement options={CARD_ELEMENT_OPTIONS} onChange={e => setCardNumberElementHasError(e.error!==true)} />
						</div>
					</div>
				</div>
				<div className={styles.row}>
					<div className={styles.col}>
						<div className={styles.labelContainer}>
							<label htmlFor='cardNumber' className={styles.label}>EXPIRY DATE</label>
						</div>
						<div className={styles.inputContainer}>
							<CardExpiryElement options={CARD_ELEMENT_OPTIONS} onChange={e => setCardExpiryElementHasError(e.error!==true)} />
						</div>
					</div>
					<div className={styles.col}>
						<div className={styles.labelContainer}>
							<label htmlFor='cardNumber' className={styles.label}>CVV</label>
						</div>
						<div className={styles.inputContainer}>
							<CardCvcElement options={CARD_ELEMENT_OPTIONS} onChange={e => setCardCvcElementHasError(e.error!==true)} />
						</div>
					</div>
				</div>
				<FormControlLabel
					control={<OrangeCheckbox className={styles.checkbox} onChange={handleSaveCard}/>}
					label="Custom color"
				/>
				
			</form>

	)
}

export default CardForm


const OrangeCheckbox = withStyles((theme) => ({
	root: {
		padding: 0,
		color: theme.lightOrange,
		'&$checked': {
			color: theme.orange,
		},
	},
	checked: {},
}))((props) => <Checkbox color="default" {...props} />);

const BootstrapInput = withStyles((theme) => ({
	root: {
		'label + &': {
			marginTop: theme.spacing(3),
		},
	},
	input: {
		borderRadius: 0,
		position: 'relative',
		backgroundColor: theme.palette.common.white,
		border: '1px solid #ced4da',
		fontSize: 16,
		width: 'auto',
		padding: '10px 12px',
		transition: theme.transitions.create(['border-color', 'box-shadow']),
		// Use the system font instead of the default Roboto font.
		fontFamily: [
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
			'sans-serif',
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"',
		].join(','),
		'&:focus': {
			boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
			borderColor: theme.palette.primary.main,
		},
	},
}))(InputBase);