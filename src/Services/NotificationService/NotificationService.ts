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

    public async broadcastToChannels(msg: any)
    {
        guildBroadcastChannels.forEach((channelId) => {
            console.log("Sending notification " + msg + " to channel " + channelId);
            AppServiceContainer.discordClient.channels.fetch(channelId).then((channel: TextChannel) => {
                channel.send(msg).catch(e => {
                    console.error('Unable to send message to channel ' + channelId + ': missing permissions? ' + e);
                });
            }).catch(e => {
                console.error('Unable to send message to channel ' + channelId + ': cannot fetch - missing permissions? ' + e);
            });
        });
    }

    public async broadcastToPlayers(discord_ids: string[], msg: string)
    {
        discord_ids.forEach(discord_user_id => {
            console.log("Sending notification " + msg + " to player " + discord_user_id);
            AppServiceContainer.discordClient.users.fetch(discord_user_id)
                .then(user => {
                    user.send(msg).catch(e => {
                        console.error('Unable to send message to player ' + discord_user_id + ': missing permissions? ' + e);
                    });
                }).catch(e => {
                    console.error('Unable to send message to player ' + discord_user_id + ': cannot fetch - missing permissions? ' + e);
                });
        });
    }

    public async broadcastLevelup(user: User, rank: number): Promise<void>
    {
        let guild = guildsById.get(user.discord_guild_id);
        let positionText = rank == 1 ? "первым" : rank == 2 ? "вторым" : "третьим";
        let text = "Игрок " + positionText + " решил вопрос номер " + user.level + "! Поздравляем!";
        const embed = new MessageEmbed()
            .setAuthor(user.character_name, user.avatar_url)
            .setDescription(text)
            .setColor(guild.classColor);

        this.broadcastToChannels(embed);
    }

    public async broadcastWin(user: User, rank: number): Promise<void>
    {
        let guild = guildsById.get(user.discord_guild_id);
        let positionText = rank == 1 ? "первым" : rank == 2 ? "вторым" : "третьим";
        let text = "Игрок " + positionText + " прошел игру! Поздравляем!";
        const embed = new MessageEmbed()
            .setAuthor(user.character_name, user.avatar_url)
            .setDescription(text)
            .setColor(guild.classColor);

        this.broadcastToChannels(embed);
    }
}