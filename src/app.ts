import { APIGatewayProxyEvent, SQSEvent } from "aws-lambda";
import DiscordController from "./controllers/discord.controller";
import { routeHandler } from "./routes";
import { checkAndHandleErrors, LambdaError } from "./utils/errors/handleErrors";

import { parse, log } from "./utils/events";

export const lambdaHandler = async (event: APIGatewayProxyEvent) => {
  try {
    const APIEvent = parse(event);

    // checkRequiredEventParameters(SQSEventBody);

    log(APIEvent);

    const res = await routeHandler(event);
    return res;
  } catch (error) {
    return checkAndHandleErrors(error as LambdaError);
  }
};
//Change according to event type
