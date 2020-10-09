import {ICommand} from "nergal";
import {AbstractCommand} from "nergal";
import User from "../Models/User";
import GameService from "../Services/Game/GameService";
import UsersDAO from "../DAO/UsersDAO";
import NotificationService from "../Services/NotificationService/NotificationService";
import TakenHintsDAO from "../DAO/TakenHintsDAO";
import AppServiceContainer from "../AppServiceContainer";
import DirectMessageService from "../Services/DirectMessages/DirectMessageService";

export default class FindWinners extends AbstractCommand implements ICommand {
    name: string = 'find-winners';

    async run(args: string[]) {
    }
}