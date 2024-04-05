import { handler } from "~/getProducts/getProductsById";
import { APIGatewayProxyEvent } from "aws-lambda";

describe("getProductsById handler", () => {
  test("should return product for valid product id", async () => {
    const event: APIGatewayProxyEvent = {
      pathParameters: { productId: "1" },
    } as any;

    const response = await handler(event);

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.id).toBe(1);
  });

  test("should return 404 for invalid product id", async () => {
    const event: APIGatewayProxyEvent = {
      pathParameters: { productId: "999" },
    } as any;

    const response = await handler(event);
    expect(response.statusCode).toBe(404);
  });
});
