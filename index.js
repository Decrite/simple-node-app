const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require('fs');

// App constants
const port = process.env.PORT || 3000;

let pictures = [];

// Create the Express app & setup middlewares
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

  // Construct the file path
  const filePath = path.join(__dirname, 'uploads', filename);

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('File does not exist:', err);
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete the file
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
        return res.status(500).json({ error: 'Error deleting file' });
      }
      pictures = pictures.filter(picture => filename !== picture)
      
      console.log('File deleted successfully');

      // Remove the picture from the pictures array
      const index = pictures.findIndex((picture) => picture.filename === filename);
      if (index !== -1) {
        pictures.splice(index, 1);
      }

      res.status(200).json({ message: 'File deleted successfully' });
    });
  });
});

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Route to handle image upload
app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No image file uploaded");
  }

  // Access the uploaded file using req.file
  console.log('Uploaded file:', req.file);
  
  
  pictures.push(req.file.filename);
  
  // Create the URL to access the uploaded picture
  const pictureUrl = `http://localhost:3000/uploads/${req.file.filename}`;

  // Send the response with the picture URL
  res.status(200).json({
    message: "Image uploaded successfully",
    pictureUrl: pictureUrl,
  });
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
