import React, { useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone';
import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
	container: {
		padding: '16px',
		border: '1px solid rgb(232, 232, 232)',
		borderRadius: '3px',
		width: '100%',
		display: 'inline-block'
	},
	body: {
		display: 'flex',
		flexDirection: 'column',
	},
	DropZone: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: '20px',
		borderWidth: '2px',
		borderRadius: '2px',
		borderColor: '#eeeeee',
		borderStyle: 'dashed',
		backgroundColor: '#fafafa',
		color: '#bdbdbd',
		outline: 'none',
		transition: 'border .24s ease-in-out',
	},
	isActive: {
		borderColor: '#2196f3'
	},
	isAccepted: {
		borderColor: '#00e676'
	},
	isRejected: {
		borderColor: '#ff1744'
	},
	thumbnailInner: {
		display: 'flex',
		minWidth: 0,
		overflow: 'hidden'
	},
	thumbnail: {
		display: 'inline-flex',
		borderRadius: 2,
		border: '1px solid #eaeaea',
		marginBottom: 8,
		marginRight: 8,
		width: 100,
		height: 100,
		padding: 4,
		boxSizing: 'border-box'
	},
	thumbsContainer: {
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginTop: 16
	},
	img: {
		display: 'block',
		width: 'auto',
		height: '100%'
	}
}));
const DropZone = (props) => {
	const classes = useStyles();
	const { onDrop, file } = props
	const { getRootProps, getInputProps, isDragActive,
		acceptedFiles, isDragAccept, isDragReject } = useDropzone({
			accept: 'image/*', maxFiles: 1,
			onDrop: file => {
				onDrop(file)
			}
		});

	const styles = useMemo(() => ({
		...classes.DropZone,
		...(isDragActive ? classes.isActive : {}),
		...(isDragAccept ? classes.isAccepted : {}),
		...(isDragReject ? classes.isRejected : {})
	}), [
		isDragActive,
		isDragReject,
		isDragAccept
	]);

	const dbSave = (file) => {

	}

	return (
		<section className={classes.container}>
			<article className={classes.body}>
				<div className={classes.DropZone}{...getRootProps(styles)}>
					<input {...getInputProps()} />
					<em>(Only *.jpg, *.jpeg and *.png images will be accepted)</em>
					{isDragAccept && (<p>All files will be accepted</p>)}
					{isDragReject && (<p>Some files will be rejected</p>)}
					{!isDragActive && (<p>Drag 'n' drop some files here, or click to select files</p>)}
				</div>
				<aside>
					<h4>Preview</h4>

					{file &&
						<Grid>
							<Typography>{file[0].name}</Typography>
						</Grid>
					}
				</aside>
			</article>
		</section>
	);

}

export default DropZone