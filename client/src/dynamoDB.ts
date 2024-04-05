import AWS from "aws-sdk";
import uuid from "uuid";

const aws_access_key = import.meta.env.VITE_APP_ACCESS_KEY;
const aws_secret_key = import.meta.env.VITE_APP_SECRET_KEY;
const aws_region = import.meta.env.VITE_APP_REGION;

AWS.config.update({
  accessKeyId: aws_access_key,
  secretAccessKey: aws_secret_key,
  region: aws_region,
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

const insertProducts = () => {
  const products = [
    {
      id: uuid.v4(),
      title: "Product 1",
      description: "Description for Product 1",
      price: 100,
    },
    {
      id: uuid.v4(),
      title: "Product 2",
      description: "Description for Product 2",
      price: 200,
    },
  ];

  products.forEach((product) => {
    const params = {
      TableName: "products",
      Item: product,
    };

    dynamodb.put(params, (err) => {
      if (err) {
        console.error(
          "Unable to insert product. Error JSON:",
          JSON.stringify(err, null, 2)
        );
      } else {
        console.log("Product inserted successfully:", product.id);
      }
    });
  });
};

const insertStocks = () => {
  const stocks = [
    {
      product_id: "<product_id_1>",
      count: 50,
    },
    {
      product_id: "<product_id_2>",
      count: 30,
    },
  ];

  stocks.forEach((stock) => {
    const params = {
      TableName: "stocks",
      Item: stock,
    };

    dynamodb.put(params, (err) => {
      if (err) {
        console.error(
          "Unable to insert stock. Error JSON:",
          JSON.stringify(err, null, 2)
        );
      } else {
        console.log(
          "Stock inserted successfully for product:",
          stock.product_id
        );
      }
    });
  });
};

insertProducts();
insertStocks();
