const { S3 } = require('aws-sdk'); // AWS SDK v2
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3'); // AWS SDK v3 (s3 needs to be installed per service separately)
const uuid = require('uuid').v4;

/**
 * Upload file to S3 bucket using AWS SDK v2 single file
 */
// exports.s3UploadV2 = async (file) => {
//   const s3 = new S3();

//   const param = {
//     Bucket: process.env.AWS_BUCKET_NAME,
//     Key: `uploads/${uuid()}-${file.originalname}`,
//     Body: file.buffer,
//   };

//   const result = await s3.upload(param).promise();

//   return result;
// };

/**
 * Upload multiple files to S3 bucket using AWS SDK v2
 */
exports.s3UploadV2 = async (files) => {
  const s3 = new S3();

  const params = files.map((file) => {
    return {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${uuid()}-${file.originalname}`,
      Body: file.buffer,
    };
  });

  const result = await Promise.all(params.map((param) => s3.upload(param).promise()));

  return result;
};

/** 
 * Upload file to S3 bucket using AWS SDK v3
 */
// exports.s3UploadV3 = async (file) => {
//   const s3Client = new S3Client();

//   const param = {
//     Bucket: process.env.AWS_BUCKET_NAME,
//     Key: `uploads/${uuid()}-${file.originalname}`,
//     Body: file.buffer,
//   };

//   return s3Client.send(new PutObjectCommand(param));
//   // This does not return the uploaded file URL like SDK v2, we need to construct it manually if needed or request,
//   // but better to just construct by concating the file path and name we have with base url of s3 bucket
// };

/**
 * Upload multiple files to S3 bucket using AWS SDK v3
 */
exports.s3UploadV3 = async (files) => {
  const s3Client = new S3Client();

  const params = files.map((file) => {
    return {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${uuid()}-${file.originalname}`,
      Body: file.buffer,
    };
  });

  return Promise.all(
    params.map((param) => s3Client.send(new PutObjectCommand(param))),
  );
  // This does not return the uploaded file URL like SDK v2, we need to construct it manually if needed or request,
  // but better to just construct by concating the file path and name we have with base url of s3 bucket
};