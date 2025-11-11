const { S3 } = require('aws-sdk');
const uuid = require('uuid').v4;

exports.s3UploadV2 = async () => {
  const s3 = new S3();

  const param = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${uuid()}-sample.txt`,
  };

  s3.upload
};
