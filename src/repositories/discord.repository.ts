import createDiscordAPI from "../utils/discord/axios.instance";
import { IFetchAPI, IRole, IChannel, IChannelData, IRoleData } from "../types";
import { channelTypes } from "../utils/discord/constants";
import { ExternalError } from "../utils/errors/handleErrors";
import { getRandomInt, checkConnection } from "../utils/functions";

const MAX_RGB_NUMBER = 16777215;

class DiscordRepository {
  guildId: string;
  everyoneRoleId: string;
  discordAPI: (args: IFetchAPI) => any;

  constructor(token: string) {
    this.guildId = "";
    this.everyoneRoleId = "";
    this.discordAPI = createDiscordAPI(token);
  }

  private async _start() {
    try {
      const method = "get";
      const url = `/users/@me/guilds`;

      // Set the first client server
      const res = await this.discordAPI({ method, url });
      this.guildId = res.data[0].id || null;
      this._getEveryoneRole();
    } catch (error) {
      console.error(error);
    }
  }

  private async _getEveryoneRole() {
    const method = "get";
    const url = `/guilds/${this.guildId}`;

    const res = await this.discordAPI({ method, url });
    const [everyoneRole] = res.data.roles.filter(
      (role: IRole) => role.name === "@everyone"
    );

    this.everyoneRoleId = everyoneRole.id;
  }

  private async _createChannel(channel: IChannel, isPrivate: boolean) {
    if (isPrivate) {
      channel.permission_overwrites?.forEach((permmission) => {
        permmission.allow = "1049600";
      });
      channel.permission_overwrites?.push({
        id: this.everyoneRoleId,
        type: 0,
        deny: "1024",
      });
    }

    const method = "post";
    const url = `/guilds/${this.guildId}/channels`;
    const body = { ...channel, type: channelTypes[channel.type] };

    const res = await this.discordAPI({ method, url, body });

    return res.data;
  }

  private async _createGuildRole(role: IRoleData): Promise<IRole> {
    const method = "post";
    const url = `/guilds/${this.guildId}/roles`;

    const res = await this.discordAPI({ method, url, body: role });

    return res.data;
  }

  private async _removedRoles() {
    const method = "get";
    const url = `/guilds/${this.guildId}`;

    const res = await this.discordAPI({ method, url });
    const removedRolesPromises = res.data.roles.map((role: IRole) => {
      if (role.name !== "@everyone") return this.deleteRole(role.id);
      else return;
    });

    return Promise.all(removedRolesPromises);
  }

  private async _removedChannels() {
    const method = "get";
    const url = `/guilds/${this.guildId}/channels`;

    const res = await this.discordAPI({ method, url });
    const removedChannelsPromises = res.data.map((channel: { id: string }) =>
      this.deleteChannel(channel.id)
    );

    return Promise.all(removedChannelsPromises);
  }

  public async _sendChannelMessage(channelId: string, content: string) {
    const method = "post";
    const url = `/channels/${channelId}/messages`;

    const res = await this.discordAPI({ method, url, body: { content } });

    return res.data;
  }

  public async clearGuild() {
    try {
      const removedChannelsPromises = await this._removedChannels();
      const removedRolesPromises = await this._removedRoles();
      return Promise.all([...removedRolesPromises, ...removedChannelsPromises]);
    } catch (err: any) {
      if (err.response)
        throw new ExternalError("discord_error", {
          status: err.response.status,
          message: err.response.data.message,
        });
      else throw err;
    }
  }

  public async createCategory(data: IChannelData) {
    try {
      if (!this.guildId) {
        await this._start();
      }
      checkConnection(this.guildId);
      const type = "GUILD_CATEGORY";
      const isPrivate = true;

      return this._createChannel({ ...data, type }, isPrivate);
    } catch (err: any) {
      if (err.response)
        throw new ExternalError("discord_error", {
          status: err.response.status,
          message: err.response.data.message,
        });
      else throw err;
    }
  }

  public async createVoiceChannel(data: IChannelData) {
    try {
      if (!this.guildId) {
        await this._start();
      }
      checkConnection(this.guildId);
      const type = "GUILD_VOICE";
      const isPrivate = true;

      return this._createChannel({ ...data, type }, isPrivate);
    } catch (err: any) {
      if (err.response)
        throw new ExternalError("discord_error", {
          status: err.response.status,
          message: err.response.data.message,
        });
      else throw err;
    }
  }

  public async createTextChannel(data: IChannelData) {
    try {
      if (!this.guildId) {
        await this._start();
      }
      checkConnection(this.guildId);

      const type = "GUILD_TEXT";
      const isPrivate = true;

      return this._createChannel({ ...data, type }, isPrivate);
    } catch (err: any) {
      if (err.response)
        throw new ExternalError("discord_error", {
          status: err.response.status,
          message: err.response.data.message,
        });
      else throw err;
    }
  }

  public async deleteChannel(id: string) {
    try {
      if (!this.guildId) {
        await this._start();
      }
      checkConnection(this.guildId);
      const method = "delete";
      const url = `/channels/${id}`;

      const res = await this.discordAPI({ method, url });
      return res;
    } catch (err: any) {
      if (err.response)
        throw new ExternalError("discord_error", {
          status: err.response.status,
          message: err.response.data.message,
        });
      else throw err;
    }
  }

  public async createCategoryRole(name: string) {
    try {
      if (!this.guildId) {
        await this._start();
      }
      checkConnection(this.guildId);

      const color = getRandomInt(MAX_RGB_NUMBER);
      const mentionable = true;
      const permissions = "451008777792"; // permission bit set

      return this._createGuildRole({ name, color, mentionable, permissions });
    } catch (err: any) {
      if (err.response)
        throw new ExternalError("discord_error", {
          status: err.response.status,
          message: err.response.data.message,
        });
      else throw err;
    }
  }

  public async createCommissionRole(name: string) {
    try {
      if (!this.guildId) {
        await this._start();
      }
      checkConnection(this.guildId);

      const color = getRandomInt(MAX_RGB_NUMBER);
      const mentionable = true;
      const permissions = "451008777792"; // permission bit set

      return this._createGuildRole({ name, color, mentionable, permissions });
    } catch (err: any) {
      if (err.response)
        throw new ExternalError("discord_error", {
          status: err.response.status,
          message: err.response.data.message,
        });
      else throw err;
    }
  }

  public async deleteRole(id: string) {
    try {
      if (!this.guildId) {
        await this._start();
      }
      checkConnection(this.guildId);
      const method = "delete";
      const url = `/guilds/${this.guildId}/roles/${id}`;
      const res = await this.discordAPI({ method, url });

      return res;
    } catch (err: any) {
      if (err.response)
        throw new ExternalError("discord_error", {
          status: err.response.status,
          message: err.response.data.message,
        });
      else throw err;
    }
  }

  public async addRoleToUser(userId: string, roleId: string) {
    try {
      if (!this.guildId) {
        await this._start();
      }
      checkConnection(this.guildId);
      const method = "put";
      const url = `/guilds/${this.guildId}/members/${userId}/roles/${roleId}`;

      const res = await this.discordAPI({ method, url });
      return res;
    } catch (err: any) {
      if (err.response)
        throw new ExternalError("discord_error", {
          status: err.response.status,
          message: err.response.data.message,
        });
      else throw err;
    }
  }

  public async removeRoleFromUser(userId: string, roleId: string) {
    try {
      if (!this.guildId) {
        await this._start();
      }
      checkConnection(this.guildId);

      const method = "delete";
      const url = `/guilds/${this.guildId}/members/${userId}/roles/${roleId}`;

      const res = await this.discordAPI({ method, url });
      return res;
    } catch (err: any) {
      if (err.response)
        throw new ExternalError("discord_error", {
          status: err.response.status,
          message: err.response.data.message,
        });
      else throw err;
    }
  }

  public async getCategorys() {
    try {
      if (!this.guildId) {
        await this._start();
      }
      checkConnection(this.guildId);
      const method = "get";
      const url = `/guilds/${this.guildId}/channels`;
      let categorys = await this.discordAPI({ method, url });

      return categorys;
    } catch (err: any) {
      if (err.response)
        throw new ExternalError("discord_error", {
          status: err.response.status,
          message: err.response.data.message,
        });
      else throw err;
    }
  }

  public async getChannelById(channelId: string) {
    try {
      if (!this.guildId) {
        await this._start();
      }
      checkConnection(this.guildId);
      const method = "get";
      const url = `/channels/${channelId}`;
      const res = await this.discordAPI({ method, url });

      return res.data;
    } catch (err: any) {
      if (err.response)
        throw new ExternalError("discord_error", {
          status: err.response.status,
          message: err.response.data.message,
        });
      else throw err;
    }
  }
}

export default DiscordRepository;
