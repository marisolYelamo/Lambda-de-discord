import axios, { AxiosResponse } from "axios";
import { IFetchAPI } from "../../types/discord/discord.types";

const baseURL = "https://discord.com/api";

const createDiscordInstance = (token: string) => {
  const instance = axios.create({
    baseURL,
    headers: { Authorization: "Bot " + token },
  });

  const discordAPI = ({
    method,
    url,
    body,
  }: IFetchAPI): Promise<AxiosResponse> => {
    instance.defaults.headers["Content-Type"] = "application/json";

    return instance({
      method,
      url,
      data: body,
    });
  };

  return discordAPI;
};

export default createDiscordInstance;
