import {AbstractDAO} from 'nergal';
import {IDbAdapter} from 'nergal';
import TakenHint from "../Models/TakenHint";
import User from "../Models/User";

export default class TakenHintsDAO extends AbstractDAO<TakenHint> {
    fields: string[] = ['id', 'user_id', 'level', 'amount', 'penalty'];
    table: string = 'taken_hints';

    public constructor(db: IDbAdapter) {
        super(db, () => new TakenHint());
    }

    public async getCurrent(user: User): Promise<TakenHint>
    {
        let data = await this.db.one("SELECT * FROM taken_hints WHERE user_id = ?1 AND level = ?2", {
            1: user.id,
            2: user.level,
        });

        return data ? this.populate(data) : null;
    }

    async getTotalPenalty(user_id: number): Promise<number>
    {
        return parseInt(await this.db.value("SELECT sum(penalty) FROM taken_hints WHERE user_id = ?1", {
            1: user_id,
        }));
    }
}