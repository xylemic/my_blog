const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blogs');
const port = process.env.PORT || 8000;

const app = express();
app.set('view engine', 'ejs');

// connect to mongoDB
const dbURL = 'mongodb+srv://danielbobbyjohnson:svqP9oFek7zb7iIV@nodeproject.i0jxc.mongodb.net/node-project?retryWrites=true&w=majority&appName=nodeProject';
mongoose.connect(dbURL)
.then((result) => app.listen(port, () => {
  console.log(`listening on port ${port}`);
  console.log('connected to database');
}))
 .catch((error) => console.log('error connecting to db', error.message));


// middleware for static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// mongoose and mongo sandbox routes
// app.get('/add-blog', (req, res) => {
//   const blog = new Blog({
//     title: 'new blog post',
//     snippet: 'this is a new blog post',
//     body: 'lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo, repudiandae?'
//   });
//   blog.save()
//   .then((result) => {
//     res.send(result);
//   })
//   .catch((error) => console.log('error saving blog post', error.message));
// })

// app.get('/all-blogs', (req, res) => {
//   Blog.find()
//   .then((result) => {
//     res.send(result);
//   })
//   .catch((error) => console.log('error retrieving blogs', error.message));
// })

// app.get('/single-blog', (req, res) => {
//   Blog.findById(req.params.id)
//   .then((result) => {
//     res.send(result);
//   })
//   .catch((error) => console.log('error retrieving blog', error.message));
// })


app.get('/', (req, res) => {
  console.log(`request was made on this url: ${req.url}`);
  res.redirect('/blogs');
})

app.get('/about', (req, res) => {
  console.log(`request was made on this url: ${req.url}`);
  res.render('about', { title: 'about' });
})

// blog routes
app.get('/blogs', (req, res) => {
  Blog.find().sort({ createdAt: -1 })
  .then((result) => {
     res.render('index', { title: 'all blogs', blogs: result });
  })
  .catch((error) => console.log('error retrieving blogs', error.message));
});

app.post('/blogs', (req, res) => {
  const blog = new Blog(req.body);
  blog.save()
  .then((result) => {
     res.redirect('/blogs');
   })
   .catch((error) => console.log('error saving blog post', error.message));
})

app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'create blog' });
})

app.get('/blogs/:id', (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
  .then(result => {
    res.render('details', { blog: result, title: 'blog details' });
  })
  .catch((err) => console.log(err));
})

app.delete('/blogs/:id', (req, res) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
  .then((result) => {
    // res.redirect('/blogs');
    res.json({ redirectTo: '/blogs' });
  })
  .catch((err) => console.log(err));
})

app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
})


