import DiscordRepository from "./discord.repository";
import { config } from "../config";

const bot = new DiscordRepository(config.DISCORD_TOKEN);

export default bot;
