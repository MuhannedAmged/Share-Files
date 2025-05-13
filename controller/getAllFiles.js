const { Dropbox } = require("dropbox");
const fs = require("fs");
const fetch = require("isomorphic-fetch");

const dbx = new Dropbox({
  accessToken: process.env.ACCESS_TOKEN,
  fetch,
});
async function getAllFiles(path) {
  try {
    const files = await dbx.filesListFolder({ path });
    return files.result.entries;
  } catch (error) {
    console.error("Error:", error);
  }
}

module.exports = getAllFiles;
