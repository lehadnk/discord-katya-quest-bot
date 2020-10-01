import {ICommand} from "nergal";
import {AbstractCommand} from "nergal";
import AppServiceContainer from "../AppServiceContainer";
import UsersDAO from "../DAO/UsersDAO";

export default class ListGuilds extends AbstractCommand implements ICommand {
    name: string = 'list-users';

    async run(args: string[]) {
        let count = 0;
        let dao = new UsersDAO(AppServiceContainer.db);
        let users = await dao.getAll();
        users.forEach(user => {
            console.log(user.name + ' (' + user.discord_user_id + ')');
        });

        console.log(users.length + " users total.");
    }
}