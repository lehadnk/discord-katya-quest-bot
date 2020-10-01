import {ICommand} from "nergal";
import {AbstractCommand} from "nergal";
import User from "../Models/User";
import GameService from "../Services/Game/GameService";
import UsersDAO from "../DAO/UsersDAO";
import NotificationService from "../Services/NotificationService/NotificationService";
import TakenHintsDAO from "../DAO/TakenHintsDAO";
import AppServiceContainer from "../AppServiceContainer";

export default class TestGameComplete extends AbstractCommand implements ICommand {
    name: string = 'complete-game';

    async run(args: string[]) {
        let dao = new TakenHintsDAO(AppServiceContainer.db);
        console.log(await dao.getTotalPenalty(9));
    }
}