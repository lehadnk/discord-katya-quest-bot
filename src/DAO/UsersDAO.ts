import {AbstractDAO} from 'nergal';
import User from "../Models/User";
import {IDbAdapter} from 'nergal';
import GameService from "../Services/Game/GameService";

export default class UsersDAO extends AbstractDAO<User> {
    fields: string[] = ['id', 'name', 'discord_user_id', 'discord_guild_id', 'level', 'realm', 'started_at', 'avatar_url', 'time_to_complete', 'character_name', 'faction'];
    table: string = 'users';

    public constructor(db: IDbAdapter) {
        super(db, () => new User());
    }

    public advanceLevel(user: User)
    {
        user.level += 1;
        return this.save(user);
    }

    public async getActive(): Promise<User[]>
    {
        let data = await this.db.all("SELECT * FROM users WHERE time_to_complete IS NULL");
        return data.map(u => this.populate(u));
    }

    public async getWinners(): Promise<User[]>
    {
        let data = await this.db.all("SELECT u.*\n" +
            "FROM answer_attempts aa\n" +
            "JOIN users u on aa.user_id = u.id\n" +
            "WHERE u.level = ?1 AND aa.level = 11 AND aa.is_correct = true\n" +
            "ORDER BY given_at ASC\n" +
            "LIMIT 3;", {
            1: GameService.questionsTotal + 1,
        });

        return data.map(u => this.populate(u));
    }

    public async getLeaderboard(): Promise<any[]>
    {
        let data = await this.db.all("SELECT u.*, sum(th.amount) as hints\n" +
            "FROM users u\n" +
            "JOIN taken_hints th ON u.id = th.user_id\n" +
            "WHERE u.level = 12\n" +
            "ORDER BY time_to_complete ASC\n" +
            "LIMIT 10;");
        return data.filter(u => !!u.id);
    }
}