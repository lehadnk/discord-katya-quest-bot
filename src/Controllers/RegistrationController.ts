import {DiscordControllerResponse} from "nergal/src/DTO/DiscordControllerResponse";
import RegistrationData from "../DTO/RegistrationData";
import {DiscordMessage} from "nergal/src/DTO/DiscordMessage";
import EmojiReference from "nergal/src/DTO/EmojiReference";
import {guildByEmoji, guildsById} from "../Config/Guilds";
import ReactionCollector from "nergal/src/DTO/ReactionCollector";
import UsersDAO from "../DAO/UsersDAO";
import AppServiceContainer from "../AppServiceContainer";
import User from "../Models/User";
import GameService from "../Services/Game/GameService";

export default class RegistrationController {
    private userData: Map<string, RegistrationData> = new Map<string, RegistrationData>();
    private gameService: GameService = new GameService();

    public async handle(msg: DiscordMessage): Promise<DiscordControllerResponse>
    {
        if (!this.userData.has(msg.authorId)) {
            this.userData.set(msg.authorId, new RegistrationData());
            let emojis: EmojiReference[] = [];
            guildsById.forEach(g => emojis.push(new EmojiReference('296690626244902913', g.icon)));
            let collector = new ReactionCollector();
            collector.time = 150000;
            collector.lambda = async (reaction, user) => {
                let guild = guildByEmoji.get(reaction.emoji.name);
                if (!guild) return;

                let dao = new UsersDAO(AppServiceContainer.db);
                let usr = new User();
                usr.name = user.username;
                usr.discord_user_id = user.id;
                usr.discord_guild_id = guild.discord_id;
                usr.level = 1;

                await dao.save(usr);

                user.send("Registration success message");

                setTimeout(async () => {
                    let question = await this.gameService.getCurrentQuestion(usr);
                    user.send(question.text);
                }, 5000);
            };
            return new DiscordControllerResponse("Select classhall msg", null, false, emojis, collector);
        }

        return new DiscordControllerResponse("Please select a class", null, false);
    }
}