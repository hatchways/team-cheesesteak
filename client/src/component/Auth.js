import React, { Component } from "react";
import TopBar from "./TopBar";

const user = {
	FName: 'Pierre',
	LName: 'Smith',
	Province: 'Ontario',
	PostalCode: 'M4C 2R2',
	City: 'Toronto',
	role: 'Chef',
}
	
export default class Auth extends Component {

	constructor(props) {
		super(props)

		const user = this.getUser('Pierre', 'abc')
		this.state = {
			user
		}
	}

	getUser(name, pass) {
		return user
	}


	render() {
		const { classes, user } = this.props;
		return <TopBar user={this.state.user}/>
	}
}


