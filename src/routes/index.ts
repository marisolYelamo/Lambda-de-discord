import { APIGatewayProxyEvent } from "aws-lambda";
import discordController from "../controllers/discord.controller";
import { generateResponse } from "../utils/functions";

export const routeHandler = async (
  event: APIGatewayProxyEvent
): Promise<any> => {
  const routeKey = `${event.httpMethod} ${event.path}`;
  const body = event.body ? JSON.parse(event.body) : {};

  switch (routeKey) {
    case "POST /user/roles":
      return discordController.ADD_ROLE_TO_USER(body);
    case "PATCH /user/roles":
      return discordController.REMOVE_ROLE_FROM_USER(body);
    case "POST /block":
      return discordController.CREATE_IN_BLOCK(body);
    case "DELETE /block":
      return discordController.DELETE_CHANNELS_AND_ROLE(body);
    case "POST /channel/message":
      return discordController.SEND_MESSAGE_CHANNEL(body);
    default:
      return generateResponse(404, "Path not found");
  }
};
