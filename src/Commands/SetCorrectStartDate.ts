import {ICommand} from "nergal";
import {AbstractCommand} from "nergal";
import User from "../Models/User";
import GameService from "../Services/Game/GameService";
import UsersDAO from "../DAO/UsersDAO";
import NotificationService from "../Services/NotificationService/NotificationService";
import TakenHintsDAO from "../DAO/TakenHintsDAO";
import AppServiceContainer from "../AppServiceContainer";
import DirectMessageService from "../Services/DirectMessages/DirectMessageService";

export default class SetCorrectStartDate extends AbstractCommand implements ICommand {
    name: string = 'fix-start-date';

    async run(args: string[]) {
        let usersDAO = new UsersDAO(AppServiceContainer.db);
        let users = await usersDAO.getAll();

        for (const user of users) {
            user.started_at = 1602273600;
            await usersDAO.save(user);
        }
    }
}