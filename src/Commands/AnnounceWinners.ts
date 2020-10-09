import {ICommand} from "nergal";
import {AbstractCommand} from "nergal";
import User from "../Models/User";
import GameService from "../Services/Game/GameService";
import UsersDAO from "../DAO/UsersDAO";
import NotificationService from "../Services/NotificationService/NotificationService";
import TakenHintsDAO from "../DAO/TakenHintsDAO";
import AppServiceContainer from "../AppServiceContainer";
import DirectMessageService from "../Services/DirectMessages/DirectMessageService";
import {MessageEmbed} from "discord.js";
import {guildsById} from "../Config/Guilds";

export default class AnnounceWinners extends AbstractCommand implements ICommand {
    name: string = 'announce-winners';

    async run(args: string[]) {
        let dao = new UsersDAO(AppServiceContainer.db);
        let rank1 = await dao.get(88);
        let rank2 = await dao.get(418);
        let rank3 = await dao.get(359);

        let notificationService = new NotificationService();
        await notificationService.broadcastToChannels("Друзья, всем спасибо за игру, три первых победителя завершили игру, и выбрали свои призы. Бот будет активен до среды, так что вы можете завершить игру просто для удовольствия, либо на скорость. Если вы уже прошли игру, вы можете получить личную статистику по прохождению командой `!моястата`. Спасибо всем участникам!")
        await this.notifyPlayer(rank1, "Завершил игру первым. В качестве приза получил: https://www.ozon.ru/product/world-of-warcraft-figurki-garrosh-adskiy-krik-garrosh-hellscream-26-sm-188393055/");
        await this.notifyPlayer(rank2, "Завершил игру вторым. В качестве приза приручил Космического лиса: https://eu.shop.battle.net/ru-ru/product/world-of-warcraft-mount-vulpine-familiar");
        await this.notifyPlayer(rank3, "Завершил игру третьим. В качестве приза так же взял Космического лиса.");
        console.log('tes');
    }

    private async notifyPlayer(user: User, text: string)
    {
        let notificationService = new NotificationService();
        let guild = guildsById.get(user.discord_guild_id);

        const embed = new MessageEmbed()
            .setAuthor(user.character_name, user.avatar_url)
            .setDescription(text)
            .setColor(guild.classColor);

        await notificationService.broadcastToChannels(embed);
    }
}