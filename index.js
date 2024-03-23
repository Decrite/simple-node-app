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
app.use(cors({ origin: "*" }));
app.options("*", cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

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

app.post("/setPicture", (req, res) => {
  if (!req.body.data) {
    res
      .status(400)
      .send({ error: "Bad request: 'data' and 'id' fields are required." });
    return;
  }
  const picture = { data: req.body.data, id: generateRandomString(10) };
  console.log(picture);
  pictures.push(picture);
  res.status(200).send(picture);
});

app.post("/upload", (req, res) => {
  // Access the blob data from the request body
  const blobData = req.body;

  // Process the blob data as needed
  // For example, you could save it to a file, store it in a database, etc.

  // Respond with a success message
  res.status(200).json({ message: blobData });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
