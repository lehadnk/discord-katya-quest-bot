import {ICommand} from "nergal";
import {AbstractCommand} from "nergal";
import User from "../Models/User";
import GameService from "../Services/Game/GameService";
import UsersDAO from "../DAO/UsersDAO";
import NotificationService from "../Services/NotificationService/NotificationService";
import TakenHintsDAO from "../DAO/TakenHintsDAO";
import AppServiceContainer from "../AppServiceContainer";
import DirectMessageService from "../Services/DirectMessages/DirectMessageService";

export default class TestGameComplete extends AbstractCommand implements ICommand {
    name: string = 'notify-start';

    async run(args: string[]) {
        let gameService = new GameService();
        let dmService = new DirectMessageService();
        let usersDAO = new UsersDAO(AppServiceContainer.db);
        let users = await usersDAO.getAll();

        users.forEach(async user => {
            let question = await gameService.getCurrentQuestion(user);
            await dmService.sendDm(user.discord_user_id, question.text);
        });
    }
}