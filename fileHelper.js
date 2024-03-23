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
  