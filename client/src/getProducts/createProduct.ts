import AWS from "aws-sdk";
import uuid from "uuid";

const dynamodb = new AWS.DynamoDB.DocumentClient();

const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE;

const createProduct = async (event: { body: string }) => {
  try {
    const { title, description, price } = JSON.parse(event.body);

    const productId = uuid.v4();

    const product = {
      id: productId,
      title,
      description,
      price,
    };

    const params: any = {
      TableName: PRODUCTS_TABLE,
      Item: product,
    };

    await dynamodb.put(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(product),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to create product" }),
    };
  }
};

module.exports = { createProduct };
