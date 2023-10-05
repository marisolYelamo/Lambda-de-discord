import { config } from "../config";
import { ExternalError } from "./errors/handleErrors";

export const checkConnection = (guildId: string | null) => {
  if (!guildId) {
    throw new ExternalError("discord_error", {
      status: 500,
      message: "Discord connection has failed, no guild id found",
    });
  }
};

export const getRandomInt = (max: number) => Math.floor(Math.random() * max);

export const generateResponse = (code: number, body: any) => {
  return {
    isBase64Encoded: false,
    statusCode: code,
    headers: { "Content-Type:": "application/json" },
    body: JSON.stringify(body),
  };
};
