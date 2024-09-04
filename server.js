const http = require('http');
const fs = require('fs');
const PORT = 7070;

const server = http.createServer((req, res) => {
  console.log(`request was made on this url: ${req.url}`);

  let path = './views/';

  switch (req.url) {
    case '/':
      path += 'index.html';
      res.statusCode = 200;
      break;
    case '/about':
      path += 'about.html';
      res.statusCode = 200;
      break;
    case '/about-me':
      path += 'about.html';
      res.statusCode = 301;
      res.setHeader('Location', '/about');
      res.end();
      break;
    default:
      path += '404.html';
      res.statusCode = 404;
      break;
  }

  fs.readFile(path, (err, data) => {
    if (err) {
      return res.end('Error loading index.html');
    } else {
      res.end(data);
    }
  })
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
})
