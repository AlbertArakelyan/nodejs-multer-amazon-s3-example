const { S3 } = require('aws-sdk');
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
