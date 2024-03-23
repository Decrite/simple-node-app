const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require('fs');

const port = process.env.PORT || 3000;

let pictures = [];

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: "*" }));
app.options("*", cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));



app.get("/getPictures", (_req, res) => {
  res.json(pictures);
});


app.delete('/api/delete/:filename', (req, res) => {
  const { filename } = req.params;

  const filePath = path.join(__dirname, 'uploads', filename);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('File does not exist:', err);
      return res.status(404).json({ error: 'File not found' });
    }

    fs.unlink(filePath, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error deleting file' });
      }
      pictures = pictures.filter(picture => filename !== picture)
      

      const index = pictures.findIndex((picture) => picture.filename === filename);
      if (index !== -1) {
        pictures.splice(index, 1);
      }

      res.status(200).json({ message: 'File deleted successfully' });
    });
  });
});

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "uploads/");
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No image file uploaded");
  }
  pictures.push(req.file.filename);
  

  res.status(200).json({
    message: "Image uploaded successfully",
  });
});



app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
