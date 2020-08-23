import User from "../../Models/User";
import AppServiceContainer from "../../AppServiceContainer";

export default class DirectMessageService {
    async sendDm(discord_user_id: string, text: string) {
        AppServiceContainer.discordClient.users.fetch(discord_user_id).then(u => {
            u.send(text);
        });
    }
}