import { SNS } from 'aws-sdk';

const sns = new SNS();

export async function catalogBatchProcess(event) {
  for (const record of event.Records) {
    const product = JSON.parse(record.body);

    const params = {
      Message: `Product ${product.title} was created in DB`,
      Subject: "New product created",
      TopicArn: process.env.SNS_TOPIC_ARN,
    };

    await sns.publish(params).promise();
  }
}
