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

    async getNonnotified() {
        let data = await this.db.all("SELECT *\n" +
            "FROM users\n" +
            "WHERE id IN (328,376,375,303,287,415,421,315,313,308,311,350,340,412,334,408,290,342,322,326,296,401,312,306,317,324,390,291,369,331,370,360,379,399,419,378,349,302,389,400,396,288,285,420,411,297,381,367,365,356,351,293,410,416,385,289,320,355,338,402,316,417,387,380,284,345,373,325,319,383,388,394,323,353,301,286,321,294,418,361,330,304,371,372,357,359,318,346,386,343,283,295,347,314,409,300,377,392,333,368,336,395,292,358,403,405,352,384,341,348,332,398,391,407,335,299,413,362,327,354,364,414,382,366,363,404,339,406,298,374,397,310,393,309,344,305,329,307,337)");

        return data.map(u => this.populate(u));
    }

    async getWithIncorrectStartDate() {
        let data = await this.db.all("SELECT *\n" +
            "FROM users\n" +
            "WHERE started_at = 1602273600");

        return data.map(u => this.populate(u));
    }
}