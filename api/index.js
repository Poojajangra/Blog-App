const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');
const uploadMiddleware = multer({ dest: 'uploads/' })

const app = express();
const salt = bcrypt.genSaltSync(10);
const secret = 'wnifnifonw322o4i9yfewu';

// CORS configuration
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

// Enable Mongoose debug mode
mongoose.set('debug', true);

// MongoDB connection
const dbURI = 'mongodb://localhost:27017/blog-app';
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Connection error:', error));

// Register route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(400).json({ error: 'Registration failed' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.findOne({ username });
    if (!userDoc) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
        if (err) {
          throw err;
        }
        res.cookie('token', token, { httpOnly: true }).json({
          id: userDoc._id,
          username,
        });
      });
    } else {
      res.status(400).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Profile route
// Profile route
app.get('/profile', (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Token is required' });
  }
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) {
      return res.status(403).json({ error: 'Token is invalid' });
    }
    res.json(info);
  });
});


// Logout route
app.post('/logout', (req, res) => {
  res.cookie('token', '', { httpOnly: true }).json('ok');
});

// Post creation route
app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Token is required' });
  }
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      return res.status(403).json({ error: 'Token is invalid' });
    }
    const { title, summary, content } = req.body;
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });
    res.json(postDoc);
  });
});



// });

// Post update route
app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Token is required' });
  }
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      return res.status(403).json({ error: 'Token is invalid' });
    }
    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json({ error: 'You are not the author' });
    }
    let newPath = null;
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split('.');
      const ext = parts[parts.length - 1];
      newPath = path + '.' + ext;
      fs.renameSync(path, newPath);
    }
    await postDoc.updateOne({
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover,
    });
    res.json(postDoc);
  });
});


  app.get('/post', async (req, res) => {
    res.json(await Post.find()
      .populate('author', ['username'])
      .sort({ createdAt: -1 })
      .limit(20)
    );
  });

  app.get('/post/:id', async (req, res) => {
    const { id } = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
  })

  // Start the server
  app.listen(4000, () => {
    console.log('Server is running on port 4000');
  });
