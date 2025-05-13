const { Dropbox } = require("dropbox");
const fs = require('fs');
const fetch = require('isomorphic-fetch');

const dbx = new Dropbox({
  accessToken: process.env.ACCESS_TOKEN,
  fetch,
});

async function downloadFile(fileToDownload, path) {
  try {
    const fileDownloaded = await dbx.filesDownload({ path: fileToDownload });
    const fileDownloadedIntoServer = fs.writeFileSync(
      path,
      fileDownloaded.result.fileBinary,
      "binary"
    );
    return fileDownloadedIntoServer;
  } catch (error) {
    console.error("Error:", error);
  }
}

module.exports = downloadFile;
