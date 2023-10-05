import { APIGatewayProxyEvent } from "aws-lambda";
import { SQSEventBody } from "../../types";

const parse = (event: APIGatewayProxyEvent) =>
  event.body ? (JSON.parse(event.body) as unknown) : {};

const log = (event: any) => console.log("SQS EVENT", event);

export { parse, log };
