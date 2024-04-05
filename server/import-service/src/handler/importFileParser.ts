const AWS = require('aws-sdk');
const csvParser = require('csv-parser');

const s3 = new AWS.S3();

module.exports.importFileParser = async (event) => {
  const recordPromises = event.Records.map(async (record) => {
    const bucketName = record.s3.bucket.name;
    const objectKey = record.s3.object.key;

    if (!objectKey.endsWith('.csv')) {
      console.log(`Skipped non-CSV file: ${objectKey}`);
      return;
    }

    try {
      const stream = s3.getObject({ Bucket: bucketName, Key: objectKey }).createReadStream();
      stream.pipe(csvParser())
        .on('data', (data) => {
          console.log('Parsed record:', data);
        })
        .on('end', () => {
          console.log('CSV file parsing finished');
        });
    } catch (error) {
      console.error('Error parsing CSV file:', error);
    }
  });

  await Promise.all(recordPromises);
};
