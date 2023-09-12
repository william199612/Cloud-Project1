const AWS = require('aws-sdk');
const axios = require('axios');
const express = require('express');
const router = express.Router();
const fs = require('fs');

async function createS3bucket(s3, bucketName) {
  try {
    console.log(bucketName);
    await s3.createBucket({ Bucket: bucketName }).promise();
    console.log(`Created bucket: ${bucketName}`);
    return s3;
  } catch (err) {
    if (err.statusCode === 409) {
      console.log(`Bucket already exists: ${bucketName}`);
    } else {
      console.log(`Error creating bucket: ${err}`);
    }
  }
}

// Upload the JSON data to S3
async function uploadJsonToS3(
  s3,
  bucketName,
  objectKey,
  jsonData
) {
  const params = {
    Bucket: bucketName,
    Key: objectKey,
    Body: JSON.stringify(jsonData), // Convert JSON to string
    ContentType: 'application/json', // Set content type
  };

  try {
    await s3.putObject(params).promise();
    console.log('JSON file uploaded successfully.');
  } catch (err) {
    console.error('Error uploading JSON file:', err);
  }
}

// Retrieve the object from S3
async function getObjectFromS3(s3, bucketName, objectKey) {
  const params = {
    Bucket: bucketName,
    Key: objectKey,
  };

  try {
    const data = await s3.getObject(params).promise();
    // Parse JSON content
    console.log(data.Body);
    const parsedData = JSON.parse(
      data.Body.toString('utf-8')
    );
    console.log('Parsed JSON data:', parsedData);
  } catch (err) {
    console.error('Error:', err);
  }
}

// get object from aws s3
router.post('/getCounter', async function (req, res, next) {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
    region: process.env.AWS_BUCKET_REGION,
  });

  // Create an S3 client
  const s3 = new AWS.S3();

  // Specify the S3 bucket and object key
  const bucketName = process.env.AWS_BUCKET_NAME;
  const objectKey = 'counter.json';

  await createS3bucket(s3, bucketName);
  await getObjectFromS3(s3, bucketName, objectKey);
});

// upload object to aws s3
router.post(
  '/updateCounter',
  async function (req, res, next) {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      sessionToken: process.env.AWS_SESSION_TOKEN,
      region: process.env.AWS_BUCKET_REGION,
    });

    // Create an S3 client
    const s3 = new AWS.S3();

    // Specify the S3 bucket and object key
    const bucketName = process.env.AWS_BUCKET_NAME;
    const objectKey = 'counter.json';

    // JSON data to be written to S3
    const jsonData = {
      count: 1,
    };
    await createS3bucket(s3, bucketName);
    await uploadJsonToS3(
      s3,
      bucketName,
      objectKey,
      jsonData
    );
  }
);

module.exports = router;
