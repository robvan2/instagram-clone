import { Button, Input } from '@material-ui/core';
import React, { useState } from 'react'
import firebase from 'firebase'
import { db, storage } from '../../config/firebase';
import './ImageUpload.css';

function ImageUpload({ username }) {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }
    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            snapshot => {
                //progress function
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                )
                setProgress(progress);
            },
            error => {
                //error case
                console.log(error);
                alert(error.message)
            },
            () => {
                storage
                    .ref('images')
                    .child(image.name)
                    .getDownloadURL()
                    .then(
                        imageUrl => {
                            //post a post
                            db.collection('posts').add({
                                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                                caption: caption,
                                username: username,
                                imageUrl: imageUrl
                            })
                        }
                    )
                setCaption('')
                setProgress(0)
                setImage(null)
            }
        )
    }

    return (
        <div className="imageUpload">
            <progress className="imageUpload__progress" value={progress} max="100" />
            <Input fullWidth={true} type="text" value={caption} onChange={event => setCaption(event.target.value)} placeholder="Enter a caption" />
            <Input fullWidth={true} type="file" onChange={handleChange} />
            <Button color='primary' variant="contained" className="imageUpload__button" onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload