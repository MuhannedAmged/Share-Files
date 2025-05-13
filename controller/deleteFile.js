const { Dropbox } = require("dropbox");
const fs = require("fs");
const fetch = require('isomorphic-fetch');

const dbx = new Dropbox({
  accessToken: process.env.ACCESS_TOKEN,
  fetch,
});

async function deleteFile(path) {
  try {
    const fileDeleted = await dbx.filesDeleteV2({ path });
    return fileDeleted;
  } catch (error) {
    console.error("Error:", error);
  }
}

module.exports = deleteFile;
