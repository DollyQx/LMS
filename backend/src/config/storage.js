// This is a stub configuration for cloud storage (AWS S3)
// To fully implement, you would use aws-sdk and multer-s3 here.

const storageConfig = {
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  bucketName: process.env.AWS_S3_BUCKET,
};

module.exports = storageConfig;
