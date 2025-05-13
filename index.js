require("dotenv").config();
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 3000;
const deleteFile = require("./controller/deleteFile");
const getAllFiles = require("./controller/getAllFiles");
const uploadFile = require("./controller/uploadFile");
const downloadFile = require("./controller/downloadFile");
const generateRandomString = require("./controller/generateRandomString");
const deleteDataFromServer = require("./controller/deleteDataFromServer");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "dropbox", "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.use(express.static("src"));
app.use(express.static("page"));
app.set("views", path.join(__dirname, "src", "page"));
app.set("view engine", "ejs");



app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "لا يوجد ملف تم رفعه." });
  }
  const filePath = path.join(
    __dirname,
    "dropbox",
    "uploads",
    req.file.filename
  );
  console.log(filePath);

  const randomString = generateRandomString(15);

  const fileUploaded = await uploadFile(
    `./dropbox/uploads/${req.file.filename}`,
    `/${randomString}.${req.file.filename.split(".")[1]}`
  );
  console.log("File uploaded", fileUploaded);

  console.log(req.file);

  res.status(200).json({
    message: "تم رفع الملف بنجاح!",
    fileName: req.file.filename,
    filePath: `/dropbox/uploads/${req.file.filename}`,
    downloadUrl: `${randomString}.${req.file.filename.split(".")[1]}`,
    sizeFile: (req.file.size / (1024 * 1024)).toFixed(2) + " MB",
  });

  setTimeout(() => {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("خطأ في حذف الملف:", err);
      } else {
        console.log(`تم حذف الملف: ${req.file.filename}`);
      }
    });
  }, 2000);
});
app.get("/download/:name", async (req, res) => {
  const { name } = req.params;
  console.log(name);

  const path = `./src/public/img/downloads/${name}`;

  const fileDonwloaded = await downloadFile(
    `/${name}`,
    `./src/public/img/downloads/${name}`
  );

  if (fs.existsSync(path)) {
    console.log("الملف موجود");
  } else {
    console.log("الملف  hkjkhkhkhhموجود");
    res.redirect("/");
    return;
  }
  console.log("file Downloaded", fileDonwloaded);

  let fileSizeInMB = (0).toFixed(2);
  fs.stat(`./src/public/img/downloads/${name}`, async (err, stats) => {
    if (err) {
      console.error("حدث خطأ:", err);
      return;
    }
    fileSizeInMB = await (stats.size / (1024 * 1024)).toFixed(2);
    console.log(fileSizeInMB);
  });

  res.render("download", { name: name, fileSizeInMB: fileSizeInMB });

  const fileDeleted = await deleteFile(`/${name}`);
  console.log(fileDeleted);
});
app.use(function (req, res, next) {
  res.status(404);
  if (req.accepts("html")) {
    res.render("404", { url: req.url });
  } else if (req.accepts("json")) {
    res.json({ error: "Not found" });
  } else {
    res.type("txt").send("Not found");
  }
});
setInterval(() => {
  deleteDataFromServer();
}, 24 * 60 * 60 * 1000);

app.listen(port, () => {
  console.log(`الخادم يعمل على: http://localhost:${port}`);
});
