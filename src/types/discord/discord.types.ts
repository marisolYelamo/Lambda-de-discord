import { Method } from "axios";
import { config } from "../../config";

export interface IFetchAPI {
  url: string;
  method: Method;
  body?: { [key: string]: unknown };
  query?: string;
}
export type ChannelType =
  | "GUILD_TEXT"
  | "DM"
  | "GUILD_VOICE"
  | "GROUP_DM"
  | "GUILD_CATEGORY"
  | "GUILD_NEWS"
  | "GUILD_STORE"
  | "GUILD_NEWS_THREAD"
  | "GUILD_PUBLIC_THREAD"
  | "GUILD_PRIVATE_THREAD"
  | "GUILD_STAGE_VOICE";

export interface IOverwrite {
  id: string;
  type: 0 | 1; // 0 for role or 1 for member
  allow?: string;
  deny?: string;
}
export interface IChannelData {
  name: string;
  parent_id?: string;
  permission_overwrites?: IOverwrite[];
}

export interface IChannelCreationData {
  type: "text" | "voice";
  name: string;
  extraRolesIds: string[];
}
export interface IChannel extends IChannelData {
  type: ChannelType;
}

export interface IRoleData {
  name: string;
  color: number;
  permissions?: string;
  mentionable?: boolean;
}

export interface IRole extends IRoleData {
  readonly id: string;
}

export enum Channels {
  MANAGER = "manager",
}
