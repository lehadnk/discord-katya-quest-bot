import AppServiceContainer from "../../AppServiceContainer";
import { TextChannel, MessageEmbed } from "discord.js";
import {guildBroadcastChannels, guildsById} from "../../Config/Guilds";
import User from "../../Models/User";

export default class NotificationService {
    private notification_channel_id: string = process.env.ADMIN_NOTIFICATION_CHANNEL_ID;

    public async notify(msg: string)
    {
        AppServiceContainer.discordClient.channels.fetch(this.notification_channel_id).then((c: TextChannel) => {
            c.send(msg);
        });
    }

    public async broadcast(msg: string)
    {
        guildBroadcastChannels.forEach(channelId => {
            AppServiceContainer.discordClient.channels.fetch(channelId).then((c: TextChannel) => {
                c.send(msg);
            });
        });
    }

    public async broadcastLevelup(user: User, rank: number): Promise<void>
    {
        let guild = guildsById.get(user.discord_guild_id);
        let positionText = rank == 1 ? "первым" : rank == 2 ? "вторым" : "третьим";
        let text = "Игрок " + positionText + " решил вопрос номер " + user.level + "! Поздравляем!";
        const embed = new MessageEmbed()
            .setAuthor(user.name, user.avatar_url)
            .setDescription(text)
            .setColor(guild.classColor);

        guildBroadcastChannels.forEach(channelId => {
            AppServiceContainer.discordClient.channels.fetch(channelId).then(async (c: TextChannel) => {
                await c.send({embed});
            });
        });
    }

    public async broadcastWin(user: User, rank: number): Promise<void>
    {
        let guild = guildsById.get(user.discord_guild_id);
        let positionText = rank == 1 ? "первым" : rank == 2 ? "вторым" : "третьим";
        let text = "Игрок " + positionText + " прошел игру! Поздравляем!";
        const embed = new MessageEmbed()
            .setAuthor(user.name, user.avatar_url)
            .setDescription(text)
            .setColor(guild.classColor);

        guildBroadcastChannels.forEach(channelId => {
            AppServiceContainer.discordClient.channels.fetch(channelId).then(async (c: TextChannel) => {
                await c.send({embed});
            });
        });
    }
}