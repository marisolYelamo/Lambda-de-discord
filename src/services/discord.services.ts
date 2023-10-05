import DiscordRepository from "../repositories/";
import { IChannelCreationData, IChannelData, IOverwrite } from "../types";
import { LambdaError } from "../utils/errors/handleErrors";
import { channelsIds } from "../utils/discord/constants";

class DiscordServices {
  public static async clearGuild() {
    try {
      return await DiscordRepository.clearGuild();
    } catch (error) {
      throw new LambdaError(error as LambdaError);
    }
  }

  public static async createCategory(data: IChannelData) {
    try {
      const res = await DiscordRepository.createCategory(data);
      return res;
    } catch (error) {
      throw new LambdaError(error as LambdaError);
    }
  }

  public static async createVoiceChannel(data: IChannelData) {
    try {
      const res = await DiscordRepository.createVoiceChannel(data);
      return res;
    } catch (error) {
      throw new LambdaError(error as LambdaError);
    }
  }

  public static async createTextChannel(data: IChannelData) {
    try {
      const res = await DiscordRepository.createTextChannel(data);
      return res;
    } catch (error) {
      throw new LambdaError(error as LambdaError);
    }
  }

  public static async sendChannelMessage(channelId: string, content: string) {
    try {
      const res = await DiscordRepository._sendChannelMessage(
        channelsIds[channelId as keyof typeof channelsIds] || channelId,
        content
      );
      return res;
    } catch (error) {
      throw new LambdaError(error as LambdaError);
    }
  }

  public static async deleteChannel(id: string) {
    try {
      await DiscordRepository.deleteChannel(id);
    } catch (error) {
      throw new LambdaError(error as LambdaError);
    }
  }

  public static async createCategoryRole(name: string) {
    try {
      const category = await DiscordRepository.createCategoryRole(name);
      return category;
    } catch (error) {
      throw new LambdaError(error as LambdaError);
    }
  }

  public static async deleteRole(id: string) {
    try {
      await DiscordRepository.deleteRole(id);
    } catch (error) {
      throw new LambdaError(error as LambdaError);
    }
  }

  public static async addRoleToUser(userId: string, roleId: string) {
    try {
      await DiscordRepository.addRoleToUser(userId, roleId);
      return { message: "Role added successfully" };
    } catch (error) {
      throw new LambdaError(error as LambdaError);
    }
  }

  public static async removeRoleFromUser(userId: string, roleId: string) {
    try {
      await DiscordRepository.removeRoleFromUser(userId, roleId);
      return { message: "Role remove successfully" };
    } catch (error) {
      throw new LambdaError(error as LambdaError);
    }
  }

  public static async createInBlock(
    categoryGuildName: string,
    roleName: string,
    channels: IChannelCreationData[]
  ) {
    try {
      const category = await DiscordRepository.getCategorys();
      let categoryFind = category.data.find(
        (rol: any) => rol.name === categoryGuildName
      );

      if (!categoryFind) {
        categoryFind = await DiscordRepository.createCategory({
          name: categoryGuildName,
        });
      }

      const role = await DiscordRepository.createCategoryRole(roleName);

      const textChannels = channels.filter(
        (channel) => channel.type === "text"
      );
      const voiceChannels = channels.filter(
        (channel) => channel.type === "voice"
      );

      const textPromises = textChannels.map((channel) => {
        const permission_overwrites: IOverwrite[] = channel.extraRolesIds.map(
          (id) => ({ id, type: 0 })
        );

        permission_overwrites.push({ id: role.id, type: 0 });

        return DiscordRepository.createTextChannel({
          name: channel.name,
          parent_id: categoryFind.id,
          permission_overwrites,
        });
      });

      const voicePromises = voiceChannels.map((channel) => {
        const permission_overwrites: IOverwrite[] = channel.extraRolesIds.map(
          (id) => ({ id, type: 0 })
        );

        permission_overwrites.push({ id: role.id, type: 0 });

        return DiscordRepository.createVoiceChannel({
          name: channel.name,
          parent_id: categoryFind.id,
          permission_overwrites,
        });
      });

      const createdChannels = await Promise.all([
        ...textPromises,
        ...voicePromises,
      ]);

      const channelsIds = createdChannels.map((channel) => channel.id);

      return { role: role.id, channels: channelsIds };
    } catch (error) {
      throw new LambdaError(error as LambdaError);
    }
  }

  public static async deleteChannelsAndRoles(
    channels: string[],
    commissionRole: string,
    deleteCategory: boolean
  ) {
    try {
      if (!channels.length) {
        throw new LambdaError({
          message: "Channels array must have items",
          status: 400,
        });
      }

      if (deleteCategory) {
        const channelToFind = channels[0];

        const foundChannel = await DiscordRepository.getChannelById(
          channelToFind
        );

        if (!foundChannel) {
          throw new LambdaError({ message: "Channel not found", status: 404 });
        }

        const category = await DiscordRepository.getChannelById(
          foundChannel.parent_id
        );

        if (!category) {
          throw new LambdaError({ message: "Category not found", status: 404 });
        }

        await DiscordRepository.deleteChannel(category.id);
      }

      const promiseChannels = channels.map(
        async (discordId: string) =>
          await DiscordRepository.deleteChannel(discordId)
      );
      await Promise.all(promiseChannels);
      if (commissionRole) await DiscordRepository.deleteRole(commissionRole);
    } catch (error) {
      throw new LambdaError(error as LambdaError);
    }
  }
}
export default DiscordServices;
