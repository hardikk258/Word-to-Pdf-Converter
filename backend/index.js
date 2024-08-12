const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const multer = require("multer");
const docxToPDF = require("docx-pdf");
const path = require("path");

app.use(cors());


//setting storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});


const upload = multer({ storage });
app.post("/convertFile", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "NO file uploaded",
      });
    }
    let outoutPath = path.join(
      __dirname,
      "files",
      `${req.file.originalname}.pdf`
    );
    docxToPDF(req.file.path, outoutPath, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Error converting docx to pdf",
        });
      }
      res.download(outoutPath, () => {
        console.log("file downloaded");
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
