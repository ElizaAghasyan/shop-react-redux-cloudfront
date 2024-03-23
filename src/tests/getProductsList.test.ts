import { handler } from "~/getProducts/getProductsList";
import { APIGatewayProxyEvent } from "aws-lambda";

describe("GetProductsList handler", () => {
  test("should return array of products", async () => {
    const event: APIGatewayProxyEvent = {} as any;

    const response = await handler(event);

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.body);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });
});
