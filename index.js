const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// App constants
const port = process.env.PORT || 3000;
const apiPrefix = "/api";

let pictures = [];

function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";
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
app.use(cors({ origin: /http:\/\/(127(\.\d){3}|localhost)/ }));
app.options("*", cors());

app.delete("/deletePictureOnDevice/:id", (req, res) => {
  const { id } = req.params;
  pictures = pictures.filter((picture) => picture.id !== id);
  deletePictureFromLocalStorage(id);
  res.status(200).send({ message: "Picture removed successfully." });
});

app.get("/getPicturesOnDevice", (_req, res) => {
  loadPicturesFromLocalStorage();
  res.json(pictures);
});

app.post("/setPictureOnDevice", (req, res) => {
  if (!req.body) {
    res.status(400).send({ error: "Bad request: 'data' field is required." });
    return;
  }
  const id = generateRandomString(10);
  const pictureData = req.body;
  const picturePath = path.join(__dirname, "pictures", `${id}.png`);

  fs.writeFile(picturePath, pictureData, "base64", (err) => {
    if (err) {
      console.error("Error saving picture:", err);
      res.status(500).send({ error: "Failed to save picture." });
    } else {
      pictures.push({ id });
      res.status(200).send({ message: "Picture added successfully." });
    }
  });
});

app.delete("/deletePicture/:id", (req, res) => {
  const { id } = req.params;
  pictures = pictures.filter((picture) => picture.id !== id);
  res.status(200).send({ message: "Picture removed successfully." });
});

app.get("/getPictures", (_req, res) => {
  res.json(pictures);
});

/*
app.post('/setPicture', (req, res) => {
  if (!req.body.data ) {
    res.status(400).send({error: "Bad request: 'data' and 'id' fields are required."});
    return;
  }
  const picture = { data: req.body.data, id: generateRandomString(10) };
  console.log(picture)
  pictures.push(picture);
  res.status(200).send(picture);
});*/

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

app.post("/setPicture", upload.single("image"), (req, res) => {
  const id = generateRandomString(10);
  const picturePath = `pictures/${id}.png`;

  // req.file enthält die Blob-Daten
  fs.rename(req.file.path, picturePath, (err) => {
    if (err) {
      console.error("Error saving picture:", err);
      return res.status(500).send({ error: "Failed to save picture." });
    }

    const picture = { id, path: picturePath };
    pictures.push(picture);
    res.status(200).send(picture);
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
