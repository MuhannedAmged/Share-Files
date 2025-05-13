const { Dropbox } = require("dropbox");
const fs = require("fs");
const fetch = require("isomorphic-fetch");

const dbx = new Dropbox({
  accessToken: process.env.ACCESS_TOKEN,
  fetch,
});
async function uploadFile(file, path) {
  try {
    const fileContent = fs.readFileSync(file, "utf8");
    if (fileContent) {
      const fileuploaded = await dbx.filesUpload({
        path,
        contents: fileContent,
      });
      return fileuploaded;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

module.exports = uploadFile;
