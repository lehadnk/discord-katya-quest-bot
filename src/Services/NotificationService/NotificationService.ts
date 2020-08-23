import AppServiceContainer from "../../AppServiceContainer";
import { TextChannel } from "discord.js";

export default class NotificationService {
    private notification_channel_id: string = process.env.ADMIN_NOTIFICATION_CHANNEL_ID;

    public async notify(msg: string) {
        AppServiceContainer.discordClient.channels.fetch(this.notification_channel_id).then((c: TextChannel) => {
            c.send(msg);
        })
    }
}