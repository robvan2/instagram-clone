import { Button, Input, makeStyles, Modal, TextField } from '@material-ui/core';
import { useEffect, useState } from 'react';
import './App.css';
import ImageUpload from './components/image-upload/ImageUpload';
import Post from './components/post/Post';
import { auth, db } from './config/firebase';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  //modal state
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false)
  const [openLogin, setOpenLogin] = useState(false)
  //form (signup states)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  //app States
  const [posts, setPosts] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => {
        return { id: doc.id, post: doc.data() };
      }));
    })
    return () => {
      unsubscribe()
    }
  }, [setPosts])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user Logged In
        setUser(authUser)
      } else {
        //User Logged out 
        setUser(null);
      }
    })
    return () => {
      unsubscribe();
    }
  }, [setUser])

  const signUp = (event) => {
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch(error => {
        alert(error.message);
      })
      .finally(() => {
        setEmail('');
        setPassword('');
        setUsername('');
      });
    setOpen(false);
  }
  const signIn = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
      .then((authUser) => {
        setUsername(authUser.user.displayName);
      })
      .catch(error => alert(error.message))
      .finally(() => {
        setEmail('');
        setPassword('');
      });
    setOpenLogin(false);
  }
  return (
    <div className="app">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__modal">
            <center>
              <img className="app__headerImage"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1024px-Instagram_logo.svg.png"
                alt="Instagram" />
            </center>
            <Input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => { setUsername(e.target.value) }}
            />
            <Input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value) }}
            />
            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value) }}
            />
            <Button onClick={signUp}>
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>
      <Modal open={openLogin} onClose={() => setOpenLogin(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__modal">
            <center>
              <img className="app__headerImage"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1024px-Instagram_logo.svg.png"
                alt="Instagram" />
            </center>
            <TextField
              type="email"
              label="Email"
              value={email}
              onChange={(e) => { setEmail(e.target.value) }}
            />
            <TextField
              type="password"
              label="Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value) }}
            />
            <Button variant="contained" onClick={signIn}>
              Login
            </Button>
          </form>
        </div>
      </Modal>
      <div className="app__header">
        <img className="app__headerImage"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1024px-Instagram_logo.svg.png"
          alt="Instagram" />
        <div className="app__headerButtons">
          {
            user ?
              (
                <Button onClick={() => auth.signOut()}>Logout</Button>
              )
              :
              (
                <div className="app__loginContainer">
                  <Button onClick={() => setOpenLogin(true)}>Login</Button>
                  <Button onClick={() => setOpen(true)}>SignUp</Button>
                </div>
              )
          }

        </div>
      </div>
      <div className="app__posts">
        <div className="app__postsLeft">
          {
            posts.map(({ id, post }) =>
              <Post key={id} user={user} postId={id} username={post.username} caption={post.caption} imgUrl={post.imageUrl} />
            )
          }
        </div>
        <div className="app__postsRight">
          <InstagramEmbed
            className="app__embed"
            url='https://www.instagram.com/p/CHL4z9gA_Fe/'
            clientAccessToken='695574838056399|4238afbf2e54ddaefb58be7e49fd4927'
            maxWidth={326}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => { }}
            onSuccess={() => { }}
            onAfterRender={() => { }}
            onFailure={() => { }}
          />
          {user && (
            <div className="app__uploadPost">
              <h3 className="uploadPost__header">
                Add a Post
              </h3>
              <ImageUpload username={user.displayName} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
