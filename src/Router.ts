import {DiscordMessage} from "nergal";
import {DiscordControllerResponse} from "nergal";
import {IRouter} from 'nergal';
import AdminController from "./Controllers/AdminController";
import UsersDAO from "./DAO/UsersDAO";
import AppServiceContainer from "./AppServiceContainer";
import RegistrationController from "./Controllers/RegistrationController";
import GameController from "./Controllers/GameController";

export default class Router implements IRouter {
    private usersDao: UsersDAO = new UsersDAO(AppServiceContainer.db);
    private registrationController = new RegistrationController();

    async route(msg: DiscordMessage): Promise<DiscordControllerResponse> {
        if (msg.isAdmin && msg.isPrivate && msg.message.match(/\/.*/)) {
            let controller = new AdminController();
            return controller.handle(msg);
        }

        if (msg.isPrivate) {
            let user = await this.usersDao.getOneByField('discord_user_id', msg.authorId);
            if (!user) {
                return this.registrationController.handle(msg);
            } else {
                let controller = new GameController();
                return controller.handle(msg, user);
            }
        }
    }
}