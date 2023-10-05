interface IEnvConfig {
  NODE_ENV: string;
  DISCORD_API_KEY: string;
  DISCORD_API_URL: string;
  DISCORD_TOKEN: string;
  MANAGER_CHANNEL_ID: string;
}

export const config: IEnvConfig = (() => {
  const NODE_ENV = process.env.NodeEnv;
  const DISCORD_API_KEY = process.env.discordApiKey;
  const DISCORD_API_URL = process.env.discordApiUrl;
  const DISCORD_TOKEN = process.env.discordToken;
  const MANAGER_CHANNEL_ID = process.env.managerChannelId;

  if (
    !NODE_ENV ||
    !DISCORD_API_KEY ||
    !DISCORD_API_URL ||
    !DISCORD_TOKEN ||
    !MANAGER_CHANNEL_ID
  ) {
    const envs = { NODE_ENV, DISCORD_API_KEY, DISCORD_API_URL, DISCORD_TOKEN };
    const missingVar = Object.entries(envs).find(
      ([, value]) => value === undefined
    );
    throw new Error(
      `Missing environment variable "${
        missingVar && missingVar[0]
      }". Please check your .env file`
    );
  }

  return {
    NODE_ENV,
    DISCORD_API_KEY,
    DISCORD_API_URL,
    DISCORD_TOKEN,
    MANAGER_CHANNEL_ID,
  };
})();
