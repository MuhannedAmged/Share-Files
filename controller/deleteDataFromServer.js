function deleteDataFromServer() {
  const folderPath = "./src/public/img/downloads";
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }
    files.forEach((file) => {
      const filePath = path.join(folderPath, file);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        } else {
          console.log(`Deleted: ${filePath}`);
        }
      });
    });
  });
}

module.exports = deleteDataFromServer;
