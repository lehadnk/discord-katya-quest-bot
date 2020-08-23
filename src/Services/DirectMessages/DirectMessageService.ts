import User from "../../Models/User";
import AppServiceContainer from "../../AppServiceContainer";

export default class DirectMessageService {
    async sendDm(user: User, text: string) {
        AppServiceContainer.discordClient.users.fetch(user.discord_user_id).then(u => {
            u.send(text);
        });
    }
}