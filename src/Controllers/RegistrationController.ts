import {DiscordControllerResponse} from "nergal/src/DTO/DiscordControllerResponse";
import RegistrationData, {RegistrationStage} from "../DTO/RegistrationData";
import {DiscordMessage} from "nergal/src/DTO/DiscordMessage";
import EmojiReference from "nergal/src/DTO/EmojiReference";
import Guild, {guildByEmoji, guildsById} from "../Config/Guilds";
import ReactionCollector from "nergal/src/DTO/ReactionCollector";
import UsersDAO from "../DAO/UsersDAO";
import AppServiceContainer from "../AppServiceContainer";
import User from "../Models/User";
import GameService from "../Services/Game/GameService";
import DirectMessageService from "../Services/DirectMessages/DirectMessageService";
import NotificationService from "../Services/NotificationService/NotificationService";

export default class RegistrationController {
    private userData: Map<string, RegistrationData> = new Map<string, RegistrationData>();
    private gameService: GameService = new GameService();
    private usersDao = new UsersDAO(AppServiceContainer.db);
    private directMessageService = new DirectMessageService();
    private notificationService = new NotificationService();

    public async handle(msg: DiscordMessage): Promise<DiscordControllerResponse>
    {
        if (!this.userData.has(msg.authorId)) {
            return this.startRegistration(msg);
        }

        let userData = this.userData.get(msg.authorId);
        switch (userData.stage) {
            case RegistrationStage.REALM_SELECTION:
                return this.selectRealm(userData, msg.message);
            case RegistrationStage.FACTION_SELECTION:
                return this.selectFaction(msg, userData, msg.message);
        }

        return null;
    }

    private async startRegistration(msg: DiscordMessage): Promise<DiscordControllerResponse>
    {
        let registrationData = new RegistrationData();
        registrationData.stage = RegistrationStage.GUILD_SELECTION;
        this.userData.set(msg.authorId, registrationData);

        let emojis: EmojiReference[] = [];
        guildsById.forEach(g => emojis.push(new EmojiReference('296690626244902913', g.icon)));

        let collector = new ReactionCollector();
        collector.time = 150000;
        collector.lambda = async (reaction, user) => {
            this.selectGuild(reaction.emoji.name, user.id);
        };

        return new DiscordControllerResponse("Select class hall msg", null, false, emojis, collector);
    }

    private async selectGuild(emojiName: string, discord_user_id: string)
    {
        let guild = guildByEmoji.get(emojiName);
        if (!guild) return;

        let userData = this.userData.get(discord_user_id);
        userData.guild = guild;
        userData.stage = RegistrationStage.REALM_SELECTION;

        this.directMessageService.sendDm(discord_user_id, "Please provide your realm name.");
    }

    private async register(guild: Guild, realm: string, faction: string, discord_user_id: string, username: string)
    {
        let user = new User();
        user.name = username;
        user.discord_user_id = discord_user_id;
        user.discord_guild_id = guild.discord_id;
        user.realm = realm;
        user.level = 1;
        user.started_at = Date.now() / 1000;

        await this.usersDao.save(user);

        this.notificationService.notify("New user notification:\nName: " + user.name + "\nServer: " + guild.name + "\nRealm: " + realm + "\nFaction: " + faction);
        this.directMessageService.sendDm(user.discord_user_id, "Registration success message");

        setTimeout(async () => {
            let question = await this.gameService.getCurrentQuestion(user);
            await this.directMessageService.sendDm(user.discord_user_id, question.text);
        }, 5000);
    }

    private selectRealm(userData: RegistrationData, message: string): DiscordControllerResponse
    {
        userData.realm = message;
        userData.stage = RegistrationStage.FACTION_SELECTION;
        return new DiscordControllerResponse("Please select your faction (альянс/орда):");
    }

    private async selectFaction(msg: DiscordMessage, userData: RegistrationData, message: string): Promise<DiscordControllerResponse>
    {
        if (message.toLowerCase() !== 'орда' && message.toLowerCase() !== 'альянс') {
            return new DiscordControllerResponse("Please select a faction (орда/альянс):", null, false);
        }

        await this.register(userData.guild, userData.realm, message, msg.authorId, msg.authorName);
        this.userData.delete(msg.authorId);
        return null;
    }
}