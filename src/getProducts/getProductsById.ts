import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const products = [
  { id: 1, name: "Product 1", price: 10.99 },
  { id: 2, name: "Product 2", price: 19.99 },
  { id: 3, name: "Product 3", price: 14.99 },
];

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const productId = event.pathParameters?.productId;

    if (!productId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Product ID is missing" }),
      };
    }

    const product = products.find((p) => p.id.toString() === productId);

    if (product) {
      return {
        statusCode: 200,
        body: JSON.stringify(product),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Product not found" }),
      };
    }
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
