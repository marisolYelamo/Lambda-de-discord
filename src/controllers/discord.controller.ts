import DiscordServices from "../services/discord.services";
import { IChannelCreationData, IChannelData } from "../types";
import { requireProperties } from "../utils/events/checkRequiredParameters";
import { LambdaError } from "../utils/errors/handleErrors";
import { generateResponse } from "../utils/functions";

class DiscordController {
  public static async clearGuild() {
    try {
      await DiscordServices.clearGuild();

      return generateResponse(204, "OK");
    } catch (error) {
      throw error as LambdaError;
    }
  }

  public static async createCategory(
    data: Required<Pick<IChannelData, "name">> &
      Partial<Pick<IChannelData, "parent_id" | "permission_overwrites">>
  ) {
    try {
      requireProperties("body.payload", data, {
        name: "string",
      });
      const createCategory = await DiscordServices.createCategory(data);
      return generateResponse(201, createCategory);
    } catch (error) {
      throw error as LambdaError;
    }
  }

  public static async createVoiceChannel(
    data: Required<Pick<IChannelData, "name">> &
      Partial<Pick<IChannelData, "parent_id" | "permission_overwrites">>
  ) {
    try {
      requireProperties("body.payload", data, {
        name: "string",
      });
      const createVoiceChannel = await DiscordServices.createVoiceChannel(data);
      return generateResponse(201, createVoiceChannel);
    } catch (error) {
      throw error as LambdaError;
    }
  }

  public static async createTextChannel(
    data: Required<Pick<IChannelData, "name">> &
      Partial<Pick<IChannelData, "parent_id" | "permission_overwrites">>
  ) {
    try {
      requireProperties("body.payload", data, {
        name: "string",
      });
      const createTextChannel = await DiscordServices.createTextChannel(data);
      return generateResponse(201, createTextChannel);
    } catch (error) {
      throw error as LambdaError;
    }
  }

  public static async deleteChannel(payload: { id: string }) {
    try {
      requireProperties("body.payload", payload, { id: "string" });
      const { id } = payload;

      await DiscordServices.deleteChannel(id);
      return generateResponse(204, "Deleted");
    } catch (error) {
      throw error as LambdaError;
    }
  }

  public static async sendChannelMessage(payload: {
    channelId: string;
    content: string;
  }) {
    try {
      requireProperties("body.payload", payload, {
        channelId: "string",
        content: "string",
      });
      const { channelId, content } = payload;
      await DiscordServices.sendChannelMessage(channelId, content);
      return generateResponse(204, "Message sent");
    } catch (error) {
      throw error as LambdaError;
    }
  }

  // un solo createRole
  public static async createCategoryRole(payload: { name: string }) {
    try {
      requireProperties("body.payload", payload, { name: "string" });
      const { name } = payload;
      const newCategoryRole = await DiscordServices.createCategoryRole(name);
      return generateResponse(201, newCategoryRole);
    } catch (error) {
      throw error as LambdaError;
    }
  }

  public static async deleteRole(payload: { id: string }) {
    try {
      requireProperties("id.params", payload, { id: "string" });
      const { id } = payload;
      await DiscordServices.deleteRole(id);
      return generateResponse(204, "Deleted");
    } catch (error) {
      throw error as LambdaError;
    }
  }

  public static async addRoleToUser(payload: {
    userId: string;
    roleId: string;
  }) {
    try {
      requireProperties("body.payload", payload, {
        userId: "string",
        roleId: "string",
      });
      const { userId, roleId } = payload;
      const newRoleToUser = await DiscordServices.addRoleToUser(userId, roleId);

      return generateResponse(200, newRoleToUser);
    } catch (error) {
      throw error as LambdaError;
    }
  }

  public static async removeRoleFromUser(data: {
    userId: string;
    roleId: string;
  }) {
    try {
      requireProperties("params.payload", data, {
        userId: "string",
        roleId: "string",
      });
      const { userId, roleId } = data;
      await DiscordServices.removeRoleFromUser(userId, roleId);
      return generateResponse(204, "Role removed from user");
    } catch (error) {
      throw error as LambdaError;
    }
  }

  public static async createInBlock(payload: {
    categoryName: string;
    roleName: string;
    channels: IChannelCreationData[];
  }) {
    try {
      requireProperties("params.payload", payload, {
        categoryName: "string",
        roleName: "string",
        channels: "object",
      });
      const { categoryName, roleName, channels } = payload;
      const res = await DiscordServices.createInBlock(
        categoryName,
        roleName,
        channels
      );
      return generateResponse(201, res);
    } catch (error) {
      throw error as LambdaError;
    }
  }

  public static async deleteChannelsAndRole(payload: {
    channels: string[];
    commissionRole: string;
    deleteCategory: boolean;
  }) {
    try {
      requireProperties("params.payload", payload, {
        channels: "array",
        commissionRole: "string",
        deleteCategory: "boolean",
      });
      const { channels, commissionRole, deleteCategory } = payload;
      await DiscordServices.deleteChannelsAndRoles(
        channels,
        commissionRole,
        deleteCategory
      );
      return generateResponse(204, "Resources deleted");
    } catch (error) {
      throw error as LambdaError;
    }
  }
}

const {
  createCategory,
  clearGuild,
  createVoiceChannel,
  createTextChannel,
  sendChannelMessage,
  deleteChannel,
  createCategoryRole,
  deleteRole,
  addRoleToUser,
  removeRoleFromUser,
  createInBlock,
  deleteChannelsAndRole,
} = DiscordController;

export default {
  CREATE_CATEGORY: createCategory,
  CLEAR_GUILD: clearGuild,
  CREATE_VOICE_CHANNEL: createVoiceChannel,
  CREATE_TEXT_CHANNEL: createTextChannel,
  SEND_MESSAGE_CHANNEL: sendChannelMessage,
  DELETE_CHANNEL: deleteChannel,
  CREATE_CATEGORY_ROLE: createCategoryRole,
  DELETE_ROLE: deleteRole,
  ADD_ROLE_TO_USER: addRoleToUser,
  REMOVE_ROLE_FROM_USER: removeRoleFromUser,
  CREATE_IN_BLOCK: createInBlock,
  DELETE_CHANNELS_AND_ROLE: deleteChannelsAndRole,
};
