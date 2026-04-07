const formidable = require('formidable');
const fs = require('fs/promises');

function parseForm(req) {
  const form = formidable({ multiples: false });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ fields, files });
    });
  });
}

async function readUploadedFile(file) {
  const filepath = Array.isArray(file) ? file[0]?.filepath : file?.filepath;
  if (!filepath) {
    throw new Error('No file uploaded');
  }
  return fs.readFile(filepath);
}

module.exports = {
  parseForm,
  readUploadedFile
};
