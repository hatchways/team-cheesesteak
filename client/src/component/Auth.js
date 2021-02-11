import React from "react";
import TopBar from "./TopBar";

	

export default function Auth(props) {
	const user = getUser('Pierre', 'abc')


	function getUser(name, pass) { // this will be 
		// const url = ''
		// const options = {}
		// const res = await fetch(url, options)
		// let data = {}
		// 	if (res.ok) {
		// 		data = res.json()
		// 	} else {
		// 		alert("HTTP-Error: " + response.status);
		// 	}

		const user = {
			FName: 'Pierre',
			LName: 'Smith',
			Province: 'Ontario',
			PostalCode: 'M4C 2R2',
			City: 'Toronto',
			role: 'Chef',
		}

		return user
	}
	

	return <TopBar user={user} />
}

