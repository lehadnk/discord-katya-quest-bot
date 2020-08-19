import AbstractDAO from 'nergal/src/DAO/AbstractDAO';
import User from "../Models/User";
import { IDbAdapter } from 'nergal/src/Services/Db/IDbAdapter';

export default class UsersDAO extends AbstractDAO<User> {
    fields: string[] = ['id', 'name', 'discord_user_id', 'discord_guild_id', 'level'];
    table: string = 'users';

    public constructor(db: IDbAdapter) {
        super(db, () => new User());
    }

    public advanceLevel(user: User)
    {
        user.level += 1;
        return this.save(user);
    }
}