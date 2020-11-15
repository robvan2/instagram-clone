import { Avatar, Button, Input } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { db } from '../../config/firebase'
import firebase from 'firebase'
import './Post.css'


function Post({ user, postId, username, caption, imgUrl }) {
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db.collection(`posts`)
                .doc(postId)
                .collection('comments')
                .orderBy('timestamp', 'asc')
                .onSnapshot(
                    snapshot => {
                        setComments(snapshot.docs.map(doc => {
                            return { data: doc.data(), key: doc.id }
                        }))
                    }
                )
        }
        return () => {
            unsubscribe()
        }
    }, [postId, setComments])
    const postComment = (event) => {
        event.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            username: user.displayName,
            text: comment,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment('')
    }
    return (
        <div className="post">
            <div className="post__header">
                <Avatar
                    className="post__avatar"
                    src="/something.jpg"
                    alt={username}
                />
                <h3>{username}</h3>
            </div>
            <img className="post__image" src={imgUrl} alt="post" />
            <h4 className="post__text"><strong>{username}</strong> {caption}</h4>
            <div className="post__comments">
                {
                    comments.map((comment) => (
                        <div className="post__comment" key={comment.key}>
                            <p className="post__text"><strong>{comment.data.username}</strong> {comment.data.text}</p>
                        </div>
                    ))
                }
            </div>
            {
                user ?
                    (
                        <div className="post__commentBox">
                            <Input fullWidth={true}
                                type="text"
                                value={comment}
                                onChange={(event) => setComment(event.target.value)}
                                placeholder="what do you think ?"></Input>
                            <Button onClick={postComment}>
                                Post
                            </Button>
                        </div>
                    ) : (
                        ''
                    )
            }

        </div>
    )
}

export default Post
