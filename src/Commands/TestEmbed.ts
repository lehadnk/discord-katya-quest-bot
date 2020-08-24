import {default as ICommand} from "nergal/src/Commands/ICommand";
import AbstractCommand from "nergal/src/Commands/AbstractCommand";
import AppServiceContainer from "../AppServiceContainer";
import NotificationService from "../Services/NotificationService/NotificationService";
import UsersDAO from "../DAO/UsersDAO";

export default class TestEmbed extends AbstractCommand implements ICommand {
    name: string = 'test-embed';

    async run(args: string[]) {
        let service = new NotificationService();
        let dao = new UsersDAO(this.db);
        let user = await dao.getOneByField('name', 'lehadnk');
        await service.broadcast("123");
        await service.broadcastLevelup(user, 1);
        await setTimeout(() => 1, 5000);
    }
}