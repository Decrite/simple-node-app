
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

// App constants
const port = process.env.PORT || 3000;
const apiPrefix = '/api';


let pictures = [];


const fs = require('fs');
const path = require('path');


function deletePictureFromLocalStorage(id) {
    const picturePath = path.join(__dirname, 'pictures', `${id}.png`);
    fs.unlink(picturePath, err => {
      if (err) {
        console.error('Error deleting picture:', err);
      } else {
        console.log('Picture deleted successfully.');
      }
    });
  }
  
  function loadPicturesFromLocalStorage() {
    const picturesDirectory = path.join(__dirname, 'pictures');
    fs.readdir(picturesDirectory, (err, files) => {
      if (err) {
        console.error('Error loading pictures:', err);
      } else {
        pictures = files.map(file => ({ id: path.parse(file).name }));
        console.log('Pictures loaded successfully.');
      }
    });
  }
  


function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
  }
  return randomString;
}

  
// Create the Express app & setup middlewares
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: /http:\/\/(127(\.\d){3}|localhost)/}));
app.options('*', cors());


app.delete('/deletePictureOnDevice/:id', (req, res) => {
  const { id } = req.params;
  pictures = pictures.filter(picture => picture.id !== id);
  deletePictureFromLocalStorage(id);
  res.status(200).send({ message: 'Picture removed successfully.' });
});

app.get('/getPicturesOnDevice', (_req, res) => {
  loadPicturesFromLocalStorage();
  res.json(pictures);
});


app.delete('/deletePicture/:id', (req, res) => {
  const { id } = req.params;
  pictures = pictures.filter(picture => picture.id !== id);
  res.status(200).send({ message: 'Picture removed successfully.' });;
});

app.get('/getPictures', (_req, res) => {
  res.json(pictures);
});

app.post('/setPicture', (req, res) => {
  if (!req.body ) {
    res.status(400).send({error: "Bad request: 'data' and 'id' fields are required."});
    return;
  }
  const picture = { data: req.body, id: generateRandomString(10) };
  console.log(picture)
  pictures.push(picture);
  res.status(200).send({ message: 'Picture added successfully.' });
});

app.use(apiPrefix);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
  
