import AWS = require("aws-sdk");
import csvParser = require("csv-parser");

const s3 = new AWS.S3();
const sqs = new AWS.SQS();

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
          sqs.sendMessage({
            QueueUrl: "https://sqs.eu-central-1.amazonaws.com/776239653624/my-queue-name",
            MessageBody: JSON.stringify(data),
          }, (error) => {
            if (error) console.error(`Failed to send a message to SQS: ${error}`);
          });
        })
        .on('error', (error) => {
          console.error(`Error during parsing CSV from S3: ${error}`);
        })
        .on('end', () => {
          console.log('CSV file processed successfully');
        });
    } catch (error) {
      console.error('Error parsing CSV file:', error);
    }
  });

  await Promise.all(recordPromises);
};
