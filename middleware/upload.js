const util = require("util");
const Multer = require("multer");
const maxSize = 50 * 1024 * 1024;

let processFile = Multer({
  storage: Multer.memoryStorage(),
  limits: { fileSize: maxSize,
            dest: './uploads/' },
}).single("fileUpload");

let processFileMiddleware = util.promisify(processFile);
module.exports = processFileMiddleware;