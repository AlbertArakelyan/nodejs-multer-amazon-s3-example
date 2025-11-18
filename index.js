require('dotenv').config();
const express = require('express');
const multer = require('multer');
const uuid = require('uuid').v4;

const { s3UploadV2, s3UploadV3 } = require('./s3Service');

const app = express();

/**
 * Sing file upload example
 * Argument of `.single` method is the name of the form field that frontend sends
 */
// const upload = multer({ dest: 'uploads/' });
// app.post('/upload', upload.single('file'), (req, res) => {
//   res.json({ status: 'success' });
// });

/**
 * Multiple files upload example
 * First argument of `.array` method is the name of the form field that frontend sends
 * Second argument is the max number of files to accept
 */
// const upload = multer({ dest: 'uploads/' });
// app.post('/upload', upload.array('file', 2), (req, res) => {
//   res.json({ status: 'success' });
// });

/**
 * Multiple fields upload example
 * Argument of `.fields` method is an array of objects defining the form fields
 */
// const upload = multer({ dest: 'uploads/' });
// const multiUpload = upload.fields([
//   { name: 'avatar', maxCount: 1 },
//   { name: 'resume', maxCount: 1 },
// ])
// app.post('/upload', multiUpload, (req, res) => {
//   console.log(req.files);
//   res.json({ status: 'success' });
// });

/**
 * Custom Filename example + File Filter (type checking) + some additional filters (limits -> fileSize)
 * Multiple files upload with customized file names
 * First argument of `.array` method is the name of the form field that frontend sends
 * Second argument is the max number of files to accept
 */
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${uuid()}-${file.originalname}`);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.split('/')[0] === 'image') {
//     cb(null, true);
//   } else {
//     cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'), false, false);
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: {
//     fileSize: 1024 * 1024, // 1 MB limit
//     files: 2, // max 2 files
//   },
// }); 
// 
// app.post('/upload', upload.array('file'), async (req, res) => {
//   res.json({ status: 'success', result });
// });

/**
 * Amazon S3 Upload example,
 * using memory storage to avoid saving files locally
 */
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.split('/')[0] === 'image') {
    cb(null, true);
  } else {
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'), false, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024, // 1 MB limit
    files: 3, // max 3 files
  },
}); 

// SDK v2
// app.post('/upload', upload.array('file'), async (req, res) => {
//   try {
//     const results = await s3UploadV2(req.files);
//     console.log(results);
    
//     return res.json({ status: 'success', results });
//   } catch (err) {
//     console.log(err);
//   }
// });

// SDK v3
app.post('/upload', upload.array('file'), async (req, res) => {
  try {
    const results = await s3UploadV3(req.files);
    console.log(results);
    
    return res.json({ status: 'success', results });
  } catch (err) {
    console.log(err);
  }
});

// Global error handling middleware for Multer errors (and others)
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading.
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size is too large. Max limit is 1MB.' });
    }

    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'File limit reached. Max 2 files are allowed.' });
    }

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: 'Unexpected file type. Only image files are allowed.' });
    }

    return res.status(400).json({ error: err.message });
  } else if (err) {
    // An unknown error occurred when uploading.
    return res.status(400).json({ error: err.message });
  }
  // Everything went fine.
  next();
});

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
