import React, { useState } from 'react'
import { FormControl, Container, Button, Typography } from "@material-ui/core";

import UserContext from '../context/User'
import DropZone from '../components/DropZone'

const UploadImg = (props) => {
	// const {user, setUser} = useContext(UserContext)
	const user = { firstname: 'pierre' }
	const [response, setResponse] = useState();
	const [file, setFile] = useState();

	const isImage = (fileType) => {
		if (!fileType) return 'Not An Image'
		let fileTypes = ['image/jpeg', 'image/png'],
			isValid = false,
			fileTypesLength = fileTypes.length

		for (let i = 0; i < fileTypesLength; i++) {
			const type = fileTypes[i];
			if (type == fileType) {
				isValid = true
			}
			return isValid
		}
	}

	const dbSave = (img) => {

	}

	const uploadImg = () => {
		if (!file) {
			setResponse('No Image Chosen.')
			return
		}
		if (!isImage(file[0].type)) {
			setResponse('Not An Image.')
			return
		}

		let formData = new FormData()
		const url = '/api/upload'
		const options = {
			method: "POST",
			body: null
		}

		formData.append('profilePic', file[0])
		formData.append('username', user.firstname)
		options.body = formData

		fetch(url, options)
			.then(res => {
				if (res.status < 500) return res.json();
				else throw Error("Server error");
			})
			.then(res => {
				setResponse(res.response);
				dbSave(res.response.url);
			})
			.catch(err => {
				console.log(err.message);
			});
	}



	return (
		<Container>
			<DropZone onDrop={setFile} file={file} />
			<Button onClick={uploadImg}>Upload</Button>
			{response && <Typography>{response.msg}</Typography>}
		</Container>
	)
}

export default UploadImg