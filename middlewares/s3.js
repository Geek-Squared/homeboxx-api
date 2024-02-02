const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require("@aws-sdk/client-s3");
const path = require('path');

aws.config.update({
  secretAccessKey: '42X9mKTACAV2CW+omg0IC3O1CYtKmfi9R/VJ6vhL',
  accessKeyId: 'AKIAQK6EYEIEF7HNBF4Y',
});

const s3 = new S3Client({
  credentials: {
      accessKeyId: "AKIAQK6EYEIEF7HNBF4Y",
      secretAccessKey: "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"
  },
  region: "eu-north-1"
})

const upload = multerS3({
  s3: s3,
  bucket: "homeboxx-bucket",
  metadata: (req, file, cb) => {
      console.log('Metadata: ', {fieldname: file.fieldname});
      cb(null, {fieldname: file.fieldname})
  },
  key: (req, file, cb) => {
      const fileName = Date.now() + "_" + file.fieldname + "_" + file.originalname;
      console.log('File Key: ', fileName);
      cb(null, fileName);
  }
});

function sanitizeFile(file, cb) {
  // Define the allowed extension
  const fileExts = [".png", ".jpg", ".jpeg", ".gif"];

  // Check allowed extensions
  const isAllowedExt = fileExts.includes(
      path.extname(file.originalname.toLowerCase())
  );

  // Mime type must be an image
  const isAllowedMimeType = file.mimetype.startsWith("image/");

  if (isAllowedExt && isAllowedMimeType) {
      return cb(null, true); // no errors
  } else {
      // pass error msg to callback, which can be displayed in frontend
      cb("Error: File type not allowed!");
  }
}

const uploadImage = multer({
  storage: upload,
  fileFilter: (req, file, callback) => {
      sanitizeFile(file, callback)
  },
  limits: {
      fileSize: 1024 * 1024 * 2 // 2mb file size
  }
})

module.exports = uploadImage;