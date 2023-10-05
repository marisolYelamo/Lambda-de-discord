import { config } from "../../config";
import { Channels } from "../../types";

export const channelTypes: { [key: string]: any } = {
  GUILD_TEXT: 0,
  DM: 1,
  GUILD_VOICE: 2,
  GROUP_DM: 3,
  GUILD_CATEGORY: 4,
  GUILD_NEWS: 5,
  GUILD_STORE: 6,
  GUILD_NEWS_THREAD: 10,
  GUILD_PUBLIC_THREAD: 11,
  GUILD_PRIVATE_THREAD: 12,
  GUILD_STAGE_VOICE: 13,
};

export const channelsIds = {
  [Channels.MANAGER]: config.MANAGER_CHANNEL_ID,
};
