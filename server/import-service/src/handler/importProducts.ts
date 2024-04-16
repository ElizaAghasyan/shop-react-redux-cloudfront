const AWS = require('aws-sdk');

const s3 = new AWS.S3();

module.exports.importProducts = async (event) => {
  const { name } = event.queryStringParameters;
  if (!name) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Name parameter is missing in the query string' })
    };
  }

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `uploaded/${name}`,
    Expires: 300,
    ContentType: 'text/csv'
  };

  try {
    const signedUrl = s3.getSignedUrl('putObject', params);
    return {
      statusCode: 200,
      body: JSON.stringify({ signedUrl })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to generate Signed URL', error })
    };
  }
};
